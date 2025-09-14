import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 50
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    type: {
        type: String,
        default: 'expense',
    },
    category: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
        maxlength: 200
    },
    date: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

const Expense = mongoose.model('Expense', expenseSchema);

export default Expense;