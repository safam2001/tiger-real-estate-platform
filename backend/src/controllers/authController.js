
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// استيراد إعدادات JWT من ملف config منفصل
const { JWT_SECRET, JWT_EXPIRES_IN } = require("../config/jwt");


// Register - تسجيل مستخدم جديد
const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;

    // التحقق من وجود جميع الحقول المطلوبة
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // التحقق من وجود مستخدم بنفس البريد الإلكتروني
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // إنشاء المستخدم مع كلمة المرور المشفرة
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      role: ["user", "admin"].includes(role) ? role : "user" // إذا لم يحدد الدور، يكون user
    });

    // إنشاء JWT Token بعد التسجيل مباشرة
    const token = jwt.sign(
      { id: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // إرسال الرد للعميل مع بيانات المستخدم والتوكن
    res.status(201).json({
      success: true,
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Login - تسجيل الدخول

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // التحقق من وجود البريد الإلكتروني وكلمة المرور
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // البحث عن المستخدم عبر البريد الإلكتروني
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // مقارنة كلمة المرور المدخلة مع المخزنة
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // إرسال الرد للعميل مع بيانات المستخدم والتوكن
    res.status(200).json({
      success: true,
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};


module.exports = { register, login };