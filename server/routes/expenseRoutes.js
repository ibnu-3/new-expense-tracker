import express from 'express';
import { getExpenses, createExpense, updateExpense, deleteExpense, getLast60DaysExpenses } from '../controllers/expenseController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getExpenses);
router.post('/', protect, createExpense);
router.put('/:id', protect, updateExpense);
router.delete('/:id', protect, deleteExpense);
router.get('/last60days', protect, getLast60DaysExpenses);

export default router;