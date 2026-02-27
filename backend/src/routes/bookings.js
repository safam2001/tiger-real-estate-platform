
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const { adminOnly } = require("../middlewares/roleMiddleware");
const { userOnly } = require("../middlewares/roleMiddleware");
const {
  addBooking,
  cancelBooking,
  sendBookingReminder,
  getAllBookings,
  getUserBookings,
  updateBooking,
  deleteBooking,
  confirmBooking,
  markPaid,
  getBookingById
} = require("../controllers/bookingController");

// CRUD للبوكنغ
router.get("/", authMiddleware, adminOnly, getAllBookings); // عرض كل الحجوزات (Admin فقط)
router.get("/my", authMiddleware, userOnly, getUserBookings); // عرض حجوزات المستخدم

router.post("/", authMiddleware, userOnly, addBooking); // إضافة حجز جديد
router.get("/:id", authMiddleware,getBookingById);
router.put("/:id", authMiddleware, adminOnly, updateBooking); // تعديل حجز (Admin فقط)
router.delete("/:id", authMiddleware, adminOnly, deleteBooking); // حذف حجز (Admin فقط)
router.post("/:id/cancel", authMiddleware, adminOnly, cancelBooking); // إلغاء حجز (المستخدم فقط)
router.put("/:id/confirm", authMiddleware, adminOnly, confirmBooking);
router.put("/:id/paid", authMiddleware, adminOnly, markPaid);
module.exports = router;