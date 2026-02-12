// // // routes/users.js

// // const express = require("express");
// // const router = express.Router();

// // const {
// //   getAllUsers,
// //   getUserById,
// //   createUser,
// //   updateUser,
// //   deleteUser
// // } = require("../controllers/userController");

// // // 🔐 استيراد الحماية
// // const authMiddleware= require("../middlewares/authMiddleware");
// // const { adminOnly } = require("../middlewares/roleMiddleware");


// // // =============================
// // // جميع الراوتات محمية للأدمن فقط
// // // =============================

// // // جلب كل المستخدمين (admin فقط)
// // router.get("/", authMiddleware, adminOnly, getAllUsers);

// // // جلب مستخدم بالـ ID (admin فقط)
// // router.get("/:id", authMiddleware, adminOnly, getUserById);

// // // إنشاء مستخدم جديد (admin فقط)
// // router.post("/", authMiddleware, adminOnly, createUser);

// // // تحديث مستخدم (admin فقط)
// // router.put("/:id", authMiddleware, adminOnly, updateUser);

// // // حذف مستخدم (admin فقط)
// // router.delete("/:id", authMiddleware, adminOnly, deleteUser);


// // module.exports = router;
// // routes/users.js
// const express = require("express");
// const router = express.Router();
// const {
//   getAllUsers,
//   getUserById,
//   createUser,
//   updateUser,
//   deleteUser
// } = require("../controllers/userController");
// const authMiddleware = require("../middlewares/authMiddleware");
// const { adminOnly } = require("../middlewares/roleMiddeleware");

// // جلب كل المستخدمين
// router.get("/",authMiddleware,adminOnly, getAllUsers);

// // جلب مستخدم بالـ ID
// router.get("/:id",authMiddleware,adminOnly, getUserById);

// // إنشاء مستخدم جديد
// router.post("/",authMiddleware,adminOnly, createUser);

// // تحديث مستخدم
// router.put("/:id",authMiddleware,adminOnly, updateUser);

// // حذف مستخدم
// router.delete("/:id",authMiddleware,adminOnly, deleteUser);

// module.exports = router;
const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
} = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");
const { adminOnly } = require("../middlewares/roleMiddeleware");

// جلب كل المستخدمين (admin فقط)
router.get("/", authMiddleware, adminOnly, getAllUsers);

// جلب مستخدم بالـ ID (admin فقط)
router.get("/:id", authMiddleware, adminOnly, getUserById);

// إنشاء مستخدم جديد (admin فقط)
router.post("/", authMiddleware, adminOnly, createUser);

// حذف مستخدم (admin فقط)
router.delete("/:id", authMiddleware, adminOnly, deleteUser);

// تحديث بيانات الأدمين نفسه
router.put("/me", authMiddleware, updateUser);

module.exports = router;