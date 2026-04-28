const Report = require('../models/Report');
const Appointment = require('../models/Appointment');
const Bill = require('../models/Bill');
const Patient = require('../models/Patient');
const Transaction = require('../models/Transaction');

// @desc    Generate Doctor Wise Visit Report
const getDoctorWiseVisitReport = async (req, res) => {
    try {
        const { fromDate, toDate } = req.query;
        let filter = {};
        
        if (fromDate && toDate) {
            filter.appointmentDate = {
                $gte: new Date(fromDate),
                $lte: new Date(toDate)
            };
        }
        
        if (req.user.role !== 'admin') {
            filter.createdBy = req.user._id;
        }
        
        const appointments = await Appointment.find(filter);
        
        const doctorStats = {};
        appointments.forEach(apt => {
            if (!doctorStats[apt.doctorName]) {
                doctorStats[apt.doctorName] = {
                    doctorName: apt.doctorName,
                    totalVisits: 0,
                    completed: 0,
                    pending: 0,
                    revenue: 0
                };
            }
            doctorStats[apt.doctorName].totalVisits++;
            if (apt.status === 'Completed') doctorStats[apt.doctorName].completed++;
            if (apt.status === 'Scheduled') doctorStats[apt.doctorName].pending++;
        });
        
        res.json({
            success: true,
            report: Object.values(doctorStats),
            fromDate, toDate
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Generate Doctor Wise Payment Report
const getDoctorWisePaymentReport = async (req, res) => {
    try {
        const { fromDate, toDate } = req.query;
        let filter = {};
        
        if (fromDate && toDate) {
            filter.createdAt = {
                $gte: new Date(fromDate),
                $lte: new Date(toDate)
            };
        }
        
        if (req.user.role !== 'admin') {
            filter.createdBy = req.user._id;
        }
        
        const bills = await Bill.find(filter);
        
        const doctorPayments = {};
        bills.forEach(bill => {
            if (!doctorPayments[bill.patientName]) {
                doctorPayments[bill.patientName] = {
                    doctorName: bill.patientName,
                    totalAmount: 0,
                    paid: 0,
                    pending: 0
                };
            }
            doctorPayments[bill.patientName].totalAmount += bill.amount;
            if (bill.status === 'Paid') {
                doctorPayments[bill.patientName].paid += bill.amount;
            } else {
                doctorPayments[bill.patientName].pending += bill.amount;
            }
        });
        
        res.json({
            success: true,
            report: Object.values(doctorPayments),
            fromDate, toDate
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Generate Clinic Wise Payment Report
const getClinicWisePaymentReport = async (req, res) => {
    try {
        const { fromDate, toDate } = req.query;
        let filter = {};
        
        if (fromDate && toDate) {
            filter.createdAt = {
                $gte: new Date(fromDate),
                $lte: new Date(toDate)
            };
        }
        
        if (req.user.role !== 'admin') {
            filter.createdBy = req.user._id;
        }
        
        const bills = await Bill.find(filter);
        
        const totalAmount = bills.reduce((sum, b) => sum + b.amount, 0);
        const paidAmount = bills.filter(b => b.status === 'Paid').reduce((sum, b) => sum + b.amount, 0);
        const pendingAmount = bills.filter(b => b.status === 'Pending').reduce((sum, b) => sum + b.amount, 0);
        
        res.json({
            success: true,
            report: {
                totalAmount,
                paidAmount,
                pendingAmount,
                totalBills: bills.length,
                paidBills: bills.filter(b => b.status === 'Paid').length,
                pendingBills: bills.filter(b => b.status === 'Pending').length
            },
            fromDate, toDate
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Generate Birthday Report
const getBirthdayReport = async (req, res) => {
    try {
        const { fromDate, toDate } = req.query;
        let filter = {};
        
        if (req.user.role !== 'admin') {
            filter.createdBy = req.user._id;
        }
        
        const patients = await Patient.find(filter);
        
        const birthdayPatients = patients.filter(patient => {
            const dob = new Date(patient.dob);
            const from = new Date(fromDate);
            const to = new Date(toDate);
            const birthdayThisYear = new Date(2024, dob.getMonth(), dob.getDate());
            return birthdayThisYear >= from && birthdayThisYear <= to;
        });
        
        res.json({
            success: true,
            report: birthdayPatients.map(p => ({
                name: p.name,
                phone: p.mobileNumber,
                dob: p.dob,
                age: p.age
            })),
            fromDate, toDate
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Generate Follow-up Due Report
const getFollowupDueReport = async (req, res) => {
    try {
        const { fromDate, toDate } = req.query;
        let filter = {
            followUpDate: {
                $gte: new Date(fromDate),
                $lte: new Date(toDate)
            }
        };
        
        if (req.user.role !== 'admin') {
            filter.createdBy = req.user._id;
        }
        
        const prescriptions = await Prescription.find(filter);
        
        res.json({
            success: true,
            report: prescriptions.map(p => ({
                patientName: p.patientName,
                doctorName: p.doctorName,
                followUpDate: p.followUpDate,
                diagnosis: p.diagnosis
            })),
            fromDate, toDate
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Generate Treatment Wise Report
const getTreatmentWiseReport = async (req, res) => {
    try {
        const { fromDate, toDate } = req.query;
        let filter = {};
        
        if (fromDate && toDate) {
            filter.createdAt = {
                $gte: new Date(fromDate),
                $lte: new Date(toDate)
            };
        }
        
        if (req.user.role !== 'admin') {
            filter.createdBy = req.user._id;
        }
        
        const bills = await Bill.find(filter);
        
        const treatments = {};
        bills.forEach(bill => {
            if (!treatments[bill.patientName]) {
                treatments[bill.patientName] = {
                    treatment: bill.patientName,
                    count: 0,
                    amount: 0
                };
            }
            treatments[bill.patientName].count++;
            treatments[bill.patientName].amount += bill.amount;
        });
        
        res.json({
            success: true,
            report: Object.values(treatments),
            fromDate, toDate
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Generate Payment Summary Report
const getPaymentSummaryReport = async (req, res) => {
    try {
        const { fromDate, toDate } = req.query;
        let filter = {};
        
        if (fromDate && toDate) {
            filter.createdAt = {
                $gte: new Date(fromDate),
                $lte: new Date(toDate)
            };
        }
        
        if (req.user.role !== 'admin') {
            filter.createdBy = req.user._id;
        }
        
        const transactions = await Transaction.find({ ...filter, type: 'income' });
        const expenses = await Transaction.find({ ...filter, type: 'expense' });
        
        const totalIncome = transactions.reduce((sum, t) => sum + t.amount, 0);
        const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);
        
        res.json({
            success: true,
            report: {
                totalIncome,
                totalExpense,
                netProfit: totalIncome - totalExpense,
                incomeCount: transactions.length,
                expenseCount: expenses.length
            },
            fromDate, toDate
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Save generated report
const saveReport = async (req, res) => {
    try {
        const { title, type, fromDate, toDate, data } = req.body;
        
        const report = await Report.create({
            title,
            type,
            fromDate,
            toDate,
            data,
            generatedBy: req.user._id
        });
        
        res.status(201).json({
            success: true,
            message: 'Report saved successfully',
            report
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get all saved reports
const getSavedReports = async (req, res) => {
    try {
        let filter = {};
        if (req.user.role !== 'admin') {
            filter.generatedBy = req.user._id;
        }
        
        const reports = await Report.find(filter).sort({ createdAt: -1 });
        res.json({
            success: true,
            count: reports.length,
            reports
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Delete saved report
const deleteReport = async (req, res) => {
    try {
        const report = await Report.findById(req.params.id);
        if (!report) {
            return res.status(404).json({ success: false, message: 'Report not found' });
        }
        
        if (req.user.role !== 'admin' && report.generatedBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Access denied' });
        }
        
        await report.deleteOne();
        res.json({ success: true, message: 'Report deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getDoctorWiseVisitReport,
    getDoctorWisePaymentReport,
    getClinicWisePaymentReport,
    getBirthdayReport,
    getFollowupDueReport,
    getTreatmentWiseReport,
    getPaymentSummaryReport,
    saveReport,
    getSavedReports,
    deleteReport
};