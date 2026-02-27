
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Project = require("./project");


// تعريف موديل الوحدة (Unit)

const Unit = sequelize.define("Unit", {

  // رقم الوحدة داخل المشروع (مثلاً A101)
  number: { 
    type: DataTypes.STRING,
    allowNull: false
  },

  // نوع الوحدة: شقة، دوبلكس، فيلا ...
  type: DataTypes.STRING,

  // رابط صديق للـ URL للوحدة
  slug: { 
    type: DataTypes.STRING,
    unique: true
  },

  // سعر الوحدة
  price: DataTypes.FLOAT,

  // العملة، افتراضيًا USD
  currency: { 
    type: DataTypes.STRING,
    defaultValue: "USD"
  },

  // وصف الوحدة
  description: DataTypes.TEXT,

  // الصورة الرئيسية للوحدة
  image: DataTypes.STRING,

  // معرض الصور (JSON string)
  images: { 
    type: DataTypes.TEXT,
    defaultValue: '[]'
  },

  // روابط الفيديوهات (JSON string)
  videos: { 
    type: DataTypes.TEXT,
    defaultValue: '[]'
  },

  // مساحة الوحدة بالمتر المربع
  area: DataTypes.FLOAT,

  // عدد غرف النوم
  bedrooms: DataTypes.INTEGER,

  // عدد الحمامات
  bathrooms: DataTypes.INTEGER,

  // حالة الوحدة: available = متاحة، booked = محجوزة، sold = مباعة
  status: { 
    type: DataTypes.ENUM("available", "booked", "sold"),
    defaultValue: "available"
  },

  // ربط الوحدة بالمشروع
  projectId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }

}, {
  timestamps: true
});


// العلاقات بين الموديلات


// كل مشروع يحتوي على عدة وحدات
Project.hasMany(Unit, { 
  foreignKey: 'projectId',
  onDelete: 'CASCADE',
  as: 'Units'
});

// كل وحدة تنتمي لمشروع واحد
Unit.belongsTo(Project, { 
  foreignKey: 'projectId',
  as: 'Project'
});

module.exports = Unit;