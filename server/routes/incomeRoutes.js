import express from 'express';
import { getIncomes, createIncome, updateIncome, deleteIncome, getLast30DaysIncome } from '../controllers/incomeController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getIncomes);
router.post('/', protect, createIncome);
router.put('/:id', protect, updateIncome);
router.delete('/:id', protect, deleteIncome);
router.get('/last30days', protect, getLast30DaysIncome);

export default router;