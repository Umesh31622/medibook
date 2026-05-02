const express = require('express');
const router = express.Router();

// Temporary test route
router.get('/plans', (req, res) => {
    res.json({
        success: true,
        plans: [
            {
                _id: '1',
                name: 'Standard',
                price: 7000,
                yearlyPrice: 7000,
                features: [
                    'Appointment Calendar',
                    'Waiting Area & Queue Management',
                    'Speciality based Features',
                    'e-Prescription'
                ],
                isActive: true,
                popular: false
            },
            {
                _id: '2',
                name: 'Premium',
                price: 8500,
                yearlyPrice: 8500,
                features: [
                    'Appointment Calendar',
                    'Waiting Area & Queue Management',
                    'Speciality based Features',
                    'e-Prescription',
                    'Advanced Analytics',
                    'Priority Support'
                ],
                isActive: true,
                popular: true
            }
        ]
    });
});

// Get user subscription
router.get('/my-subscription', (req, res) => {
    res.json({
        success: true,
        subscription: null
    });
});

// Create order
router.post('/create-order', (req, res) => {
    res.json({
        success: true,
        message: 'Order creation - will implement after Razorpay setup'
    });
});

// Verify payment
router.post('/verify-payment', (req, res) => {
    res.json({
        success: true,
        message: 'Payment verification - will implement after Razorpay setup'
    });
});

// Payment history
router.get('/payment-history', (req, res) => {
    res.json({
        success: true,
        history: []
    });
});

// Cancel subscription
router.post('/cancel', (req, res) => {
    res.json({
        success: true,
        message: 'Subscription cancelled'
    });
});

module.exports = router;