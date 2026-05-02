// backend/models/AppSetting.js
const mongoose = require("mongoose");

const appSettingSchema = new mongoose.Schema({
  payment: {
    razorpayEnabled: {
      type: Boolean,
      default: true
    },
    razorpayKeyId: {
      type: String,
      default: ""
    },
    razorpaySecret: {
      type: String,
      default: ""
    }
  },
  gstPercent: {
    type: Number,
    default: 18
  },
  currency: {
    type: String,
    default: "INR"
  }
}, { timestamps: true });

module.exports = mongoose.model("AppSetting", appSettingSchema);