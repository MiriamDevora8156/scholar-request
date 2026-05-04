import Joi from 'joi';

export const registerSchema = Joi.object({
    username: Joi.string().min(2).max(30).required().messages({
        'string.empty': 'שם משתמש הוא שדה חובה'
    }),
    id: Joi.string().length(9).pattern(/^[0-9]+$/).required().messages({
        'string.length': 'תעודת זהות חייבת להכיל בדיוק 9 ספרות',
        'string.pattern.base': 'תעודת זהות חייבת להכיל ספרות בלבד'
    }),
    name: Joi.string().min(2).required(),
    password: Joi.string()
        .min(8)
        .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*])'))
        .required()
        .messages({
            'string.pattern.base': 'הסיסמה חייבת לכלול אות גדולה, אות קטנה, מספר ותו מיוחד',
            'string.min': 'הסיסמה חייבת להיות באורך 8 תווים לפחות'
        }),
    email: Joi.string().email({ tlds: { allow: false } }).required().messages({
        'string.email': 'Invalid email address',
        'string.empty': 'Email is required'
    })
});

export const loginSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required()
});