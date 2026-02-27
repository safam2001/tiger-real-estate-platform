const express = require("express");
const router = express.Router();

const { 
  createInstallmentPlan,
  getInstallmentsByBooking,
  payInstallment,confirmInstallment
} = require("../controllers/installmentController");

const authMiddleware= require("../middlewares/authMiddleware");
const { adminOnly } = require("../middlewares/roleMiddleware");
const { userOnly } = require("../middlewares/roleMiddleware");


// إنشاء خطة أقساط (Admin فقط)

router.post("/:id/create-plan",authMiddleware, adminOnly, createInstallmentPlan);


// جلب كل الأقساط التابعة لحجز معيّن (Admin + User)

router.get("/:id",authMiddleware,getInstallmentsByBooking)

// دفع قسط معيّن (Admin فقط أو User حسب النظام)

router.put("/pay/:id",authMiddleware, payInstallment);
router.put("/installments/:id/confirm", confirmInstallment);
module.exports = router;