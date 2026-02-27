const Unit = require("../models/unit");
const Project = require("../models/project");

// ➤ جلب كل الوحدات، مع دعم الفلترة حسب المشروع (projectId)
const getAllUnits = async (req, res) => {
  try {
    const { projectId } = req.query;
    const where = projectId ? { projectId } : {}; // إذا تم إرسال projectId نفلتر الوحدات الخاصة به

    const units = await Unit.findAll({
      where,
      include: [{ model: Project, as: 'Project' }] // جلب بيانات المشروع المرتبط
    });

    // تحويل الـ JSON strings للصور والفيديوهات إلى مصفوفات قابلة للاستخدام في الواجهة
    const parsedUnits = units.map(unit => ({
      ...unit.toJSON(),
      images: unit.images ? (typeof unit.images === 'string' ? JSON.parse(unit.images) : unit.images) : [],
      videos: unit.videos ? (typeof unit.videos === 'string' ? JSON.parse(unit.videos) : unit.videos) : []
    }));

    res.json(parsedUnits);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ➤ جلب وحدة معينة بالـ ID
const getUnitById = async (req, res) => {
  try {
    const unit = await Unit.findByPk(req.params.id, {
      include: [{ model: Project, as: 'Project' }] // جلب بيانات المشروع المرتبط
    });

    if (!unit) return res.status(404).json({ message: "Unit not found" });

    // تحويل JSON strings للصور والفيديوهات
    const parsedUnit = {
      ...unit.toJSON(),
      images: unit.images ? (typeof unit.images === 'string' ? JSON.parse(unit.images) : unit.images) : [],
      videos: unit.videos ? (typeof unit.videos === 'string' ? JSON.parse(unit.videos) : unit.videos) : []
    };

    res.json(parsedUnit);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ➤ إنشاء وحدة جديدة
const createUnit = async (req, res) => {
  try {
    const data = {
      ...req.body,
      currency:req.body.currency,
      // تحويل الصور والفيديوهات إلى JSON string قبل الحفظ
      images: Array.isArray(req.body.images) ? JSON.stringify(req.body.images) : (req.body.images || '[]'),
      videos: Array.isArray(req.body.videos) ? JSON.stringify(req.body.videos) : (req.body.videos || '[]')
    };

    const unit = await Unit.create(data);

    // إعادة تحويل JSON string إلى مصفوفة قبل الإرسال للواجهة
    res.status(201).json({
      ...unit.toJSON(),
      images: JSON.parse(unit.images),
      videos: JSON.parse(unit.videos)
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ➤ تحديث وحدة موجودة
const updateUnit = async (req, res) => {
  try {
    const unit = await Unit.findByPk(req.params.id);
    if (!unit) return res.status(404).json({ message: "Unit not found" });

    const data = {
      ...req.body,
       currency:req.body.currency || unit.currency, 
      images: Array.isArray(req.body.images) ? JSON.stringify(req.body.images) : (req.body.images || unit.images),
      videos: Array.isArray(req.body.videos) ? JSON.stringify(req.body.videos) : (req.body.videos || unit.videos)
    };

    await unit.update(data);

    // إعادة تحويل JSON string إلى مصفوفة قبل الإرسال للواجهة
    res.json({
      ...unit.toJSON(),
      images: JSON.parse(unit.images),
      videos: JSON.parse(unit.videos)
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ➤ حذف وحدة
const deleteUnit = async (req, res) => {
  try {
    const unit = await Unit.findByPk(req.params.id);
    if (!unit) return res.status(404).json({ message: "Unit not found" });

    await unit.destroy();
    res.json({ message: "Unit deleted successfully" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAllUnits,
  getUnitById,
  createUnit,
  updateUnit,
  deleteUnit
};