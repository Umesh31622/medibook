const express = require('express');
const router = express.Router();
const {
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
} = require('../controllers/reportController');
const { protect } = require('../middleware/auth');

router.use(protect);

// Generate Reports
router.get('/doctor-wise-visit', getDoctorWiseVisitReport);
router.get('/doctor-wise-payment', getDoctorWisePaymentReport);
router.get('/clinic-wise-payment', getClinicWisePaymentReport);
router.get('/birthday', getBirthdayReport);
router.get('/followup-due', getFollowupDueReport);
router.get('/treatment-wise', getTreatmentWiseReport);
router.get('/payment-summary', getPaymentSummaryReport);

// Save & Manage Reports
router.post('/save', saveReport);
router.get('/saved', getSavedReports);
router.delete('/saved/:id', deleteReport);

module.exports = router;