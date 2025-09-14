import Expense from '../models/Expense.js';
import moment from 'moment';

// @desc    Get all expenses for a user
// @route   GET /api/expenses
// @access  Private
export const getExpenses = async (req, res) => {
    try {
        const expenses = await Expense.find({ user: req.user.id }).sort({ date: -1 });
        res.status(200).json(expenses);
    } catch (error) {
        console.error("Get expenses error:", error);
        res.status(500).json({ message: 'Failed to get expenses', error: error.message });
    }
};

// @desc    Create a new expense
// @route   POST /api/expenses
// @access  Private
export const createExpense = async (req, res) => {
    try {
        const { title, amount, category, description, date } = req.body;

        const newExpense = new Expense({
            user: req.user.id,
            title,
            amount,
            category,
            description,
            date
        });

        const savedExpense = await newExpense.save();
        res.status(201).json(savedExpense);
    } catch (error) {
        console.error("Create expense error:", error);
        res.status(400).json({ message: 'Failed to create expense', error: error.message });
    }
};

// @desc    Update an existing expense
// @route   PUT /api/expenses/:id
// @access  Private
export const updateExpense = async (req, res) => {
    try {
        const { title, amount, category, description, date } = req.body;
        const expense = await Expense.findById(req.params.id);

        if (!expense) {
            return res.status(404).json({ message: 'Expense not found' });
        }

        if (expense.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized to update this expense' });
        }

        expense.title = title || expense.title;
        expense.amount = amount || expense.amount;
        expense.category = category || expense.category;
        expense.description = description || expense.description;
        expense.date = date || expense.date;

        const updatedExpense = await expense.save();
        res.status(200).json(updatedExpense);

    } catch (error) {
        console.error("Update expense error:", error);
        res.status(400).json({ message: 'Failed to update expense', error: error.message });
    }
};

// @desc    Delete an expense
// @route   DELETE /api/expenses/:id
// @access  Private
export const deleteExpense = async (req, res) => {
    try {
        const expense = await Expense.findById(req.params.id);

        if (!expense) {
            return res.status(404).json({ message: 'Expense not found' });
        }

        if (expense.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized to delete this expense' });
        }

        await Expense.deleteOne({_id: req.params.id});
        res.status(200).json({ message: 'Expense deleted successfully' });

    } catch (error) {
        console.error("Delete expense error:", error);
        res.status(500).json({ message: 'Failed to delete expense', error: error.message });
    }
};

// @desc    Get expenses for the last 60 days
// @route   GET /api/expenses/last60days
// @access  Private
export const getLast60DaysExpenses = async (req, res) => {
  try {
    const sixtyDaysAgo = moment().subtract(60, 'days').toDate();
    const expenses = await Expense.find({
      user: req.user.id,
      date: { $gte: sixtyDaysAgo },
    }).sort({ date: 1 });

    res.status(200).json(expenses);
  } catch (error) {
    console.error('Error fetching last 60 days expenses:', error);
    res.status(500).json({ message: 'Failed to fetch last 60 days expenses', error: error.message });
  }
};