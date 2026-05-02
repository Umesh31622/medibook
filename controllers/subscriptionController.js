const SubscriptionPlan = require('../models/SubscriptionPlan');
const UserSubscription = require('../models/UserSubscription');
const PaymentHistory = require('../models/PaymentHistory');
const Razorpay = require('razorpay');

// Initialize Razorpay
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET
});

// ==================== PLAN MANAGEMENT (ADMIN) ====================

// @desc    Get all subscription plans
const getPlans = async (req, res) => {
    try {
        const plans = await SubscriptionPlan.find({ isActive: true }).sort({ price: 1 });
        
        // If no plans in DB, return default plans
        if (plans.length === 0) {
            const defaultPlans = [
                {
                    name: 'Standard',
                    price: 7000,
                    yearlyPrice: 7000,
                    features: [
                        'Appointment Calendar',
                        'Waiting Area & Queue Management',
                        'Speciality based Features',
                        'e-Prescription',
                        'Separate business from personal spending'
                    ],
                    featuresDetail: {
                        sms: 'Promotional / Campaign Messages',
                        localLanguage: true,
                        socialMediaIntegration: true,
                        onlineBookingWidget: true,
                        onlinePayment: true,
                        additionalDoctors: 'Unlimited',
                        supportStaff: 'Unlimited',
                        numberOfClinics: 1,
                        additionalClinicCharge: 3500
                    },
                    isActive: true,
                    popular: false
                },
                {
                    name: 'Premium',
                    price: 8500,
                    yearlyPrice: 8500,
                    features: [
                        'Appointment Calendar',
                        'Waiting Area & Queue Management',
                        'Speciality based Features',
                        'e-Prescription',
                        'Separate business from personal spending',
                        'Advanced Analytics',
                        'Priority Support'
                    ],
                    featuresDetail: {
                        sms: 'Promotional / Campaign Messages',
                        localLanguage: true,
                        socialMediaIntegration: true,
                        onlineBookingWidget: true,
                        onlinePayment: true,
                        additionalDoctors: 'Unlimited',
                        supportStaff: 'Unlimited',
                        numberOfClinics: 1,
                        additionalClinicCharge: 4250
                    },
                    isActive: true,
                    popular: true
                }
            ];
            return res.json({ success: true, plans: defaultPlans });
        }
        
        res.json({ success: true, plans });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get all plans for admin (including inactive)
const getAllPlans = async (req, res) => {
    try {
        const plans = await SubscriptionPlan.find().sort({ price: 1 });
        res.json({ success: true, plans });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Create subscription plan (Admin only)
const createPlan = async (req, res) => {
    try {
        const plan = await SubscriptionPlan.create(req.body);
        res.status(201).json({ success: true, message: 'Plan created successfully', plan });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update subscription plan (Admin only)
const updatePlan = async (req, res) => {
    try {
        const plan = await SubscriptionPlan.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!plan) return res.status(404).json({ success: false, message: 'Plan not found' });
        res.json({ success: true, message: 'Plan updated successfully', plan });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Delete subscription plan (Admin only)
const deletePlan = async (req, res) => {
    try {
        const plan = await SubscriptionPlan.findByIdAndDelete(req.params.id);
        if (!plan) return res.status(404).json({ success: false, message: 'Plan not found' });
        res.json({ success: true, message: 'Plan deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ==================== USER SUBSCRIPTION ====================

// @desc    Get user's current subscription
const getUserSubscription = async (req, res) => {
    try {
        const subscription = await UserSubscription.findOne({
            userId: req.user._id,
            status: 'active'
        }).populate('planId');
        
        if (!subscription) {
            return res.json({ success: true, subscription: null });
        }
        
        // Check if subscription has expired
        if (subscription.endDate && new Date(subscription.endDate) < new Date()) {
            subscription.status = 'expired';
            await subscription.save();
            return res.json({ success: true, subscription: null });
        }
        
        res.json({ success: true, subscription });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Create subscription order
const createSubscriptionOrder = async (req, res) => {
    try {
        const { planId, billingInterval = 'monthly' } = req.body;
        const plan = await SubscriptionPlan.findById(planId);
        
        if (!plan) {
            return res.status(404).json({ success: false, message: 'Plan not found' });
        }
        
        let amount = plan.price;
        if (billingInterval === 'yearly') {
            amount = plan.yearlyPrice || plan.price * 12 * 0.9;
        }
        
        // Add GST (18%)
        const gstAmount = amount * 0.18;
        const totalAmount = amount + gstAmount;
        
        const options = {
            amount: Math.round(totalAmount * 100), // in paise
            currency: 'INR',
            receipt: `receipt_${Date.now()}`,
            notes: {
                planId: plan._id.toString(),
                planName: plan.name,
                billingInterval,
                userId: req.user._id.toString()
            }
        };
        
        const order = await razorpay.orders.create(options);
        
        res.json({
            success: true,
            order,
            key: process.env.RAZORPAY_KEY_ID,
            amount: totalAmount,
            plan
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Verify payment and activate subscription
const verifyPayment = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            planId,
            billingInterval
        } = req.body;
        
        const crypto = require('crypto');
        const body = razorpay_order_id + '|' + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_SECRET)
            .update(body.toString())
            .digest('hex');
        
        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({ success: false, message: 'Invalid signature' });
        }
        
        const plan = await SubscriptionPlan.findById(planId);
        if (!plan) {
            return res.status(404).json({ success: false, message: 'Plan not found' });
        }
        
        let amount = plan.price;
        if (billingInterval === 'yearly') {
            amount = plan.yearlyPrice || plan.price * 12 * 0.9;
        }
        
        // Calculate end date
        let endDate = null;
        if (plan.duration.unit === 'years') {
            endDate = new Date();
            endDate.setFullYear(endDate.getFullYear() + plan.duration.value);
        } else if (plan.duration.unit === 'months') {
            endDate = new Date();
            endDate.setMonth(endDate.getMonth() + plan.duration.value);
        }
        
        // Create/Update subscription
        let subscription = await UserSubscription.findOne({
            userId: req.user._id,
            status: 'active'
        });
        
        if (subscription) {
            // Extend existing subscription
            if (subscription.endDate && new Date(subscription.endDate) > new Date()) {
                endDate = new Date(subscription.endDate);
                if (plan.duration.unit === 'years') {
                    endDate.setFullYear(endDate.getFullYear() + plan.duration.value);
                } else if (plan.duration.unit === 'months') {
                    endDate.setMonth(endDate.getMonth() + plan.duration.value);
                }
            }
            subscription.planId = plan._id;
            subscription.planName = plan.name;
            subscription.amount = amount;
            subscription.endDate = endDate;
            subscription.status = 'active';
            subscription.paymentId = razorpay_payment_id;
            subscription.orderId = razorpay_order_id;
            subscription.billingInterval = billingInterval;
            await subscription.save();
        } else {
            subscription = await UserSubscription.create({
                userId: req.user._id,
                userEmail: req.user.email,
                userName: req.user.name,
                planId: plan._id,
                planName: plan.name,
                amount: amount,
                startDate: new Date(),
                endDate: endDate,
                status: 'active',
                paymentId: razorpay_payment_id,
                orderId: razorpay_order_id,
                billingInterval: billingInterval
            });
        }
        
        // Save payment history
        await PaymentHistory.create({
            userId: req.user._id,
            userEmail: req.user.email,
            planId: plan._id,
            planName: plan.name,
            amount: amount,
            paymentId: razorpay_payment_id,
            orderId: razorpay_order_id,
            status: 'success',
            billingInterval: billingInterval
        });
        
        res.json({
            success: true,
            message: 'Payment verified successfully',
            subscription
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get payment history
const getPaymentHistory = async (req, res) => {
    try {
        const history = await PaymentHistory.find({ userId: req.user._id })
            .sort({ createdAt: -1 })
            .limit(20);
        res.json({ success: true, history });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Cancel subscription
const cancelSubscription = async (req, res) => {
    try {
        const subscription = await UserSubscription.findOne({
            userId: req.user._id,
            status: 'active'
        });
        
        if (!subscription) {
            return res.status(404).json({ success: false, message: 'No active subscription found' });
        }
        
        subscription.status = 'cancelled';
        await subscription.save();
        
        res.json({ success: true, message: 'Subscription cancelled successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getPlans,
    getAllPlans,
    createPlan,
    updatePlan,
    deletePlan,
    getUserSubscription,
    createSubscriptionOrder,
    verifyPayment,
    getPaymentHistory,
    cancelSubscription
};