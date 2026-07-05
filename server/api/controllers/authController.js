import User from '../models/userSchema.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { sendStatusEmail } from '../services/emailService.js';
import { registerSchema, loginSchema } from '../validations/authValidation.js';

// הרשמה
export const register = async (req, res) => {
    const { error } = registerSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    try {
        const { username, password, id, name, email } = req.body;

        const existingUser = await User.findOne({ $or: [{ username }, { id: id }] });
        if (existingUser) {
            return res.status(400).json({ message: "משתמש זה כבר קיים במערכת" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const userCount = await User.countDocuments();
        const newUser = new User({
            username,
            id: id,
            name: name,
            password: hashedPassword,
            email: email,
            role: userCount === 0 ? 'admin' : 'student'
        });

        await newUser.save();
        res.status(201).json({ message: "נרשמת בהצלחה!" });
    } catch (err) {
        console.error("Server Error Details:", err);
        res.status(500).json({ message: "שגיאת שרת פנימית", error: err.message });
    }
};

// כניסה
export const login = async (req, res) => {
    const { error } = loginSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: "פרטי התחברות שגויים" });
        }

        const token = jwt.sign(
            { _id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 86400000
        });

        res.json({
            message: `שלום ${user.name}`,
            user: {
                username: user.username,
                name: user.name,
                role: user.role,
                id: user.id,
                _id: user._id,
                email: user.email
            }
        });
    } catch (err) {
        res.status(500).json({ message: "שגיאה בהתחברות" });
    }
};

export const checkAuth = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "לא מחובר" });
        }

        res.status(200).json({
            user: req.user
        });
    } catch (error) {
        res.status(500).json({ message: "שגיאה בשרת" });
    }
};

export const logout = (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ message: "התנתקת בהצלחה" });
};