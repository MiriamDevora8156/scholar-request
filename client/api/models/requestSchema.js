import mongoose from 'mongoose';

const siblingSchema = new mongoose.Schema({
    id: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    birthDate: { type: Date, required: true }
});

const requestSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    personal: {
        id: { type: String, required: true },
        name: { type: String, required: true },
        lastName: { type: String, required: true },
        birthDate: { type: String, required: true },
        address: { type: String, required: true },
        phone: { type: String, required: true },
        idCardFile: { type: String },
        zipCode: { type: String },
    },
    family: {
        fatherFirstName: { type: String },
        fatherLastName: { type: String },
        fatherId: { type: String },
        motherFirstName: { type: String },
        motherLastName: { type: String },
        motherId: { type: String },
        numChildren: { type: Number },
        numOver: { type: Number },
        fatherSlip: { type: String },
        motherSlip: { type: String },
        siblings: [siblingSchema]
    },
    course: {
        trend: { type: String, required: true },
        institution: { type: String, required: true },
        payment: { type: Number, required: true },
        years: { type: Number, required: true },
        tuitionFile: { type: String }
    },
    bank: {
        accountName: { type: String, required: true },
        accountId: { type: String, required: true },
        bank: { type: String, required: true },
        branch: { type: String, required: true },
        number: { type: String, required: true },
        bankConfirmationFile: { type: String }
    },
    status: { type: String, enum: ['waiting', 'allow', 'reject', 'draft'], default: 'waiting' },
}, { timestamps: true });

requestSchema.index({ userId: 1, status: 1 }, {
    unique: true,
    partialFilterExpression: { status: 'draft' }
});

export default mongoose.model('Request', requestSchema);