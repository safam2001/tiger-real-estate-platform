// استيراد DataTypes من Sequelize لتعريف أنواع الحقول
const { DataTypes } = require("sequelize");

// استيراد اتصال قاعدة البيانات
const sequelize = require("../config/database");

// استيراد bcrypt لتشفير كلمة المرور
const bcrypt = require("bcrypt");

// تعريف موديل Admin
const Admin = sequelize.define("Admin", {
  // اسم المستخدم
  username: {
    type: DataTypes.STRING,
    allowNull: false,       // لا يسمح أن يكون فارغًا
    unique: true            // يجب أن يكون فريدًا
  },

  // البريد الإلكتروني
  email: {
    type: DataTypes.STRING,
    allowNull: false,       // لا يسمح أن يكون فارغًا
    unique: true            // يجب أن يكون فريدًا
  },

  // كلمة المرور (ستُخزَّن مشفرة)
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },

  // الدور (Admin فقط)
  role: {
    type: DataTypes.STRING,
    defaultValue: "admin",  // القيمة الافتراضية admin
    allowNull: false,
    validate: {
      // منع أي دور آخر غير admin
      isIn: [["admin"]]
    }
  }
});


// Hooks (تُنفذ تلقائيًا)


// قبل إنشاء Admin جديد
Admin.beforeCreate(async (admin) => {
  // إجبار الدور دائمًا أن يكون admin
  admin.role = "admin";

  // تشفير كلمة المرور قبل حفظها في قاعدة البيانات
  const salt = await bcrypt.genSalt(10);
  admin.password = await bcrypt.hash(admin.password, salt);
});

// قبل تحديث بيانات Admin
Admin.beforeUpdate(async (admin) => {
  // منع تغيير الدور إلى أي قيمة أخرى
  if (admin.changed("role") && admin.role !== "admin") {
    admin.role = "admin";
  }

  // إذا تم تعديل كلمة المرور، يتم تشفيرها من جديد
  if (admin.changed("password")) {
    const salt = await bcrypt.genSalt(10);
    admin.password = await bcrypt.hash(admin.password, salt);
  }
});

// تصدير الموديل لاستخدامه في باقي المشروع
module.exports = Admin;