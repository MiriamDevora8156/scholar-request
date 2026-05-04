import express from 'express';
import {
    submitRequest,
    getPendingRequests,
    updateRequestStatus,
    getMyStatus,
    getRequestById,
    appealRequest,
    saveDraft,
    getMyDraft,
    saveDraftText,
} from '../controllers/requestController.js';
import { adminOnly, protect } from '../middleware/authMiddleware.js';
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
const router = express.Router();

const cpUpload = upload.fields([
    { name: 'idCardFile', maxCount: 1 },
    { name: 'tuitionFile', maxCount: 1 },
    { name: 'bankConfirmationFile', maxCount: 1 },
    { name: 'fatherSlip', maxCount: 1 },
    { name: 'motherSlip', maxCount: 1 },
    { name: 'studentSlip', maxCount: 1 }
]);

/**
 * @swagger
 * components:
 *   schemas:
 *     Request:
 *       type: object
 *       properties:
 *         personal:
 *           type: object
 *           properties:
 *             id: { type: string }
 *             name: { type: string }
 *             lastName: { type: string }
 *             birthDate: { type: string }
 *             address: { type: string }
 *             phone: { type: string }
 *         family:
 *           type: object
 *           properties:
 *             father: { type: string }
 *             mother: { type: string }
 *             numChildren: { type: number }
 *             numOver: { type: number }
 *         course:
 *           type: object
 *           properties:
 *             trend: { type: string }
 *             payment: { type: number }
 *             years: { type: number }
 *         bank:
 *           type: object
 *           properties:
 *             accountName: { type: string }
 *             accountId: { type: string }
 *             bank: { type: string }
 *             branch: { type: string }
 *             number: { type: string }
 */

/**
 * @swagger
 * /api/requests/submit:
 *   post:
 *     summary: הגשת בקשה חדשה למענק
 *     tags: [Requests]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Request'
 *     responses:
 *       201:
 *         description: הבקשה נוצרה בהצלחה
 *       400:
 *         description: שגיאה בנתונים שנשלחו
 *       401:
 *         description: לא מורשה - חסר טוקן
 */
router.post('/submit', protect, cpUpload, submitRequest);

/**
 * @swagger
 * /api/requests/pending:
 *   get:
 *     summary: שליפת כל הבקשות הממתינות (עבור מנהל)
 *     tags: [Requests]
 *     responses:
 *       200:
 *         description: רשימת בקשות התקבלה בהצלחה
 */
router.get('/pending', protect, adminOnly, getPendingRequests);

/**
 * @swagger
 * /api/requests/my-status:
 *   get:
 *     summary: שליפת סטטוס הבקשה של המשתמש המחובר
 *     tags: [Requests]
 *     responses:
 *       200:
 *         description: סטטוס הבקשה הנוכחי
 */
router.get('/my-status', protect, getMyStatus);

/**
 * @swagger
 * /api/requests/update/{id}:
 *   put:
 *     summary: עדכון סטטוס בקשה (אישור/דחייה)
 *     tags: [Requests]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           description: מזהה הבקשה (ObjectId)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [allow, reject, waiting]
 *     responses:
 *       200:
 *         description: סטטוס עודכן בהצלחה
 *       404:
 *         description: בקשה לא נמצאה
 */
router.put('/update/:id', protect, adminOnly, updateRequestStatus);
router.put('/appeal/:id', protect, appealRequest);

/**
 * @swagger
 * /api/requests/get/{id}:
 *   get:
 *     summary: שליפת בקשה ספציפית לפי ID
 *     tags: [Requests]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           description: המזהה הייחודי של הבקשה (Mongo ID)
 *     responses:
 *       200:
 *         description: פרטי הבקשה התקבלו בהצלחה
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Request'
 *       404:
 *         description: בקשה לא נמצאה
 *       400:
 *         description: ID לא תקין
 */
router.get('/get/:id', protect, getRequestById);

/**
 * @swagger
 * /api/requests/draft:
 *   post:
 *     summary: הגשת בקשה חדשה למענק
 *     tags: [Requests]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Request'
 *     responses:
 *       201:
 *         description: הבקשה נוצרה בהצלחה
 *       400:
 *         description: שגיאה בנתונים שנשלחו
 *       401:
 *         description: לא מורשה - חסר טוקן
 */
router.post('/draft', protect, cpUpload, saveDraft);
router.post('/draft-text', protect, saveDraftText);

/**
 * @swagger
 * /api/requests/my-draft:
 *   get:
 *     summary: שליפת טיוטה אחרונה של המשתמש המחובר
 *     tags: [Requests]
 *     responses:
 *       200:
 *         description: טיוטה אחרונה
 */
router.get('/my-draft', protect, getMyDraft);

// router.get('/try' , getDraft)

export default router;