import express from 'express';
import { register, login, checkAuth, logout } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @swagger
 *   components:
 *     schemas:
 *       User:
 *         type: object
 *         required:
 *           - username
 *           - id
 *           - name
 *           - password
 *         properties:
 *           username:
 *             type: string
 *             description: שם המשתמש לכניסה
 *           id:
 *             type: string
 *             description: תעודת זהות (9 ספרות)
 *           name:
 *             type: string
 *             description: שם מלא של הסטודנט
 *           password:
 *             type: string
 *             description: סיסמה הכוללת אות גדולה, קטנה, מספר ותו מיוחד
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: הרשמת משתמש חדש
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: המשתמש נרשם בהצלחה
 *       400:
 *         description: שגיאת ולידציה או משתמש כבר קיים
 */
router.post('/register' ,register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: התחברות למערכת
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: התחברות הצליחה
 *       401:
 *         description: פרטים שגויים
 */
router.post('/login', login);

/**
 * @swagger
 * /api/auth/check-auth:
 *   get:
 *     summary: בדיקת אימות
 *     tags: [Requests]
 *     responses:
 *       200:
 *         description: בדיקת אימות התקבלה בהצלחה
 */
router.get('/check-auth', protect, checkAuth);

router.post('/logout', logout);

export default router;