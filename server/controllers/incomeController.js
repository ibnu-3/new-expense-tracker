import Income from '../models/Income.js';
import moment from 'moment';

// @desc    Get all incomes for a user
// @route   GET /api/income
// @access  Private
export const getIncomes = async (req, res) => {
    try {
        const incomes = await Income.find({ user: req.user.id }).sort({ date: -1 });
        res.status(200).json(incomes);
    } catch (error) {
        console.error("Get incomes error:", error);
        res.status(500).json({ message: 'Failed to get incomes', error: error.message });
    }
};

// @desc    Create a new income
// @route   POST /api/income
// @access  Private
export const createIncome = async (req, res) => {
    try {
        const { title, amount, description, date } = req.body;

        const newIncome = new Income({
            user: req.user.id,
            title,
            amount,
            description,
            date
        });

        const savedIncome = await newIncome.save();
        res.status(201).json(savedIncome);
    } catch (error) {
        console.error("Create income error:", error);
        res.status(400).json({ message: 'Failed to create income', error: error.message });
    }
};

// @desc    Update an existing income
// @route   PUT /api/income/:id
// @access  Private
export const updateIncome = async (req, res) => {
    try {
        const { title, amount, description, date } = req.body;
        const income = await Income.findById(req.params.id);

        if (!income) {
            return res.status(404).json({ message: 'Income not found' });
        }

        if (income.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized to update this income' });
        }

        income.title = title || income.title;
        income.amount = amount || income.amount;
        income.description = description || income.description;
        income.date = date || income.date;

        const updatedIncome = await income.save();
        res.status(200).json(updatedIncome);

    } catch (error) {
        console.error("Update income error:", error);
        res.status(400).json({ message: 'Failed to update income', error: error.message });
    }
};

// @desc    Delete an income
// @route   DELETE /api/income/:id
// @access  Private
export const deleteIncome = async (req, res) => {
    try {
        const income = await Income.findById(req.params.id);

        if (!income) {
            return res.status(404).json({ message: 'Income not found' });
        }

        if (income.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized to delete this income' });
        }

        await Income.deleteOne({_id: req.params.id});
        res.status(200).json({ message: 'Income deleted successfully' });

    } catch (error) {
        console.error("Delete income error:", error);
        res.status(500).json({ message: 'Failed to delete income', error: error.message });
    }
};

// @desc    Get incomes for the last 30 days
// @route   GET /api/income/last30days
// @access  Private
export const getLast30DaysIncome = async (req, res) => {
  try {
    const thirtyDaysAgo = moment().subtract(30, 'days').toDate();
    const incomes = await Income.find({
      user: req.user.id,
      date: { $gte: thirtyDaysAgo },
    }).sort({ date: 1 });

    res.status(200).json(incomes);
  } catch (error) {
    console.error('Error fetching last 30 days income:', error);
    res.status(500).json({ message: 'Failed to fetch last 30 days income', error: error.message });
  }
};