// const express = require("express");
// const router = express.Router();

// const {
//   createPlan,
//   getPlans,
//   createSubscription,
//   verifyPayment,
// } = require("../controllers/planController");

// router.post("/create-plan", createPlan);
// router.get("/", getPlans);
// router.post("/create-subscription", createSubscription);
// router.post("/verify", verifyPayment);

// module.exports = router;


const express = require("express");
const router = express.Router();

const {
  createPlan,
  getPlans,
  createSubscription,
  verifyPayment,
} = require("../controllers/planController");

const { protect, adminOnly } = require("../middleware/auth"); // 👈 import

// 🔐 Admin only
router.post("/create-plan",createPlan);

// 👀 Public (ya protect bhi kar sakte ho)
router.get("/", getPlans);

// 👤 User subscription (login required)
router.post("/create-subscription", protect, createSubscription);

// 🔐 Verify payment
router.post("/verify", protect, verifyPayment);

module.exports = router;
