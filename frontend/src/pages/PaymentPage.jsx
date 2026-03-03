
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import "./PaymentPage.css";

const PaymentPage = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // bookingId

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showBank, setShowBank] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState("bank-transfer");
  const [receiptFile, setReceiptFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // قراءة installmentId من الـ URL
  const query = new URLSearchParams(window.location.search);
  const installmentId = query.get("installmentId");

  // جلب بيانات الحجز
  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await axiosInstance.get(`/api/bookings/${id}`);
        setBooking(res.data);
      } catch (err) {
        console.error(err);
        alert("Failed to load booking data.");
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [id]);

  if (loading) {
    return (
      <div className="tiger-payment-page tiger-payment-page--center">
        Loading payment details...
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="tiger-payment-page tiger-payment-page--center">
        Booking not found.
      </div>
    );
  }

  const installments = booking.Installments || [];

  // تحديد القسط الذي اختاره المستخدم
  const selectedInstallment = installments.find(
    (i) => i.id == installmentId
  );

  if (!selectedInstallment) {
    return (
      <div className="tiger-payment-page tiger-payment-page--center">
        Invalid installment selected.
      </div>
    );
  }

  // حساب المبلغ الصحيح
  const amountDueNow = selectedInstallment.amount;
  const overdueAmount =
    selectedInstallment.status === "overdue" ? selectedInstallment.amount : 0;

  const nextInstallment =
    installments.find((i) => i.status === "pending" && i.id != installmentId)
      ?.dueDate || "No upcoming installments";

  // رفع إيصال التحويل
  const handleReceiptChange = (e) => {
    setReceiptFile(e.target.files[0]);
  };

  // الدفع بالبطاقة
  const handleCardPayment = () => {
    alert("Redirecting to secure card payment gateway...");
  };

  // تأكيد الدفع
  const handleConfirmPayment = async () => {
    if (!selectedMethod) {
      alert("Please select a payment method.");
      return;
    }

    if (selectedMethod === "bank-transfer" && !receiptFile) {
      alert("Please upload the bank transfer receipt.");
      return;
    }

    try {
      setSubmitting(true);

      const formData = new FormData();
      formData.append("bookingId", id);
      formData.append("installmentId", installmentId);
      formData.append("amount", amountDueNow);
      formData.append("method", selectedMethod);

      if (receiptFile) {
        formData.append("receipt", receiptFile);
      }

      await axiosInstance.post("/api/payments/confirm", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Payment submitted successfully!");
      navigate(`/user/bookings/${id}`);
    } catch (err) {
      console.error(err);
      alert("Failed to submit payment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="tiger-payment-page">
      <button className="tiger-payment-page__back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <h1>Payment Page</h1>

      {/* Payment Summary */}
      <div className="tiger-payment-summary">
        <h2>Payment Summary</h2>
        <p><strong>Amount Due Now:</strong> {amountDueNow} AED</p>
        <p><strong>Overdue Amount:</strong> {overdueAmount} AED</p>
        <p><strong>Next Installment:</strong> {nextInstallment}</p>
        <p><strong>Booking ID:</strong> {booking.id || id}</p>
        <p><strong>Installment ID:</strong> {installmentId}</p>
      </div>

      {/* Payment Methods */}
      <div className="tiger-payment-methods">
        <h2>Select Payment Method</h2>

        {/* Bank Transfer */}
        <div
          className={
            "tiger-method-box" +
            (selectedMethod === "bank-transfer" ? " tiger-method-box--active" : "")
          }
          onClick={() => setSelectedMethod("bank-transfer")}
        >
          <div className="tiger-method-box__header">
            <h3>Bank Transfer (Recommended)</h3>
            <span className="tiger-method-box__tag">Secure</span>
          </div>

          <button
            className="tiger-method-btn"
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowBank(!showBank);
            }}
          >
            {showBank ? "Hide Bank Details" : "Show Bank Details"}
          </button>

          {showBank && (
            <div className="tiger-bank-details">
              <p><strong>Bank Name:</strong> Emirates NBD</p>
              <p><strong>Account Name:</strong> Tiger Real Estate</p>
              <p><strong>IBAN:</strong> AE00 0000 0000 0000 0000 000</p>
              <p><strong>Swift Code:</strong> EBILAEAD</p>
              <p className="tiger-bank-details__note">
                Please transfer the exact amount and upload the payment receipt below.
              </p>
            </div>
          )}

          <div className="tiger-upload-box">
            <label className="tiger-upload-label">
              Upload Transfer Receipt
              <input type="file" onChange={handleReceiptChange} />
            </label>
            {receiptFile && (
              <p className="tiger-upload-file">Selected: {receiptFile.name}</p>
            )}
          </div>
        </div>

        {/* Credit / Debit Card */}
        <div
          className={
            "tiger-method-box" +
            (selectedMethod === "card" ? " tiger-method-box--active" : "")
          }
          onClick={() => setSelectedMethod("card")}
        >
          <div className="tiger-method-box__header">
            <h3>Credit / Debit Card</h3>
            <span className="tiger-method-box__tag tiger-method-box__tag--alt">
              Online
            </span>
          </div>

          <button
            className="tiger-method-btn"
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleCardPayment();
            }}
          >
            Pay with Card
          </button>
        </div>
      </div>

      {/* Confirm Payment */}
      <button
        className="tiger-confirm-btn"
        onClick={handleConfirmPayment}
        disabled={submitting}
      >
        {submitting ? "Processing..." : "Confirm Payment"}
      </button>
    </div>
  );
};

export default PaymentPage;