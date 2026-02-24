const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/jwt");


// Middleware للتحقق من التوكن (Authentication)

const authMiddleware = (req, res, next) => {
  //  جلب الهيدر Authorization من الطلب
  const authHeader = req.headers.authorization;

  //  إذا لم يتم إرسال الهيدر أو لا يبدأ بـ "Bearer "
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    // نرجع خطأ 401 Unauthorized
    return res.status(401).json({ message: "لم يتم إرسال التوكن" });
  }

  //  استخراج التوكن من الهيدر
  const token = authHeader.split(" ")[1];

  try {
    //  التحقق من صحة التوكن باستخدام JWT_SECRET
    const decoded = jwt.verify(token, JWT_SECRET);

    //  إذا كان التوكن صحيح، نضع البيانات المفكوكة في req.user
    // هذه البيانات عادة تحتوي على { id, role }
    req.user = decoded;

    //  الاستمرار إلى الراوت التالي
    next();
  } catch (err) {
    // إذا كان التوكن غير صالح أو منتهي الصلاحية
    res.status(401).json({ message: "توكن غير صالح" });
  }
};


// تصدير middleware للاستخدام في الراوتات المحمية

module.exports = authMiddleware;