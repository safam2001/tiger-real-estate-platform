
const User = require("../models/user");
const bcrypt=require("bcrypt")
// جلب كل المستخدمين

const getAllUsers = async (req, res) => {
  try {
    // نستخدم attributes لتحديد الحقول المراد إرجاعها فقط
    // هذا يمنع إرسال بيانات حساسة مثل كلمة المرور
    const users = await User.findAll({
      attributes: ["id", "firstName", "lastName", "email", "role", "createdAt"]
    });

    // إرسال الرد للعميل
    res.status(200).json(users);
  } catch (err) {
    // في حال حدوث خطأ
    res.status(500).json({ message: err.message });
  }
};


// جلب مستخدم محدد بالـ ID

const getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: ["id", "firstName", "lastName", "email", "role", "createdAt"]
    });

    // التحقق إذا لم يوجد المستخدم
    if (!user) return res.status(404).json({ message: "المستخدم غير موجود" });

    // إرسال بيانات المستخدم
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// إنشاء مستخدم جديد (عادة بواسطة Admin)

const createUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;

    // إنشاء المستخدم في قاعدة البيانات
    // ⚠️ كلمة المرور يتم تشفيرها تلقائيًا في الـ model hook قبل الحفظ
    const user = await User.create({ firstName, lastName, email, password, role });

    // إرسال بيانات المستخدم الجديد كرد للعميل
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// تحديث بيانات مستخدم

// const updateUser = async (req, res) => {
//   try {
//     // البحث عن المستخدم بالـ ID
//     const user = await User.findByPk(req.params.id);
//     if (!user) return res.status(404).json({ message: "User not found" });

//     // جلب البيانات الجديدة من الطلب
//     const { firstName, lastName, email, role } = req.body;

//     // تحديث البيانات
//     await user.update({ firstName, lastName, email, role });

//     // إرسال الرد للعميل مع بيانات المستخدم المحدثة
//     res.json(user);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

const updateUser = async (req, res) => {
  try {
    // جلب بيانات المستخدم من التوكن وليس من req.params.id
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { firstName, lastName, email, password } = req.body;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.email = email || user.email;

    await user.save();

    res.json({ message: "Profile updated successfully", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// حذف مستخدم

const deleteUser = async (req, res) => {
  try {
    // البحث عن المستخدم بالـ ID
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // حذف المستخدم من قاعدة البيانات
    await user.destroy();

    // إرسال رسالة نجاح
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// تصدير الدوال لاستخدامها في الـ Routes
module.exports = { getAllUsers, getUserById, createUser, updateUser, deleteUser };