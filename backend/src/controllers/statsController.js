
const Project = require("../models/project"); // استدعاء موديل المشاريع
const Unit = require("../models/unit");       // استدعاء موديل الوحدات
const Booking = require("../models/booking"); // استدعاء موديل الحجوزات
const Payment = require("../models/payment"); // استدعاء موديل المدفوعات (أو Installment حسب المشروع)

// ➤ دالة لجلب إحصائيات Dashboard
const getStats = async (req, res) => {
  try {
  
    // 1️⃣ إحصائيات المشاريع والوحدات

    const totalProjects = await Project.count(); // عدد كل المشاريع
    const totalUnits = await Unit.count();       // عدد كل الوحدات
    const availableUnits = await Unit.count({ where: { status: "available" } }); // الوحدات المتاحة
    const bookedUnits = await Unit.count({ where: { status: "booked" } });      // الوحدات المحجوزة
    const soldUnits = await Unit.count({ where: { status: "sold" } });          // الوحدات المباعة

    
    // 2️⃣ إحصائيات الحجوزات
   
    const totalBookings = await Booking.count();                // كل الحجوزات
    const pendingBookings = await Booking.count({ where: { status: "pending" } });   // الحجوزات المعلقة
    const approvedBookings = await Booking.count({ where: { status: "approved" } }); // الحجوزات الموافق عليها

    
    // 3️⃣ إحصائيات المدفوعات
    
    const totalPayments = await Payment.count();                  // عدد كل المدفوعات
    const completedPayments = await Payment.count({ where: { status: "paid" } }); // المدفوعات المكتملة (مدفوعة)
    const pendingPayments = await Payment.count({ where: { status: "pending" } }); // المدفوعات المعلقة


    // 4️⃣ حساب إجمالي الإيرادات من المدفوعات المكتملة
  
    const [result] = await Payment.sequelize.query(
      'SELECT SUM(amount) as sum FROM "Payments" WHERE status = \'paid\'', 
      { type: Payment.sequelize.QueryTypes.SELECT }
    );
    const totalRevenue = result.sum || 0; // إذا لم يوجد أي مبلغ، نعتبره صفر

   
    // 5️⃣ إرسال البيانات بصيغة JSON
   
    res.json({
      projects: { total: totalProjects }, // عدد المشاريع
      units: { 
        total: totalUnits, 
        available: availableUnits, 
        booked: bookedUnits, 
        sold: soldUnits 
      },
      bookings: { 
        total: totalBookings, 
        pending: pendingBookings, 
        approved: approvedBookings 
      },
      payments: { 
        total: totalPayments, 
        completed: completedPayments, 
        pending: pendingPayments,
        revenue: totalRevenue // إجمالي الإيرادات
      }
    });

  } catch (err) {
    // في حال حدوث خطأ، نرجع رسالة خطأ 500
    res.status(500).json({ message: err.message });
  }
};

// ➤ تصدير الدالة لاستخدامها في الراوتات
module.exports = { getStats };