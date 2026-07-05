import multer from 'multer';
import path from 'path';
import fs from 'fs';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isDraft = req.originalUrl.includes('/draft');
        const subDir = isDraft ? 'draft' : 'final';
        const userDir = `uploads/${req.user._id}/${subDir}`;
        if (!fs.existsSync(userDir)) {
            fs.mkdirSync(userDir, { recursive: true });
        }
        cb(null, userDir);
    },
    filename: function (req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ storage: storage });

export const cpUpload = upload.fields([
    { name: 'idCardFile', maxCount: 1 },
    { name: 'tuitionFile', maxCount: 1 },
    { name: 'bankConfirmationFile', maxCount: 1 },
    { name: 'fatherSlip', maxCount: 1 },
    { name: 'motherSlip', maxCount: 1 },
    { name: 'studentSlip', maxCount: 1 }
]);