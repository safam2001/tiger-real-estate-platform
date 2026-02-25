const Project = require("../models/project");
const Unit = require("../models/unit");

// ➤ جلب كل المشاريع مع الوحدات المرتبطة
const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.findAll({
      include: [{ model: Unit, as: 'Units' }] // جلب جميع الوحدات لكل مشروع
    });

    // تحويل JSON strings للصور والفيديوهات لمصفوفات قابلة للاستخدام في الواجهة
    const parsedProjects = projects.map(project => ({
      ...project.toJSON(),
      images: project.images ? (typeof project.images === 'string' ? JSON.parse(project.images) : project.images) : [],
      videos: project.videos ? (typeof project.videos === 'string' ? JSON.parse(project.videos) : project.videos) : []
    }));

    res.json(parsedProjects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ➤ جلب مشروع محدد بالـ ID مع جميع الوحدات المرتبطة
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id, {
      include: [{ model: Unit, as: 'Units' }] // جلب جميع الوحدات المرتبطة
    });

    if (!project) return res.status(404).json({ message: "Project not found" });

    // تحويل JSON strings للصور والفيديوهات
    const parsedProject = {
      ...project.toJSON(),
      images: project.images ? (typeof project.images === 'string' ? JSON.parse(project.images) : project.images) : [],
      videos: project.videos ? (typeof project.videos === 'string' ? JSON.parse(project.videos) : project.videos) : []
    };

    res.json(parsedProject);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ➤ إنشاء مشروع جديد
const createProject = async (req, res) => {
  try {
    const data = {
      ...req.body,
      // تحويل الصور والفيديوهات إلى JSON string قبل الحفظ
      images: Array.isArray(req.body.images) ? JSON.stringify(req.body.images) : (req.body.images || '[]'),
      videos: Array.isArray(req.body.videos) ? JSON.stringify(req.body.videos) : (req.body.videos || '[]')
    };

    const project = await Project.create(data);

    // إعادة تحويل JSON string إلى مصفوفة قبل الإرسال للواجهة
    res.status(201).json({
      ...project.toJSON(),
      images: JSON.parse(project.images),
      videos: JSON.parse(project.videos)
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ➤ تحديث مشروع موجود
const updateProject = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    const data = {
      ...req.body,
      images: Array.isArray(req.body.images) ? JSON.stringify(req.body.images) : (req.body.images || project.images),
      videos: Array.isArray(req.body.videos) ? JSON.stringify(req.body.videos) : (req.body.videos || project.videos)
    };

    await project.update(data);

    // إعادة تحويل JSON string إلى مصفوفة قبل الإرسال للواجهة
    res.json({
      ...project.toJSON(),
      images: JSON.parse(project.images),
      videos: JSON.parse(project.videos)
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ➤ حذف مشروع
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    await project.destroy();
    res.json({ message: "Project deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject
};