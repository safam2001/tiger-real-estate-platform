// هذا middleware للتحقق من الدور (Role-based Access Control)
const roleMiddleware = (requiredRole) => {
  return (req, res, next) => {
    // التحقق من أن المستخدم مسجل دخول
    // authMiddleware يجب أن يكون قد نفذ قبل هذا middleware
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    // التحقق إذا كان دور المستخدم يساوي الدور المطلوب
    if (req.user.role !== requiredRole) {
      return res.status(403).json({ 
        message: `Access denied. Required role: ${requiredRole}. Your role: ${req.user.role || 'none'}` 
      });
    }

    // إذا اجتاز التحقق، الانتقال للراوت التالي
    next();
  };
};

// Middlewares جاهزة للاستخدام

// للأدمن فقط
const adminOnly = roleMiddleware("admin");

// للمستخدم العادي فقط
const userOnly = roleMiddleware("user");

// تصدير Middlewares
module.exports = roleMiddleware;
module.exports.adminOnly = adminOnly;
module.exports.userOnly = userOnly;