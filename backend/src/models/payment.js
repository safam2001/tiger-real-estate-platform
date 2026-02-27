
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Booking = require("./booking");
const Installment = require("./installment");

// نموذج الدفع Payment
const Payment = sequelize.define("Payment", {

  // ربط الدفع بالحجز
  bookingId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  // إذا كان الدفع مرتبط بقسط معين
  installmentId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },

  // قيمة الدفع
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false
  },

  // العملة
  currency: {
    type: DataTypes.STRING,
    defaultValue: "USD"
  },

  // طريقة الدفع (بطاقة، تحويل، نقدي...)
  method: {
    type: DataTypes.STRING,
    allowNull: true
  },

  // حالة الدفع: pending = بانتظار، paid = تم الدفع، failed = فشل
  status: {
    type: DataTypes.ENUM("pending", "paid", "failed"),
    defaultValue: "pending"
  },

  // تاريخ الدفع الفعلي
  paidAt: {
    type: DataTypes.DATE,
    allowNull: true
  },

  // رابط إيصال الدفع (PDF أو صورة)
  receiptUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },

  // ملاحظات إضافية
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }

}, {
  timestamps: true // لإنشاء createdAt و updatedAt تلقائياً
});


// العلاقات مع Booking و Installment


// كل حجز يمكن أن يكون له عدة مدفوعات
Booking.hasMany(Payment, { foreignKey: "bookingId", onDelete: "CASCADE", as: "Payments" });
Payment.belongsTo(Booking, { foreignKey: "bookingId", as: "Booking" });

// كل قسط يمكن أن يكون مرتبط بدفع محدد
Installment.hasOne(Payment, { foreignKey: "installmentId", as: "Payment" });
Payment.belongsTo(Installment, { foreignKey: "installmentId", as: "Installment" });

module.exports = Payment;