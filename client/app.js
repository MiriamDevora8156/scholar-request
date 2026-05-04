import 'dotenv/config'; // טעינה אוטומטית של המשתנים מהקובץ
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './db.js';
import authRoutes from './api/routes/authRoutes.js';
import requestRoutes from './api/routes/requestRoutes.js'
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

// הגדרות בסיסיות ל-Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Grant System API',
      version: '1.0.0',
      description: 'מערכת לניהול בקשות למענקים',
    },
    servers: [
      {
        url: 'http://localhost:3002',
      },
    ],
  },
  apis: ['./api/routes/*.js'],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

// חיבור ל-DB
connectDB();

// Middleware
app.use(express.json());
app.use(express.text({ type: 'text/plain' }));
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/requests', requestRoutes);

app.use('/uploads', express.static('uploads'));

// יצירת ה-Route של Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));


const PORT = 3002;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app; 