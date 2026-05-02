const mongoose = require("mongoose");

const planSchema = new mongoose.Schema({
  name: String,
  amount: Number,
  duration: Number,
  razorpay_plan_id: String,
});

module.exports = mongoose.model("Plan", planSchema);