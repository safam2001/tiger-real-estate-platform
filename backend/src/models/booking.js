
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./user"); // استدعاء موديل المستخدم
const Unit = require("./unit"); // استدعاء موديل الوحدة
const Installment = require("./installment"); // استدعاء موديل الأقساط

// تعريف موديل الحجز
const Booking = sequelize.define("Booking", {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  unitId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  visitDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM(
      "pending",
      "approved",
      "visited",
      "no_show",
      "cancelled",
      "expired",
      "confirmed"
    ),
    defaultValue: "pending"
  },
  expiresAt: {
    type: DataTypes.DATE
  },
  rebookAvailableAt: {
    type: DataTypes.DATE
  },
  depositAmount: {
    type: DataTypes.FLOAT
  },
  paymentStatus: {
    type: DataTypes.ENUM("pending", "paid", "failed"),
    defaultValue: "pending"
  },
  paymentMethod: {
  type: DataTypes.STRING,
  allowNull: true
},

paymentDate: {
  type: DataTypes.DATE,
  allowNull: true
},
  paymentExpiresAt: {
    type: DataTypes.DATE
  },
  reminderSent: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  paidAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  receiptUrl: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  timestamps: true,
  indexes: [
    { fields: ["userId"] },
    { fields: ["unitId"] }
  ]
});

Booking.beforeUpdate((booking) => {
  if (booking.changed("status") && booking.status === "no_show") {
    const now = new Date();
    booking.rebookAvailableAt = new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000);
  }
});

// العلاقات
Booking.belongsTo(User, { foreignKey: "userId", as: "User" }); 


Booking.belongsTo(Unit, { foreignKey: "unitId", as: "Unit" });
Unit.hasMany(Booking, { foreignKey: "unitId", as: "Bookings" });
// علاقة الحجز بالأقساط
Booking.hasMany(Installment, { foreignKey: "bookingId", as: "Installments" });

module.exports = Booking;