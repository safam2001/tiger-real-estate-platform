
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware"); // إذا عندك رفع ملفات
const { createPayment, confirmPayment, getAllPayments,approvePayment } = require("../controllers/paymentController");
const { adminOnly } = require("../middlewares/roleMiddleware");

// إنشاء دفعة (غير مستخدم لصفحة الدفع)
router.post("/", authMiddleware, createPayment);

// تأكيد دفع قسط (المهم)
router.post("/confirm", authMiddleware, upload.single("receipt"), confirmPayment);

// عرض كل الدفعات (Admin)
router.get("/", authMiddleware, adminOnly, getAllPayments);
router.put("/approve/:paymentId",authMiddleware, adminOnly, approvePayment);

module.exports = router;