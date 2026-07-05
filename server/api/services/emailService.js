import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({ // יצירת פרוטוקול לשליחת מיילים
    host: process.env.EMAIL_HOST || 'smtp.gmail.com', // משתמש ב-Mailtrap אם קיים, אחרת ב-Gmail
    port: process.env.EMAIL_PORT || 587,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    }
});

export const sendStatusEmail = async (toEmail, userName, status) => {
    console.log(`נסיון שליחת מייל ל-${toEmail} עבור המשתמש ${userName} עם סטטוס ${status}`); // שורת בדיקה
    const statusText = {
        waiting: 'Received and Under Review',
        allow: 'Approved ✅',
        reject: 'Rejected ❌'
    };

    // הגדרת צבעים לפי סטטוס
    const statusColors = {
        'allow': '#e8f5e9',
        'reject': '#ffebee',
        'waiting': '#fff3e0'
    };

    const statusBorderColors = {
        'allow': '#4CAF50',
        'reject': '#F44336',
        'waiting': '#FF9800'
    };

    await transporter.sendMail({
        from: `"ScholarRequest" <${process.env.EMAIL_USER}>`,
        to: toEmail,
        subject: `Update: Application Status - ${statusText[status]}`,
        html: `
        <div style="background-color: #f9f9f9; padding: 40px 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
            <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
                <div style="background-color: #388E3C; padding: 20px; text-align: center;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 1px;">ScholarRequest</h1>
                </div>
                <div style="padding: 40px;">
                    <h2 style="color: #333; margin-top: 0;">Hi ${userName},</h2>
                    <p style="color: #555; line-height: 1.6; font-size: 16px;">There has been an update regarding your scholarship application status.</p>
                    
                    <div style="background-color: ${statusColors[status] || '#f5f5f5'}; 
                                border: 1px solid ${statusBorderColors[status] || '#e0e0e0'}; 
                                padding: 20px; 
                                text-align: center; 
                                border-radius: 8px; 
                                margin: 30px 0;">
                        <span style="display: block; font-size: 14px; color: #666; text-transform: uppercase; margin-bottom: 5px;">Current Status</span>
                        <strong style="font-size: 22px; color: #333;">${statusText[status]}</strong>
                    </div>

                    <div style="text-align: center; margin-top: 30px;">
                        <a href="http://localhost:3000/status" 
                           style="background-color: #388E3C; 
                                  color: white; 
                                  padding: 14px 28px; 
                                  text-decoration: none; 
                                  border-radius: 6px; 
                                  font-weight: bold; 
                                  display: inline-block;">
                           View Application Details
                        </a>
                </div>
                </div>
                <div style="background-color: #f1f1f1; padding: 20px; text-align: center; font-size: 12px; color: #999;">
                    <p>© 2026 ScholarRequest. All rights reserved.</p>
                </div>
            </div>
        </div>
    `
    });
};