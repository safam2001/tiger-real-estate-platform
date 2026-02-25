
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");


// تعريف موديل المشروع (Project)

const Project = sequelize.define("Project", {

  // اسم المشروع
  name: { 
    type: DataTypes.STRING, 
    allowNull: false
  },

  // رابط صديق للـ URL للمشروع
  slug: { 
    type: DataTypes.STRING, 
    unique: true
  },

  // وصف المشروع
  description: DataTypes.TEXT,

  // موقع المشروع (مثلاً المدينة أو الحي)
  location: DataTypes.STRING,

  latitude: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  longitude: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  // الصورة الرئيسية للمشروع
  image: DataTypes.STRING,

  // معرض الصور (يتم تخزينه كـ JSON string)
  images: { 
    type: DataTypes.TEXT,
    defaultValue: '[]'
  },

  // روابط الفيديوهات الخاصة بالمشروع (JSON string)
  videos: { 
    type: DataTypes.TEXT, 
    defaultValue: '[]'
  },

  // حالة المشروع (يمكن لاحقًا إضافة active, inactive أو sold_out)
  status: { 
    type: DataTypes.ENUM("active", "inactive", "sold_out"),
    defaultValue: "active"
  }

}, {
  timestamps: true // يُضيف createdAt و updatedAt تلقائيًا
});


module.exports = Project;