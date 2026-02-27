
const Payment = require("../models/payment");
const Booking = require("../models/booking");
const Installment = require("../models/installment");
const User = require("../models/user");
const Unit = require("../models/unit");
const Project = require("../models/project")


// 1) إنشاء دفعة (غير مستخدم لصفحة الدفع)

const createPayment = async (req, res) => {
  try {
    const { bookingId, amount, method, type, installmentNumber } = req.body;

    const booking = await Booking.findByPk(bookingId);
    if (!booking) {
      return res.status(400).json({ message: "Booking not found" });
    }

    const payment = await Payment.create({
      bookingId,
      amount,
      method,
      type,
      installmentNumber: installmentNumber || null,
      status: "pending"
    });

    res.status(201).json(payment);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const confirmPayment = async (req, res) => {
  try {
    const { bookingId, installmentId, amount, method } = req.body;

    if (!bookingId || !installmentId || !amount || !method) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const booking = await Booking.findByPk(bookingId);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    const installment = await Installment.findByPk(installmentId);
    if (!installment) return res.status(404).json({ message: "Installment not found" });

    if (!installment.amount || isNaN(Number(installment.amount))) {
      return res.status(400).json({ message: "Installment amount is invalid" });
    }

    if (Math.abs(Number(amount) - Number(installment.amount)) > 0.01) {
      return res.status(400).json({ message: "Invalid amount. Must match installment amount." });
    }

    let receiptUrl = null;
    if (req.file) {
      receiptUrl = `/uploads/${req.file.filename}`;
    }

    const payment = await Payment.create({
      bookingId,
      installmentId,
      amount: Number(amount),
      method,
      status: "pending",
      paidAt: null,
      receiptUrl
    });



    installment.status = "pending";
    installment.paidAt = null;
    await installment.save();

    return res.json({
      message: "Payment confirmed successfully",
      payment
    });

  } catch (err) {
    console.error("Payment Error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getAllPayments = async (req, res) => {
  try {

    const payments = await Payment.findAll({
      include: [
        {
          model: Booking,
          as: "Booking",
          include: [
            {
              model: User,
              as: "User"
            },
            {
              model: Unit,
              as: "Unit",
              include: [
                {
                  model: Project,
                  as: "Project"
                }
              ]
            }
          ]
        }
      ],
      order: [["createdAt", "DESC"]]
    });

    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// ///////////////////////////////////////////
const approvePayment = async (req, res) => {
  try {
    const payment = await Payment.findByPk(req.params.paymentId);
    if (!payment) return res.status(404).json({ message: "Payment not found" });

    payment.status = "paid";
    payment.paidAt = new Date();
    await payment.save();

    const installment = await Installment.findByPk(payment.installmentId);
    installment.status = "paid";
    installment.paidAt = new Date();
    await installment.save();

    res.json({ message: "Payment approved successfully" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
module.exports = {
  createPayment,
  confirmPayment,
  getAllPayments,
  approvePayment
};