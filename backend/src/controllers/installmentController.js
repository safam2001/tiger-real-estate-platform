
const Installment = require("../models/installment");
const Booking = require("../models/booking");

// 1) إنشاء خطة الأقساط (نسخة نهائية وصحيحة)
const createInstallmentPlan = async (req, res) => {
    try {
        const {
            numberOfInstallments,
            amountPerInstallment,
            startDate,
            notes,
            depositAmount
        } = req.body;

        const bookingId = req.params.id;

        const booking = await Booking.findByPk(bookingId);

        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        // حذف أي خطة أقساط قديمة قبل إنشاء خطة جديدة
        await Installment.destroy({ where: { bookingId } });

        const installments = [];
        let installmentNumber = 1;


        // 1) أول دفعة = الديبوزيت (مدفوعة)

        if (depositAmount && depositAmount > 0) {
            installments.push({
                bookingId,
                installmentNumber: installmentNumber++,
                amount: depositAmount,
                dueDate: new Date(),
                status: "paid",
                type: "deposit",
                notes: "Initial deposit"
            });
        }


        // 2) إنشاء الأقساط الشهرية

        let currentDate = new Date(startDate);

        for (let i = 0; i < numberOfInstallments; i++) {
            installments.push({
                bookingId,
                installmentNumber: installmentNumber++,
                amount: amountPerInstallment,
                dueDate: new Date(currentDate),
                status: "pending",
                type: "installment",
                notes: notes || null
            });

            currentDate.setMonth(currentDate.getMonth() + 1);
        }


        // 3) حفظ الأقساط دفعة واحدة

        await Installment.bulkCreate(installments);

        res.json({
            message: "Installment plan created successfully",
            installments
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};


// 2) جلب أقساط حجز معيّن

const getInstallmentsByBooking = async (req, res) => {
    try {
        const bookingId = req.params.id;

        const installments = await Installment.findAll({
            where: { bookingId },
            order: [["installmentNumber", "ASC"]]
        });

        res.json(installments);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


// 3) دفع قسط معيّن

const payInstallment = async (req, res) => {
    try {
        const installmentId = req.params.id;
        const { paymentMethod } = req.body;

        const inst = await Installment.findByPk(installmentId);

        if (!inst) {
            return res.status(404).json({ message: "Installment not found" });
        }
        inst.status = "pending";
        inst.paymentMethod = paymentMethod;
        inst.receiptUrl = req.body.receiptUrl; // رابط الإيصال
        await inst.save();

        res.json({
            message: "Installment marked as paid",
            installment: inst
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }

   
};
    const confirmInstallment = async (req, res) => {
    try {
        const installmentId = req.params.id;

        const inst = await Installment.findByPk(installmentId);

        if (!inst) {
            return res.status(404).json({ message: "Installment not found" });
        }

        inst.status = "paid";
        inst.paidDate = new Date();

        await inst.save();

        res.json({
            message: "Installment confirmed successfully",
            installment: inst
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    createInstallmentPlan,
    getInstallmentsByBooking,
    payInstallment,
    confirmInstallment
}