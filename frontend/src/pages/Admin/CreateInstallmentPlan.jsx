
import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "../../components/Admin/AdminLayout";
import axiosInstance from "../../api/axiosInstance";
import "./CreateInstallmentPlan.css";

const CreateInstallmentPlan = () => {
    const { id } = useParams(); // bookingId
    const navigate = useNavigate();

    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);

    // form state
    const [firstPayment, setFirstPayment] = useState(0);
    const [numberOfInstallments, setNumberOfInstallments] = useState(6);
    const [startDate, setStartDate] = useState("");
    const [notes, setNotes] = useState("");

    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    // 1) جلب بيانات الحجز
    const fetchBooking = async () => {
        try {
            const res = await axiosInstance.get(`/api/bookings/${id}`);
            setBooking(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setError("Failed to load booking.");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBooking();
    }, []);

    // نفترض أن سعر الوحدة موجود في booking.Unit.price أو booking.totalPrice
    const unitPrice = useMemo(() => {
        if (!booking) return 0;
        return booking.Unit?.price || booking.totalPrice || 0;
    }, [booking]);

    // الديبوزيت الصحيح من الباك إند
    const deposit = useMemo(() => {
        if (!booking) return 0;
        return booking.depositAmount || 0;
    }, [booking]);

    // المبلغ المتبقي بعد الديبوزيت + الدفعة الأولى (اختيارية)
    const remainingAmount = useMemo(() => {
        return Math.max(unitPrice - deposit - Number(firstPayment || 0), 0);
    }, [unitPrice, deposit, firstPayment]);

    const amountPerInstallment = useMemo(() => {
        if (!numberOfInstallments || numberOfInstallments <= 0) return 0;
        return remainingAmount / Number(numberOfInstallments);
    }, [remainingAmount, numberOfInstallments]);

    // جدول معاينة الأقساط (ديبوزيت + شهري)
    const schedulePreview = useMemo(() => {
        const rows = [];
        let installmentNumber = 1;

        // سطر الديبوزيت
        if (deposit > 0) {
            rows.push({
                installmentNumber: installmentNumber++,
                label: "Deposit",
                amount: deposit,
                dueDate: new Date().toLocaleDateString(),
                status: "paid",
            });
        }

        // سطر الدفعة الأولى (اختيارية) – فقط معاينة، ليست محفوظة كقسط مستقل الآن
        if (firstPayment && Number(firstPayment) > 0) {
            rows.push({
                installmentNumber: installmentNumber++,
                label: "First Payment",
                amount: Number(firstPayment),
                dueDate: startDate ? new Date(startDate).toLocaleDateString() : "-",
                status: "planned",
            });
        }

        // الأقساط الشهرية
        if (!startDate || !numberOfInstallments || amountPerInstallment <= 0) {
            return rows;
        }

        let currentDate = new Date(startDate);

        for (let i = 0; i < Number(numberOfInstallments); i++) {
            rows.push({
                installmentNumber: installmentNumber++,
                label: `Installment ${i + 1}`,
                amount: Number(amountPerInstallment.toFixed(2)),
                dueDate: new Date(currentDate).toLocaleDateString(),
                status: "pending",
            });
            currentDate.setMonth(currentDate.getMonth() + 1);
        }

        return rows;
    }, [deposit, firstPayment, startDate, numberOfInstallments, amountPerInstallment]);

    // 2) إرسال خطة الأقساط للباك إند
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccessMsg("");

        if (!startDate) {
            setError("Please select start date.");
            return;
        }

        if (!numberOfInstallments || numberOfInstallments <= 0) {
            setError("Number of installments must be greater than 0.");
            return;
        }

        if (amountPerInstallment <= 0) {
            setError("Installment amount must be greater than 0.");
            return;
        }

        try {
            setSubmitting(true);

            await axiosInstance.post(`/api/installments/${id}/create-plan`, {
                numberOfInstallments: Number(numberOfInstallments),
                amountPerInstallment: Number(amountPerInstallment.toFixed(2)),
                startDate,
                notes,
                depositAmount: booking.depositAmount || 0, // 🔥 مهم جداً
            });

            setSuccessMsg("Installment plan created successfully.");
            setSubmitting(false);

            // رجوع لصفحة تفاصيل الحجز بعد ثواني
            setTimeout(() => {
                navigate(`/admin/bookings/${id}`);
            }, 1200);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Failed to create installment plan.");
            setSubmitting(false);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (!booking) return <div>Booking not found.</div>;

    const user = booking.User;
    const unit = booking.Unit;
    const project = unit?.Project;

    return (
        <AdminLayout>
            <div className="installment-page">
                <button
                    onClick={() => navigate(`/admin/bookings/${id}`)}
                    className="back-btn"
                >
                    ← Back to Booking Details
                </button>
                <h1>Create Installment Plan</h1>

                {/* رسائل */}
                {error && <div className="alert alert-error">{error}</div>}
                {successMsg && <div className="alert alert-success">{successMsg}</div>}

                {/* 1) معلومات الشخص والحجز */}
                <div className="card-section">
                    <h3>Booking & User Information</h3>
                    <div className="info-grid">
                        <p><strong>User:</strong> {user?.firstName} {user?.lastName}</p>
                        <p><strong>Email:</strong> {user?.email}</p>
                        <p><strong>Phone:</strong> {user?.phone || "—"}</p>
                        <p><strong>Project:</strong> {project?.name}</p>
                        <p><strong>Unit:</strong> {unit?.number}</p>
                        <p><strong>Status:</strong> {booking.status}</p>
                    </div>
                </div>

                {/* 2) ملخص الدفع */}
                <div className="card-section">
                    <h3>Payment Summary</h3>
                    <div className="info-grid">
                        <p><strong>Unit Price:</strong> {unitPrice.toLocaleString()} AED</p>
                        <p><strong>Deposit Paid:</strong> {deposit.toLocaleString()} AED</p>
                        <p><strong>First Payment (this plan):</strong> {Number(firstPayment || 0).toLocaleString()} AED</p>
                        <p><strong>Remaining After First Payment:</strong> {remainingAmount.toLocaleString()} AED</p>
                        <p><strong>Payment Status:</strong> {booking.paymentStatus}</p>
                    </div>
                </div>

                {/* 3) نموذج إنشاء خطة الأقساط */}
                <div className="card-section">
                    <h3>Create Installment Plan</h3>
                    <form onSubmit={handleSubmit} className="installment-form">
                        <div className="form-row">
                            <div className="form-group">
                                <label>First Payment (optional)</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={firstPayment}
                                    onChange={(e) => setFirstPayment(e.target.value)}
                                    placeholder="Enter first payment amount"
                                />
                            </div>

                            <div className="form-group">
                                <label>Number of Installments (months)</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={numberOfInstallments}
                                    onChange={(e) => setNumberOfInstallments(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Start Date</label>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group full-width">
                                <label>Notes</label>
                                <textarea
                                    rows="3"
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Any notes about this plan..."
                                />
                            </div>
                        </div>

                        {/* Preview Summary */}
                        <div className="preview-box">
                            <h4>Installment Preview</h4>
                            <p><strong>Remaining Amount:</strong> {remainingAmount.toLocaleString()} AED</p>
                            <p><strong>Installments:</strong> {numberOfInstallments} months</p>
                            <p><strong>Amount per Installment:</strong> {amountPerInstallment.toFixed(2)} AED</p>
                        </div>

                        {/* جدول معاينة الأقساط */}
                        <div className="preview-table-wrapper">
                            <h4>Schedule Preview</h4>
                            {schedulePreview.length === 0 ? (
                                <p>No schedule yet. Please select start date and installments.</p>
                            ) : (
                                <table className="preview-table">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Label</th>
                                            <th>Amount (AED)</th>
                                            <th>Due Date</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {schedulePreview.map((row) => (
                                            <tr key={row.installmentNumber}>
                                                <td>{row.installmentNumber}</td>
                                                <td>{row.label}</td>
                                                <td>{row.amount.toLocaleString()}</td>
                                                <td>{row.dueDate}</td>
                                                <td>{row.status}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="btn-primary"
                            disabled={submitting}
                        >
                            {submitting ? "Creating..." : "Create Plan"}
                        </button>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
};

export default CreateInstallmentPlan;