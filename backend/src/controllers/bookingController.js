
const Booking = require("../models/booking");
const Unit = require("../models/unit");
const Project = require("../models/project");
const User = require("../models/user");
const Installment = require("../models/installment");


// ➤ إضافة حجز جديد مع دعم الأقساط وإرسال إيميل عند تأكيد الحجز
const addBooking = async (req, res) => {
  try {
    const bookingData = { ...req.body };
    const { installments } = req.body;

    // يجب أن يكون هناك visitDate
    if (!bookingData.visitDate) {
      return res.status(400).json({ message: "visitDate is required" });
    }

    // إذا كان المستخدم مسجل الدخول، نخزن الـ userId
    if (req.user) {

      if (req.user.isBlocked) {
        return res.status(403).json({
          message: "Your account is blocked. You cannot make bookings."
        });
      }
      bookingData.userId = req.user.id;

      // 🔒 منع الحجز إذا كان عنده حجز no_show ولم تنتهِ مدة ١٥ يوم
      const lastBooking = await Booking.findOne({
        where: { userId: req.user.id },
        order: [["createdAt", "DESC"]],
      });

      if (lastBooking && lastBooking.status === "no_show" && lastBooking.rebookAvailableAt) {
        const now = new Date();
        const rebookDate = new Date(lastBooking.rebookAvailableAt);

        if (now < rebookDate) {
          return res.status(403).json({
            message: `You cannot book a new visit until ${rebookDate.toISOString()}`,
          });
        }
      }
    }

    const now = new Date();
    const maxVisitDate = new Date(now.getTime() + 48 * 60 * 60 * 1000);
    const visitDate = new Date(bookingData.visitDate);

    // ❗ التحقق من 48 ساعة
    if (visitDate > maxVisitDate) {
      return res.status(400).json({
        message: "Visit date must be within 48 hours from now",
      });
    }

    // دمج التاريخ + الوقت
    const [hours, minutes] = bookingData.visitTime.split(":").map(Number);
    const visitDateTime = new Date(bookingData.visitDate);
    visitDateTime.setHours(hours, minutes, 0, 0);

    // التحقق من ساعات العمل (10:00 → 18:00)
    const hour = visitDateTime.getHours();
    const minute = visitDateTime.getMinutes();

    if (hour < 10 || hour > 17 || (hour === 17 && minute > 30)) {
      return res.status(400).json({
        message: "Visit time must be between 10 AM and 5:30 PM"
      });
    }
    // // ⏱ مدة الزيارة 30 دقيقة
    const visitEnd = new Date(visitDateTime.getTime() + 30 * 60 * 1000);

    // 🔒 منع الحجز المتداخل لنفس الوحدة
    const existingBooking = await Booking.findOne({
      where: {
        unitId: bookingData.unitId,
        status: ["pending", "approved"],
        visitDate: visitDate,

      }
    });
    // 🔒 منع الحجز إذا كانت الشقة مباعة
    const unit = await Unit.findByPk(bookingData.unitId);

    if (!unit) {
      return res.status(404).json({ message: "Unit not found" });
    }

    if (unit.status === "sold") {
      return res.status(400).json({ message: "This unit is already sold" });
    }

    if (existingBooking) {
      return res.status(400).json({
        message: "This time slot overlaps with an existing booking"
      });
    }

    // إنشاء الحجز
    const booking = await Booking.create(bookingData);

    // إنشاء سجلات الأقساط إذا كانت طريقة الدفع أقساط
    if (
      bookingData.paymentMethod === "installments" &&
      installments &&
      installments.length > 0
    ) {
      const installmentRecords = installments.map((inst, index) => ({
        bookingId: booking.id,
        installmentNumber: index + 1,
        amount: inst.amount,
        dueDate: new Date(inst.dueDate),
        status: "pending",
      }));
      await Installment.bulkCreate(installmentRecords);
    }

    // جلب الحجز مع العلاقات لتوضيح البيانات
    const bookingWithRelations = await Booking.findByPk(booking.id, {
      include: [
        { model: Unit, as: "Unit", include: [{ model: Project, as: "Project" }] },
        { model: User, as: "User" },
        { model: Installment, as: "Installments" },
      ],
    });



    res.status(201).json(bookingWithRelations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};


// تأكيد الحجز

const confirmBooking = async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id, {
      include: [
        { model: User, as: "User" },
        { model: Unit, as: "Unit", include: [{ model: Project, as: "Project" }] }
      ]
    });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    booking.status = "confirmed";
    await booking.save();

    res.json({
      message: "Booking confirmed successfully",
      booking
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// تأكيد الدفع 
const markPaid = async (req, res) => {
  try {
    const { depositAmount, paymentMethod, paymentDate } = req.body;

    const booking = await Booking.findByPk(req.params.id, {
      include: [
        { model: User, as: "User" },
        {
          model: Unit,
          as: "Unit",
          include: [{ model: Project, as: "Project" }]
        }
      ]
    });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // تحديث بيانات الدفع
    booking.depositAmount = depositAmount;
    booking.paymentMethod = paymentMethod;
    booking.paymentDate = paymentDate;
    booking.paymentStatus = "paid";
    // 🔒 تحويل حالة الشقة إلى sold عند الدفع
    await booking.Unit.update({ status: "sold" });

    await booking.save();


    res.json({
      message: "Payment recorded successfully",
      booking
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

//إلغاء حجز ل

const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id, {
      include: [
        { model: User, as: "User" },
        { model: Unit, as: "Unit", include: [{ model: Project, as: "Project" }] }
      ]
    });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // تحديث حالة الحجز والدفع
    booking.status = "cancelled";
    booking.paymentStatus = "failed";
    await booking.save();

    res.json({
      message: "Booking cancelled successfully",
      booking
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ➤ جلب كل الحجوزات (Admin فقط)
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      include: [
        { model: Unit, as: "Unit", include: [{ model: Project, as: "Project" }] },
        { model: User, as: "User" },
        { model: Installment, as: "Installments" },
      ],
      order: [["createdAt", "DESC"]],
    });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ➤ جلب حجوزات المستخدم المسجل الدخول
const getUserBookings = async (req, res) => {
  try {
    const userId = req.user.id;

    const bookings = await Booking.findAll({
      where: { userId },
      include: [
        { model: Unit, as: "Unit", include: [{ model: Project, as: "Project" }] },
        { model: Installment, as: "Installments" },
      ],
      order: [["createdAt", "DESC"]],
    });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }

};
//ابحث عن الحجز بواسطة id
const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id, {
      include: [
        { model: User, as: "User" },
        {
          model: Unit,
          as: "Unit",
          include: [{ model: Project, as: "Project" }]
        },
        { model: Installment, as: "Installments" }
      ]
    });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // 🔒 إذا كان المستخدم ليس أدمن، يجب أن يكون صاحب الحجز
    if (req.user.role !== "admin" && booking.userId !== req.user.id) {
      return res.status(403).json({ message: "Not allowed to view this booking" });
    }

    res.json(booking);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
// ➤ تحديث حجز
const updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id, {
      include: [
        { model: User, as: "User" },
        { model: Installment, as: "Installments" },
      ],
    });
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    // تحديث البيانات المرسلة
    await booking.update(req.body);



    const updatedBooking = await Booking.findByPk(booking.id, {
      include: [
        { model: Unit, as: "Unit", include: [{ model: Project, as: "Project" }] },
        { model: User, as: "User" },
        { model: Installment, as: "Installments" },
      ],
    });

    res.json(updatedBooking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ➤ حذف حجز (Admin فقط)
const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    await booking.destroy();
    res.json({ message: "Booking deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  addBooking,
  cancelBooking,
  getAllBookings,
  getUserBookings,
  updateBooking,
  deleteBooking,
  confirmBooking,
  markPaid,
  getBookingById
};