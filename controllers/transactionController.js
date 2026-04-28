const Transaction = require('../models/Transaction');

// @desc    Create transaction (income/expense)
const createTransaction = async (req, res) => {
    try {
        const { type, title, category, amount, description, date } = req.body;
        
        const transaction = await Transaction.create({
            type,
            title,
            category,
            amount,
            description,
            date,
            createdBy: req.user._id
        });
        
        res.status(201).json({
            success: true,
            message: `${type === 'income' ? 'Income' : 'Expense'} added successfully`,
            transaction
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get all transactions (Admin: sab, User: apna)
const getAllTransactions = async (req, res) => {
    try {
        let filter = {};
        
        if (req.user.role !== 'admin') {
            filter.createdBy = req.user._id;
        }
        
        if (req.query.type) filter.type = req.query.type;
        if (req.query.startDate && req.query.endDate) {
            filter.date = { $gte: new Date(req.query.startDate), $lte: new Date(req.query.endDate) };
        }
        
        const transactions = await Transaction.find(filter).sort({ date: -1 });
        
        const totalIncome = transactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);
        const totalExpense = transactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);
        
        res.json({
            success: true,
            count: transactions.length,
            transactions,
            summary: {
                totalIncome,
                totalExpense,
                balance: totalIncome - totalExpense
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get single transaction
const getTransactionById = async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id);
        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: 'Transaction not found'
            });
        }
        
        if (req.user.role !== 'admin' && transaction.createdBy?.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }
        
        res.json({
            success: true,
            transaction
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update transaction
const updateTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id);
        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: 'Transaction not found'
            });
        }
        
        if (req.user.role !== 'admin' && transaction.createdBy?.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }
        
        const { type, title, category, amount, description, date } = req.body;
        
        transaction.type = type || transaction.type;
        transaction.title = title || transaction.title;
        transaction.category = category || transaction.category;
        transaction.amount = amount || transaction.amount;
        transaction.description = description || transaction.description;
        transaction.date = date || transaction.date;
        
        await transaction.save();
        
        res.json({
            success: true,
            message: 'Transaction updated successfully',
            transaction
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Delete transaction
const deleteTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id);
        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: 'Transaction not found'
            });
        }
        
        if (req.user.role !== 'admin' && transaction.createdBy?.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }
        
        await transaction.deleteOne();
        res.json({
            success: true,
            message: 'Transaction deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ✅ ADD THIS MISSING FUNCTION - Get summary only
const getSummary = async (req, res) => {
    try {
        let filter = {};
        
        if (req.user.role !== 'admin') {
            filter.createdBy = req.user._id;
        }
        
        const transactions = await Transaction.find(filter);
        
        const totalIncome = transactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);
        const totalExpense = transactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);
        
        res.json({
            success: true,
            summary: {
                totalIncome,
                totalExpense,
                balance: totalIncome - totalExpense,
                totalTransactions: transactions.length
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createTransaction,
    getAllTransactions,
    getTransactionById,
    updateTransaction,
    deleteTransaction,
    getSummary  // ✅ Make sure this is exported
};