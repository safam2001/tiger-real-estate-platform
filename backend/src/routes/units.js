const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const { adminOnly } = require("../middlewares/roleMiddleware");
const {
  createUnit,
  getAllUnits,
  getUnitById,
  updateUnit,
  deleteUnit
} = require("../controllers/unitController");

// ➤ Routes للوحدات
router.get("/",getAllUnits); // عرض كل الوحدات
router.get("/:id", authMiddleware, getUnitById); // عرض وحدة معينة
router.post("/", authMiddleware, adminOnly, createUnit); // إنشاء وحدة جديدة (Admin فقط)
router.put("/:id", authMiddleware, adminOnly, updateUnit); // تعديل وحدة (Admin فقط)
router.delete("/:id", authMiddleware, adminOnly, deleteUnit); // حذف وحدة (Admin فقط)

module.exports = router;