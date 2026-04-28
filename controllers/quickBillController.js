const QuickBill = require('../models/QuickBill');

// @desc    Create Quick Bill
const createQuickBill = async (req, res) => {
    try {
        const { patientName, isPediatric, selectedTeeth, treatments, medicines, discount, fees, total } = req.body;
        
        const bill = await QuickBill.create({
            patientName,
            isPediatric,
            selectedTeeth,
            treatments,
            medicines,
            discount,
            fees,
            total,
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

// @desc    Get all Quick Bills
const getAllQuickBills = async (req, res) => {
    try {
        let filter = {};
        if (req.user.role !== 'admin') {
            filter.createdBy = req.user._id;
        }
        
        const bills = await QuickBill.find(filter).sort({ createdAt: -1 });
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

// @desc    Get single Quick Bill
const getQuickBillById = async (req, res) => {
    try {
        const bill = await QuickBill.findById(req.params.id);
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

// @desc    Update Quick Bill
const updateQuickBill = async (req, res) => {
    try {
        const bill = await QuickBill.findById(req.params.id);
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
        
        const { patientName, isPediatric, selectedTeeth, treatments, medicines, discount, fees, total, status } = req.body;
        
        if (patientName) bill.patientName = patientName;
        if (typeof isPediatric !== 'undefined') bill.isPediatric = isPediatric;
        if (selectedTeeth) bill.selectedTeeth = selectedTeeth;
        if (treatments) bill.treatments = treatments;
        if (medicines) bill.medicines = medicines;
        if (typeof discount !== 'undefined') bill.discount = discount;
        if (typeof fees !== 'undefined') bill.fees = fees;
        if (typeof total !== 'undefined') bill.total = total;
        if (status) bill.status = status;
        
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

// @desc    Delete Quick Bill
const deleteQuickBill = async (req, res) => {
    try {
        const bill = await QuickBill.findById(req.params.id);
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

module.exports = {
    createQuickBill,
    getAllQuickBills,
    getQuickBillById,
    updateQuickBill,
    deleteQuickBill
};