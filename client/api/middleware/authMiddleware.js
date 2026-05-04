import jwt from 'jsonwebtoken';
import User from '../models/userSchema.js';

// בדיקה אם המשתמש מחובר (אימות טוקן)
export const protect = async (req, res, next) => {
    let token;

    token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: "לא מורשה, אין טוקן במערכת" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = await User.findById(decoded._id).select('-password');

        next();
    } catch (error) {
        res.status(401).json({ message: "טוקן לא תקף" });
    }
};

// בדיקה אם המשתמש הוא מנהל 
export const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: "גישה נדחתה: דף זה מיועד למנהלים בלבד" });
    }
};