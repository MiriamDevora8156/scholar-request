import mongoose from 'mongoose';

// 'grant_system' הוא שם מסד הנתונים שייווצר עבור הפרויקט
const mongoURI = 'mongodb://localhost:27017/grant_system';

const connectDB = async () => {
    try {
        await mongoose.connect(mongoURI);
        console.log('✅ החיבור ל-MongoDB הצליח!');
    } catch (err) {
        console.error('❌ שגיאה בחיבור ל-MongoDB:', err.message);
        process.exit(1);
    }
};

export default connectDB;