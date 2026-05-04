# 🎓 ScholarRequest — מערכת ניהול מענקים לסטודנטים

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Redux](https://img.shields.io/badge/Redux-593D88?style=for-the-badge&logo=redux&logoColor=white)
![MUI](https://img.shields.io/badge/MUI-007FFF?style=for-the-badge&logo=mui&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)

**מערכת מלאה לניהול בקשות מענקים לסטודנטים — מהגשה ועד אישור**

</div>

---

## 📋 תוכן עניינים

- [על הפרויקט](#על-הפרויקט)
- [טכנולוגיות](#טכנולוגיות)
- [ארכיטקטורה](#ארכיטקטורה)
- [פיצ'רים](#פיצ'רים)
- [התקנה והרצה](#התקנה-והרצה)
- [משתני סביבה](#משתני-סביבה)
- [API Reference](#api-reference)
- [מבנה הפרויקט](#מבנה-הפרויקט)
- [מסך תרשים זרימה](#תרשים-זרימה)
- [אתגרים מומשו](#אתגרים-מומשו)

---

## 🏫 על הפרויקט

**ScholarRequest** היא מערכת Web מלאה (Full Stack) לניהול בקשות מענקים לסטודנטים. המערכת מאפשרת לסטודנטים להגיש בקשה מפורטת בטופס רב-שלבי, ולמנהל המערכת לצפות, לסנן, ולאשר/לדחות בקשות — הכל בממשק מודרני ונוח לשימוש.

### זרימת המשתמש

```
הרשמה / כניסה  →  הגשת בקשה (4 שלבים)  →  המתנה לאישור  →  קבלת עדכון במייל
                                                    ↓
                                           מנהל: צפייה, סינון, אישור/דחייה
```

---

## 🛠️ טכנולוגיות

### Frontend
| טכנולוגיה | תיאור |
|-----------|-------|
| **React 18** | ספריית UI עם Hooks |
| **Redux Toolkit** | ניהול state גלובלי |
| **Material UI (MUI)** | קומפוננטות עיצוב |
| **React Router v6** | ניתוב בצד לקוח |
| **Axios** | קריאות HTTP |

### Backend
| טכנולוגיה | תיאור |
|-----------|-------|
| **Node.js + Express** | שרת HTTP |
| **MongoDB + Mongoose** | מסד נתונים NoSQL |
| **JWT** | אימות משתמשים |
| **Multer** | העלאת קבצים |
| **Nodemailer** | שליחת מיילים |
| **bcrypt** | הצפנת סיסמאות |
| **Joi** | ולידציה בצד שרת |
| **Swagger** | תיעוד API |

---

## 🏗️ ארכיטקטורה

```
┌─────────────────────────────────────────────────────────┐
│                        CLIENT                           │
│  React + Redux + MUI                                    │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│  │  Auth    │ │MultiForm │ │ViewReq.  │ │ Status   │  │
│  │ Login/   │ │Personal  │ │+ Filters │ │  Page    │  │
│  │Register  │ │Family    │ │+ Details │ │          │  │
│  │          │ │Studies   │ │          │ │          │  │
│  │          │ │Bank      │ │          │ │          │  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘  │
└─────────────────────┬───────────────────────────────────┘
                      │ HTTP + JWT Cookie
┌─────────────────────▼───────────────────────────────────┐
│                       SERVER                            │
│  Express.js                                             │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐                │
│  │authRoutes│ │reqRoutes │ │Middleware│                │
│  │/register │ │/submit   │ │authMW    │                │
│  │/login    │ │/draft    │ │adminOnly │                │
│  │/check    │ │/pending  │ │multer    │                │
│  └──────────┘ └──────────┘ └──────────┘                │
│  ┌──────────┐ ┌──────────┐                             │
│  │emailSvc  │ │  Multer  │                             │
│  │nodemailer│ │ uploads/ │                             │
│  └──────────┘ └──────────┘                             │
└─────────────────────┬───────────────────────────────────┘
                      │ Mongoose
┌─────────────────────▼───────────────────────────────────┐
│                    MongoDB                              │
│   Users Collection    │    Requests Collection          │
│   ┌───────────────┐   │   ┌──────────────────────────┐ │
│   │ username      │   │   │ userId (ref)             │ │
│   │ id (ת.ז)      │   │   │ personal: {...}          │ │
│   │ name          │   │   │ family: {siblings:[]}    │ │
│   │ password(hash)│   │   │ course: {...}            │ │
│   │ email         │   │   │ bank: {...}              │ │
│   │ role          │   │   │ status                   │ │
│   └───────────────┘   │   └──────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

---

## ✨ פיצ'רים

### 👤 סטודנט
- **הרשמה וכניסה** — זיהוי לפי ת.ז וסיסמה עם ולידציה מלאה
- **טופס רב-שלבי** — 4 שלבים עם ולידציה בכל שלב:
  - 👤 פרטים אישיים + העלאת ת.ז
  - 👨‍👩‍👧‍👦 פרטי משפחה + תלושי שכר הורים
  - 📚 פרטי לימודים + אישור שכר לימוד
  - 🏦 פרטי חשבון בנק + אישור ניהול חשבון
- **שמירת טיוטה** — שמירה ידנית בכל עת + שמירה אוטומטית בסגירת הדפדפן
- **תצוגה מקדימה** — Preview של הבקשה לפני שליחה
- **צפייה בסטטוס** — הצגת סטטוס הבקשה האחרונה
- **עדכון במייל** — מייל אוטומטי בקליטת בקשה ובשינוי סטטוס

### 🔧 מנהל
- **טבלת בקשות** — כל הבקשות הממתינות
- **סינון ומיון** בצד שרת לפי:
  - ת.ז ספציפית
  - עיר מגורים
  - טווח תאריכים
  - מספר ילדים מינימלי
  - גובה שכר לימוד
- **פרטי בקשה מלאים** — כולל אפשרות צפייה בקבצים
- **אישור / דחייה** — עדכון סטטוס עם שליחת מייל אוטומטית

---

## 🚀 התקנה והרצה

### דרישות מוקדמות
- Node.js 18+
- MongoDB (מקומי או Atlas)
- חשבון Gmail עם App Password לשליחת מיילים

### התקנה

```bash
# שכפול הפרויקט
git clone https://github.com/your-username/scholar-request.git
cd scholar-request

# התקנת חבילות שרת
cd server
npm install

# התקנת חבילות לקוח
cd ../client
npm install
```

### הרצה בסביבת פיתוח

```bash
# הרצת השרת (מתוך תיקיית server)
npm run dev        # עם nodemon
# או
npm start          # ללא nodemon

# הרצת הלקוח (מתוך תיקיית client) — בטרמינל נפרד
npm start
```

השרת רץ על: `http://localhost:3002`
הלקוח רץ על: `http://localhost:3000`

---

## 🔐 משתני סביבה

צור קובץ `.env` בתיקיית `server`:

```env
# מסד נתונים
MONGO_URI=mongodb://localhost:27017/scholarrequest
# או Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/scholarrequest

# אימות
JWT_SECRET=your_super_secret_key_here

# מייל (Gmail App Password)
EMAIL_USER=your.email@gmail.com
EMAIL_PASS=xxxx xxxx xxxx xxxx

# סביבה
NODE_ENV=development
PORT=3002
```

> ⚠️ **חשוב:** לעולם אל תעלה את קובץ `.env` ל-Git. ודא שהוא מופיע ב-`.gitignore`

### יצירת Gmail App Password
1. כנס ל-Google Account → Security
2. הפעל **2-Step Verification**
3. חפש **App Passwords** → צור עם שם "NodeMailer"
4. העתק את ה-16 התווים לשדה `EMAIL_PASS`

---

## 📡 API Reference

### Auth Routes — `/api/auth`

| Method | Endpoint | תיאור | Auth |
|--------|----------|-------|------|
| POST | `/register` | הרשמת משתמש חדש | ❌ |
| POST | `/login` | כניסה למערכת | ❌ |
| GET | `/check-auth` | בדיקת תוקף טוקן | ✅ |

### Request Routes — `/api/requests`

| Method | Endpoint | תיאור | Auth | Admin |
|--------|----------|-------|------|-------|
| POST | `/submit` | הגשת בקשה + קבצים | ✅ | ❌ |
| POST | `/draft` | שמירת טיוטה + קבצים | ✅ | ❌ |
| POST | `/draft-text` | שמירת טיוטה (טקסט בלבד) | ✅ | ❌ |
| GET | `/my-draft` | שליפת הטיוטה הנוכחית | ✅ | ❌ |
| GET | `/my-status` | סטטוס הבקשה האחרונה | ✅ | ❌ |
| GET | `/pending` | כל הבקשות הממתינות + פילטרים | ✅ | ✅ |
| GET | `/get/:id` | בקשה ספציפית לפי ID | ✅ | ✅ |
| PUT | `/update/:id` | עדכון סטטוס (אישור/דחייה) | ✅ | ✅ |
| PUT | `/appeal/:id` | ערעור — החזרה להמתנה | ✅ | ❌ |

### Query Parameters לסינון (`/pending`)

```
?id=123456789          # חיפוש לפי ת.ז
&city=תל+אביב          # סינון לפי עיר
&fromDate=2024-01-01   # מתאריך
&toDate=2024-12-31     # עד תאריך
&minSiblings=2         # מינימום ילדים
&minSalary=10000       # שכר לימוד מינימלי
&maxSalary=30000       # שכר לימוד מקסימלי
&sortBy=tuition        # מיון: tuition / submissionDate / family.numChildren
&order=desc            # כיוון: asc / desc
```

---

## 📁 מבנה הפרויקט

```
scholar-request/
├── client/                          # צד לקוח — React
│   └── src/
│       ├── Components/
│       │   ├── Form/                # טופס הגשת בקשה
│       │   │   ├── MultiForm.jsx    # מנהל הטופס הרב-שלבי
│       │   │   ├── PersonalDetails.jsx
│       │   │   ├── FamilyDetails.jsx
│       │   │   ├── Studies.jsx
│       │   │   ├── BankDetails.jsx
│       │   │   ├── Verify.jsx       # אישור ושליחה + Preview
│       │   │   ├── useSave.js       # Custom Hook לשמירת state ב-Redux
│       │   │   └── Validation.jsx   # פונקציות ולידציה
│       │   ├── ViewRequest.jsx      # טבלת בקשות למנהל
│       │   ├── RequestDetails.jsx   # פרטי בקשה מלאים
│       │   ├── Apply.jsx            # דף אישור קליטה
│       │   └── Status.jsx           # דף סטטוס לסטודנט
│       ├── Redux/
│       │   ├── requestSlice.js      # ניהול state של בקשות
│       │   └── userSlice.js         # ניהול state של משתמש
│       └── api.js                   # הגדרת Axios instance
│
└── server/                          # צד שרת — Node.js
    ├── controllers/
    │   ├── authController.js        # הרשמה, כניסה, בדיקת טוקן
    │   └── requestController.js     # כל פעולות הבקשות
    ├── models/
    │   ├── userSchema.js            # סכמת משתמש
    │   └── requestSchema.js         # סכמת בקשה (כולל siblings)
    ├── routes/
    │   ├── authRoutes.js
    │   └── requestRoutes.js         # כולל הגדרת Multer
    ├── middleware/
    │   └── authMiddleware.js        # JWT + adminOnly
    ├── services/
    │   └── emailService.js          # Nodemailer — שליחת מיילים
    ├── validations/
    │   └── authValidation.js        # Joi schemas
    ├── uploads/                     # קבצים שהועלו
    │   └── {userId}/
    │       ├── draft/               # קבצי טיוטה
    │       └── final/               # קבצי הגשה סופית
    └── index.js                     # נקודת כניסה לשרת
```

---

## 🔄 תרשים זרימה

```
  [משתמש חדש]          [משתמש קיים]
       │                     │
       ▼                     ▼
   [הרשמה]              [כניסה]
       │                     │
       └──────────┬──────────┘
                  ▼
             [דף הבית]
                  │
       ┌──────────┴──────────┐
       ▼                     ▼
  [סטודנט]              [מנהל]
       │                     │
       ▼                     ▼
  [הגשת בקשה]      [טבלת בקשות]
  ┌──────────┐           │
  │Personal  │      [סינון/מיון]
  │Family    │           │
  │Studies   │      [פרטי בקשה]
  │Bank      │           │
  │Verify    │    [אישור / דחייה]
  └──────────┘           │
       │            [מייל למשתמש]
       ▼
  [קליטה + מייל]
       │
       ▼
  [צפייה בסטטוס]
```

---

## 🏆 אתגרים שמומשו

| אתגר | תיאור | מצב |
|------|-------|-----|
| 🍪 **JWT בעוגיות** | שמירת טוקן ב-httpOnly cookie, ניקוי ביציאה | ✅ מומש |
| 📝 **שמירת טיוטה** | שמירה ידנית + אוטומטית בסגירת הדפדפן (sendBeacon) | ✅ מומש |
| 👨‍👩‍👧 **אחים דינמיים** | חלוניות דינמיות לפי מספר האחים | ✅ מומש |
| 👁️ **תצוגה מקדימה** | Preview של הבקשה לפני שליחה | ✅ מומש |
| 📧 **שליחת מיילים** | עדכון בקליטה ובשינוי סטטוס | ✅ מומש |
| 📮 **שדה מיקוד** | שדה + קישור לאתר דואר ישראל | ✅ מומש |
| 🗂️ **תיקיות נפרדות** | קבצי טיוטה ב-draft/ וסופי ב-final/ | ✅ מומש |

---

## 🗑️ מחיקת Repository מה-Terminal

### מחיקת Repository מ-GitHub באמצעות GitHub CLI

```bash
# התקנת GitHub CLI (אם לא מותקן)
# Windows:
winget install GitHub.cli

# Mac:
brew install gh

# כניסה
gh auth login

# מחיקת repository (החלף your-username ו-repo-name)
gh repo delete your-username/repo-name --yes
```

### מחיקת ה-Git המקומי בלבד (ללא מחיקה מ-GitHub)

```bash
# Windows (PowerShell)
Remove-Item -Recurse -Force .git

# Mac / Linux
rm -rf .git
```

### מחיקת תיקיית הפרויקט כולה מקומית

```bash
# Windows
rmdir /s /q scholar-request

# Mac / Linux
rm -rf scholar-request
```

> ⚠️ **אזהרה:** פעולות מחיקה הן בלתי הפיכות. ודא שיש לך גיבוי לפני הרצת הפקודות.

---

## 👨‍💻 פיתוח

פרויקט גמר — קורס Full Stack React + Node.js

---

<div align="center">
Made with ❤️ and ☕
</div>
