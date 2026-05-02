// const express = require("express");
// const router = express.Router();

// const {
//   createPlan,
//   getPlans,
//   createSubscription,
//   verifyPayment,
// } = require("../controllers/planController");

// const { protect, adminOnly } = require("../middleware/auth"); // 👈 import

// // 🔐 Admin only
// router.post("/create-plan",createPlan);

// // 👀 Public (ya protect bhi kar sakte ho)
// router.get("/", getPlans);

// // 👤 User subscription (login required)
// router.post("/create-subscription", protect, createSubscription);

// // 🔐 Verify payment
// router.post("/verify", protect, verifyPayment);

// module.exports = router;

const express = require("express");
const router = express.Router();

const {
  createPlan,
  getPlans,
  getPlanById,
  updatePlan,
  deletePlan,
  createSubscription,
  verifyPayment,
} = require("../controllers/planController");

const { protect } = require("../middleware/auth");

// 🔹 CRUD
router.post("/create-plan", createPlan);
router.get("/", getPlans);
router.get("/:id", getPlanById);       // ✅ ADD THIS
router.put("/:id", updatePlan);        // ✅ ADD THIS
router.delete("/:id", deletePlan);     // ✅ ADD THIS

// 🔹 Subscription
router.post("/create-subscription", protect, createSubscription);
router.post("/verify", protect, verifyPayment);

module.exports = router;
