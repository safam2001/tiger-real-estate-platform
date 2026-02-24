
const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getCurrentUser,
  changePassword
} = require("../controllers/userController");

const authMiddleware = require("../middlewares/authMiddleware");
const { adminOnly } = require("../middlewares/roleMiddleware");

router.put("/me", authMiddleware, updateUser);
router.get("/me",authMiddleware,getCurrentUser);
router.put("/change-password",authMiddleware,changePassword)
// جلب كل المستخدمين (admin فقط)
router.get("/", authMiddleware, adminOnly, getAllUsers);

// جلب مستخدم بالـ ID (admin فقط)
router.get("/:id", authMiddleware, adminOnly, getUserById);

// إنشاء مستخدم جديد (admin فقط)
router.post("/", authMiddleware, adminOnly, createUser);

// حذف مستخدم (admin فقط)
router.delete("/:id", authMiddleware, adminOnly, deleteUser);


module.exports = router;