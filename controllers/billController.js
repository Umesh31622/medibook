const Bill = require('../models/Bill');

// @desc    Create bill
const createBill = async (req, res) => {
    try {
        const { patientName, phoneNumber, amount, status, notes } = req.body;
        
        const bill = await Bill.create({
            patientName,
            phoneNumber,
            amount,
            status,
            notes,
            createdBy: req.user._id
        });
        
        res.status(201).json({
            success: true,
            message: 'Bill created successfully',
            bill
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get all bills (Admin: sab, User: apna)
const getAllBills = async (req, res) => {
    try {
        let filter = {};
        if (req.user.role !== 'admin') {
            filter.createdBy = req.user._id;
        }
        
        const bills = await Bill.find(filter).sort({ createdAt: -1 });
        res.json({
            success: true,
            count: bills.length,
            bills
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get single bill
const getBillById = async (req, res) => {
    try {
        const bill = await Bill.findById(req.params.id);
        if (!bill) {
            return res.status(404).json({
                success: false,
                message: 'Bill not found'
            });
        }
        
        if (req.user.role !== 'admin' && bill.createdBy?.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }
        
        res.json({
            success: true,
            bill
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update bill
const updateBill = async (req, res) => {
    try {
        const bill = await Bill.findById(req.params.id);
        if (!bill) {
            return res.status(404).json({
                success: false,
                message: 'Bill not found'
            });
        }
        
        if (req.user.role !== 'admin' && bill.createdBy?.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }
        
        const { patientName, phoneNumber, amount, status, notes } = req.body;
        
        bill.patientName = patientName || bill.patientName;
        bill.phoneNumber = phoneNumber || bill.phoneNumber;
        bill.amount = amount || bill.amount;
        bill.status = status || bill.status;
        bill.notes = notes || bill.notes;
        
        if (status === 'Paid' && !bill.paymentDate) {
            bill.paymentDate = new Date();
        }
        
        await bill.save();
        
        res.json({
            success: true,
            message: 'Bill updated successfully',
            bill
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Delete bill
const deleteBill = async (req, res) => {
    try {
        const bill = await Bill.findById(req.params.id);
        if (!bill) {
            return res.status(404).json({
                success: false,
                message: 'Bill not found'
            });
        }
        
        if (req.user.role !== 'admin' && bill.createdBy?.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }
        
        await bill.deleteOne();
        res.json({
            success: true,
            message: 'Bill deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update bill status
const updateBillStatus = async (req, res) => {
    try {
        const bill = await Bill.findById(req.params.id);
        if (!bill) {
            return res.status(404).json({
                success: false,
                message: 'Bill not found'
            });
        }
        
        if (req.user.role !== 'admin' && bill.createdBy?.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }
        
        const { status } = req.body;
        bill.status = status;
        if (status === 'Paid') {
            bill.paymentDate = new Date();
        }
        await bill.save();
        
        res.json({
            success: true,
            message: 'Bill status updated',
            bill
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createBill,
    getAllBills,
    getBillById,
    updateBill,
    deleteBill,
    updateBillStatus
};