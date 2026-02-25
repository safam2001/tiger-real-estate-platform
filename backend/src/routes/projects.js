const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const { adminOnly } = require("../middlewares/roleMiddleware"); // استدعاء Admin فقط

const {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject
} = require("../controllers/projectController");


// Routes للمشاريع (Projects)


// ➤ الحصول على كل المشاريع (متاح للجميع)
router.get("/", getAllProjects);

// ➤ الحصول على مشروع واحد حسب ID (متاح للجميع)
router.get("/:id", getProjectById);

// ➤ إنشاء مشروع جديد (Admin فقط)
router.post("/", authMiddleware, adminOnly, createProject);

// ➤ تعديل مشروع موجود (Admin فقط)
router.put("/:id", authMiddleware, adminOnly, updateProject);

// ➤ حذف مشروع (Admin فقط)
router.delete("/:id", authMiddleware, adminOnly, deleteProject);

module.exports = router;