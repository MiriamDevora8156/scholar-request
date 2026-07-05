import Joi from 'joi';

const siblingSchema = Joi.object({
    id: Joi.string().required(),
    firstName: Joi.string().min(2).required(),
    lastName: Joi.string().min(2).required(),
    birthDate: Joi.date().required(),
    _id: Joi.string().optional()
});

export const requestSchema = Joi.object({
    _id: Joi.string().optional(),
    __v: Joi.number().optional(),
    createdAt: Joi.date().optional(),
    updatedAt: Joi.date().optional(),
    userId: Joi.string().optional(),
    status: Joi.string().optional(),
    
    personal: Joi.object({
        id: Joi.string().length(9).pattern(/^[0-9]+$/).required().messages({
            'string.length': 'תעודת זהות חייבת להכיל בדיוק 9 ספרות',
            'string.pattern.base': 'תעודת זהות חייבת להכיל ספרות בלבד'
        }),
        name: Joi.string().min(2).required(),
        lastName: Joi.string().min(2).required(),
        birthDate: Joi.string().required(),
        address: Joi.string().min(5).required(),
        phone: Joi.string().pattern(/^05\d{8}$/).required().messages({
            'string.pattern.base': 'מספר טלפון לא תקין'
        }),
        idCardFile: Joi.string().optional(),
        zipCode: Joi.string().optional()
    }).required(),

    family: Joi.object({
        fatherFirstName: Joi.string().optional(),
        fatherLastName: Joi.string().optional(),
        fatherId: Joi.string().optional(),
        motherFirstName: Joi.string().optional(),
        motherLastName: Joi.string().optional(),
        motherId: Joi.string().optional(),
        numChildren: Joi.number().min(0).optional(),
        numOver: Joi.number().min(0).optional(),
        fatherSlip: Joi.string().optional(),
        motherSlip: Joi.string().optional(),
        siblings: Joi.array().items(siblingSchema).optional()
    }).optional(),

    course: Joi.object({
        trend: Joi.string().required(),
        institution: Joi.string().required(),
        payment: Joi.number().min(0).required(),
        years: Joi.number().min(1).max(10).required(),
        tuitionFile: Joi.string().optional()
    }).required(),

    bank: Joi.object({
        accountName: Joi.string().required(),
        accountId: Joi.string().required(),
        bank: Joi.string().required(),
        branch: Joi.string().required(),
        number: Joi.string().required(),
        bankConfirmationFile: Joi.string().optional()
    }).required()
});