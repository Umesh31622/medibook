const razorpay = require("../config/razorpay");
const Plan = require("../models/Plan");
const crypto = require("crypto");

// ✅ Admin create plan
exports.createPlan = async (req, res) => {
  try {
    const { name, amount, duration } = req.body;

    const rzpPlan = await razorpay.plans.create({
      period: "monthly",
      interval: duration,
      item: {
        name,
        amount: amount * 100,
        currency: "INR",
      },
    });

    const plan = await Plan.create({
      name,
      amount,
      duration,
      razorpay_plan_id: rzpPlan.id,
    });

    res.json(plan);
  } catch (err) {
    res.status(500).json(err);
  }
};

// ✅ Get plans
exports.getPlans = async (req, res) => {
  const plans = await Plan.find();
  res.json(plans);
};

// ✅ Create subscription
exports.createSubscription = async (req, res) => {
  try {
    const { plan_id } = req.body;

    const subscription = await razorpay.subscriptions.create({
      plan_id,
      customer_notify: 1,
      total_count: 12,
    });

    res.json(subscription);
  } catch (err) {
    res.status(500).json(err);
  }
};

// ✅ Verify payment
exports.verifyPayment = (req, res) => {
  const {
    razorpay_payment_id,
    razorpay_subscription_id,
    razorpay_signature,
  } = req.body;

  const body =
    razorpay_payment_id + "|" + razorpay_subscription_id;

  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET)
    .update(body)
    .digest("hex");

  if (expected === razorpay_signature) {
    res.json({ status: "success" });
  } else {
    res.status(400).json({ status: "failed" });
  }
};