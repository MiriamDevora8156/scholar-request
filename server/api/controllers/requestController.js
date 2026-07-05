import Request from '../models/requestSchema.js';
import fs from 'fs';
import { sendStatusEmail } from '../services/emailService.js';
import { requestSchema } from '../validations/requestValidation.js';
import User from '../models/userSchema.js';
import path from 'path';

// הגשת בקשה חדשה
export const submitRequest = async (req, res) => {
    try {
        console.log("Body received:", req.body);

        const parseField = (field) => {
            if (!field) return {};
            return typeof field === 'string' ? JSON.parse(field) : field;
        };

        const personal = parseField(req.body.personal);
        const family = parseField(req.body.family);
        const course = parseField(req.body.course);
        const bank = parseField(req.body.bank);

        personal.name = personal.name || req.user.name;
        personal.id = personal.id || req.user.id;

        const { error } = requestSchema.validate({ personal, family, course, bank });
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
        if (req.files) {
            if (req.files['idCardFile']) personal.idCardFile = req.files['idCardFile'][0].path;
            if (req.files['tuitionFile']) course.tuitionFile = req.files['tuitionFile'][0].path;
            if (req.files['bankConfirmationFile']) bank.bankConfirmationFile = req.files['bankConfirmationFile'][0].path;
            if (req.files['fatherSlip']) family.fatherSlip = req.files['fatherSlip'][0].path;
            if (req.files['motherSlip']) family.motherSlip = req.files['motherSlip'][0].path;
        }

        // 1. יצירת תיקיית final עבור המשתמש במידה ולא קיימת
        const userFinalDir = `uploads/${req.user._id}/final`;
        if (!fs.existsSync(userFinalDir)) {
            fs.mkdirSync(userFinalDir, { recursive: true });
        }

        const existingDraft = await Request.findOne({ userId: req.user._id, status: 'draft' });

        // 2. שמירת נתיבים ישנים מהטיוטה (רק אם לא הועלה קובץ חדש ב-req.files)
        if (existingDraft) {
            if (!req.files?.['idCardFile'] && existingDraft.personal?.idCardFile)
                personal.idCardFile = existingDraft.personal.idCardFile;
            if (!req.files?.['tuitionFile'] && existingDraft.course?.tuitionFile)
                course.tuitionFile = existingDraft.course.tuitionFile;
            if (!req.files?.['bankConfirmationFile'] && existingDraft.bank?.bankConfirmationFile)
                bank.bankConfirmationFile = existingDraft.bank.bankConfirmationFile;
            if (!req.files?.['fatherSlip'] && existingDraft.family?.fatherSlip)
                family.fatherSlip = existingDraft.family.fatherSlip;
            if (!req.files?.['motherSlip'] && existingDraft.family?.motherSlip)
                family.motherSlip = existingDraft.family.motherSlip;
        }

        // 3. פונקציית העברה משופרת: תומכת בלוכסנים של ווינדוס ולינוקס כאחד
        const moveFile = (srcPath) => {
            if (!srcPath || !fs.existsSync(srcPath)) return srcPath;

            // בדיקה גמישה שעובדת גם עם \ וגם עם /
            const isDraft = srcPath.includes('draft') || srcPath.includes('/draft/') || srcPath.includes('\\draft\\');

            if (isDraft) {
                const fileName = path.basename(srcPath);
                const destPath = path.join(userFinalDir, fileName).replace(/\\/g, '/'); // שמירה תמידית עם לוכסן רגיל ב-DB

                try {
                    fs.renameSync(srcPath, destPath);
                    return destPath;
                } catch (err) {
                    console.error(`Failed to move file ${srcPath}:`, err.message);
                    return srcPath;
                }
            }
            return srcPath;
        };

        // 4. העברה של כל הקבצים הסופיים (בין אם הגיעו מהטיוטה ובין אם הועלו עכשיו לטיוטה)
        if (personal.idCardFile) personal.idCardFile = moveFile(personal.idCardFile);
        if (course.tuitionFile) course.tuitionFile = moveFile(course.tuitionFile);
        if (bank.bankConfirmationFile) bank.bankConfirmationFile = moveFile(bank.bankConfirmationFile);
        if (family.fatherSlip) family.fatherSlip = moveFile(family.fatherSlip);
        if (family.motherSlip) family.motherSlip = moveFile(family.motherSlip);

        // 5. יצירת הבקשה החדשה ושמירתה בסטטוס waiting
        const newRequest = new Request({
            userId: req.user._id,
            personal,
            family: {
                ...family,
                siblings: family.siblings || []
            },
            course,
            bank,
            status: 'waiting'
        });

        const savedRequest = await newRequest.save();

        // שליחת מייל
        try {
            const user = await User.findById(req.user._id);
            if (user?.email) {
                await sendStatusEmail(user.email, user.name, 'waiting');
            }
        } catch (mailErr) {
            console.error('Email send failed:', mailErr.message);
        }

        // 6. מחיקת הטיוטה ממסד הנתונים
        await Request.deleteOne({ userId: req.user._id, status: 'draft' });

        // 7. מחיקה בטוחה של תיקיית הטיוטה הפיזית רק אם היא ריקה או שאין בה קבצים נחוצים
        const draftDir = `uploads/${req.user._id}/draft`;
        if (fs.existsSync(draftDir)) {
            try {
                // מחיקה רק אם כל הקבצים הרלוונטיים כבר מחוץ לטיוטה
                const remainingFiles = fs.readdirSync(draftDir);
                if (remainingFiles.length === 0) {
                    fs.rmSync(draftDir, { recursive: true, force: true });
                } else {
                    console.log("Draft directory is not empty yet, skipping deletion to prevent data loss.");
                }
            } catch (dirErr) {
                console.error("Error cleaning draft directory:", dirErr.message);
            }
        }

        res.status(201).json(savedRequest);
    } catch (error) {
        console.error("SERVER CRASH:", error);
        if (error.name === 'ValidationError') {
            console.log("Mongoose Validation Error:", error.errors);
        }
        res.status(400).json({ message: "Error submitting request", error: error.message });
    }
};

export const getPendingRequests = async (req, res) => {
    try {
        const {
            id, city, fromDate, toDate, maxSalary,
            minSiblings, minSalary, sortBy, order
        } = req.query;

        let filter = { status: { $in: ['waiting', 'reject'] } };

        if (id) filter['personal.id'] = id;
        if (city) filter['personal.address'] = { $regex: city, $options: 'i' };

        // סינון תאריכים
        if (fromDate || toDate) {
            filter.createdAt = {};
            if (fromDate) filter.createdAt.$gte = new Date(fromDate);
            if (toDate) {
                const end = new Date(toDate);
                end.setHours(23, 59, 59, 999);
                filter.createdAt.$lte = end;
            }
        }

        // סינון מספרים (ילדים ושכר)
        if (minSiblings) filter['family.numChildren'] = { $gte: Number(minSiblings) };
        if (minSalary || maxSalary) {
            filter['course.payment'] = {};
            if (minSalary) filter['course.payment'].$gte = Number(minSalary);
            if (maxSalary) filter['course.payment'].$lte = Number(maxSalary);
        }
        // מיון דינמי
        let sortQuery = {};
        if (sortBy === 'tuition') {
            sortQuery['course.payment'] = order === 'desc' ? -1 : 1;
        } else if (sortBy === 'family.numChildren') {
            sortQuery['family.numChildren'] = order === 'desc' ? -1 : 1;
        } else {
            sortQuery.createdAt = order === 'desc' ? -1 : 1;
        }

        const requests = await Request.find(filter, {
            'personal.id': 1,
            'personal.name': 1,
            'personal.lastName': 1,
            'course.trend': 1,
            'status': 1,
            'createdAt': 1
        }).sort(sortQuery);
        res.status(200).json(requests);
    } catch (error) {
        res.status(500).json({ message: "Error fetching requests", error: error.message });
    }
};

// עדכון סטטוס בקשה (אישור/דחייה)
export const updateRequestStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const updatedRequest = await Request.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!updatedRequest) {
            return res.status(404).json({ message: "בקשה לא נמצאה" });
        }

        try {
            const requestUser = await User.findById(updatedRequest.userId);
            if (requestUser?.email) {
                await sendStatusEmail(requestUser.email, requestUser.name, status);
            }
        } catch (mailErr) {
            console.error('Email send failed:', mailErr.message);
        }

        res.status(200).json(updatedRequest);
    } catch (error) {
        res.status(400).json({ message: "שגיאה בעדכון הסטטוס" });
    }
};

export const appealRequest = async (req, res) => {
    try {
        const { id } = req.params;

        // עדכון הסטטוס בבסיס הנתונים ל-'waiting'
        const updatedRequest = await Request.findByIdAndUpdate(
            id,
            { status: 'waiting' },
            { new: true }
        );

        if (!updatedRequest) {
            return res.status(404).json({ message: "בקשה לא נמצאה" });
        }

        // --- תוספת קוד שליחת המייל ---
        try {
            // שליפת פרטי המשתמש כדי לקבל את כתובת המייל והשם
            const requestUser = await User.findById(updatedRequest.userId);
            if (requestUser?.email) {
                // שליחת המייל המעדכן על סטטוס 'waiting' (המתנה לבדיקה מחדש)
                await sendStatusEmail(requestUser.email, requestUser.name, 'waiting');
            }
        } catch (mailErr) {
            // הדפסת שגיאה לטרמינל אם המייל נכשל, מבלי לעצור את תגובת השרת למשתמש
            console.error('Email send failed in appeal:', mailErr.message);
        }
        // ------------------------------

        res.status(200).json(updatedRequest);
    } catch (error) {
        res.status(400).json({ message: "שגיאה בעדכון הסטטוס" });
    }
}

// שליפת הבקשה האחרונה של המשתמש המחובר (עבור דף הסטטוס)
export const getMyStatus = async (req, res) => {
    try {
        // אנחנו מחפשים בקשה שהיא לא טיוטה
        const request = await Request.findOne({
            userId: req.user._id,
            status: { $ne: 'draft' }
        }).sort({ createdAt: -1 });

        res.status(200).json(request);
    } catch (error) {
        res.status(500).json({ message: "שגיאה בשליפת סטטוס" });
    }
};

// שליפת בקשה בודדת לפי ID
export const getRequestById = async (req, res) => {
    try {
        const { id } = req.params;

        // שליפת הבקשה ומילוי פרטי המשתמש (אם תרצי להציג שם/אימייל של המגיש)
        const request = await Request.findById(id)
        if (!request) {
            return res.status(404).json({ message: "בקשה לא נמצאה" });
        }

        res.status(200).json(request);
    } catch (error) {

        // טיפול במקרה שה-ID לא בפורמט תקין של MongoDB
        if (error.kind === 'ObjectId') {
            return res.status(400).json({ message: "פורמט ID לא תקין" });
        }
        res.status(500).json({ message: "שגיאה בשרת בעת שליפת הבקשה" });
    }
};

export const saveDraft = async (req, res) => {
    try {
        const userId = req.user._id;
        const personal = req.body.personal ? JSON.parse(req.body.personal) : {};
        const family = req.body.family ? JSON.parse(req.body.family) : {};
        const course = req.body.course ? JSON.parse(req.body.course) : {};
        const bank = req.body.bank ? JSON.parse(req.body.bank) : {};

        // שליפת הטיוטה הקיימת
        const existingDraft = await Request.findOne({ userId, status: 'draft' });

        // שמירת נתיבים ישנים אם לא הועלו קבצים חדשים
        if (existingDraft) {
            if (!req.files?.['idCardFile'] && existingDraft.personal?.idCardFile)
                personal.idCardFile = existingDraft.personal.idCardFile;
            if (!req.files?.['tuitionFile'] && existingDraft.course?.tuitionFile)
                course.tuitionFile = existingDraft.course.tuitionFile;
            if (!req.files?.['bankConfirmationFile'] && existingDraft.bank?.bankConfirmationFile)
                bank.bankConfirmationFile = existingDraft.bank.bankConfirmationFile;
            if (!req.files?.['fatherSlip'] && existingDraft.family?.fatherSlip)
                family.fatherSlip = existingDraft.family.fatherSlip;
            if (!req.files?.['motherSlip'] && existingDraft.family?.motherSlip)
                family.motherSlip = existingDraft.family.motherSlip;
        }

        // מחיקת קבצים ישנים אם הועלו קבצים חדשים במקומם
        if (existingDraft && req.files) {
            const deleteIfExists = (filePath) => {
                if (filePath && fs.existsSync(filePath)) fs.unlinkSync(filePath);
            };
            if (req.files['idCardFile'] && existingDraft.personal?.idCardFile)
                deleteIfExists(existingDraft.personal.idCardFile);
            if (req.files['tuitionFile'] && existingDraft.course?.tuitionFile)
                deleteIfExists(existingDraft.course.tuitionFile);
            if (req.files['bankConfirmationFile'] && existingDraft.bank?.bankConfirmationFile)
                deleteIfExists(existingDraft.bank.bankConfirmationFile);
            if (req.files['fatherSlip'] && existingDraft.family?.fatherSlip)
                deleteIfExists(existingDraft.family.fatherSlip);
            if (req.files['motherSlip'] && existingDraft.family?.motherSlip)
                deleteIfExists(existingDraft.family.motherSlip);
        }

        // שמירת נתיבי קבצים חדשים
        if (req.files) {
            if (req.files['idCardFile']) personal.idCardFile = req.files['idCardFile'][0].path;
            if (req.files['tuitionFile']) course.tuitionFile = req.files['tuitionFile'][0].path;
            if (req.files['bankConfirmationFile']) bank.bankConfirmationFile = req.files['bankConfirmationFile'][0].path;
            if (req.files['fatherSlip']) family.fatherSlip = req.files['fatherSlip'][0].path;
            if (req.files['motherSlip']) family.motherSlip = req.files['motherSlip'][0].path;
        }

        const draftData = { personal, family, course, bank, userId, status: 'draft', updatedAt: new Date() };

        const draft = await Request.findOneAndUpdate(
            { userId, status: 'draft' },
            draftData,
            { upsert: true, new: true, runValidators: false }
        );

        res.status(200).json(draft);
    } catch (error) {
        res.status(500).json({ message: "Error saving draft", error: error.message });
    }
};

export const saveDraftText = async (req, res) => {
    try {
        const userId = req.user._id;
        let body = req.body;

        if (typeof body === 'string') {
            body = JSON.parse(body);
        }

        // שלוף טיוטה קיימת כדי לשמור נתיבי קבצים
        const existingDraft = await Request.findOne({ userId, status: 'draft' });

        const personal = body.personal || {};
        const family = body.family || {};
        const course = body.course || {};
        const bank = body.bank || {};

        // שמור נתיבי קבצים ישנים אם לא קיימים בנתונים החדשים
        if (existingDraft) {
            if (!personal.idCardFile && existingDraft.personal?.idCardFile)
                personal.idCardFile = existingDraft.personal.idCardFile;
            if (!course.tuitionFile && existingDraft.course?.tuitionFile)
                course.tuitionFile = existingDraft.course.tuitionFile;
            if (!bank.bankConfirmationFile && existingDraft.bank?.bankConfirmationFile)
                bank.bankConfirmationFile = existingDraft.bank.bankConfirmationFile;
            if (!family.fatherSlip && existingDraft.family?.fatherSlip)
                family.fatherSlip = existingDraft.family.fatherSlip;
            if (!family.motherSlip && existingDraft.family?.motherSlip)
                family.motherSlip = existingDraft.family.motherSlip;
        }

        const draftData = {
            personal, family, course, bank,
            userId,
            status: 'draft',
            updatedAt: new Date()
        };

        const draft = await Request.findOneAndUpdate(
            { userId, status: 'draft' },
            draftData,
            { upsert: true, new: true, runValidators: false }
        );

        res.status(200).json(draft);
    } catch (error) {
        res.status(500).json({ message: "Error saving draft", error: error.message });
    }
};

export const getMyDraft = async (req, res) => {
    try {
        const request = await Request.findOne({
            userId: req.user._id,
            status: 'draft'
        }).sort({ createdAt: -1 });
        res.status(200).json(request);
    } catch (error) {
        res.status(500).json({ message: "שגיאה בשליפת טיוטה" });
    }
}