
import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import "./MyBookings.css";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchMyBookings = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/api/bookings/my");

      console.log("MY BOOKINGS:", res.data);

      setBookings(Array.isArray(res.data) ? res.data : []);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Failed to load your bookings.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyBookings();
  }, []);

  if (loading) return <div>Loading your bookings...</div>;
  if (error) return <div>{error}</div>;

  if (bookings.length === 0) {
    return (
      <div className="my-bookings">
        <h2>No bookings yet.</h2>
      </div>
    );
  }

  return (
    <div className="my-bookings">
      <h1>My Bookings</h1>

      <div className="my-bookings-list">
        {bookings.map((b) => (
          <div key={b.id} className="my-booking-card">

            {/* عنوان المشروع */}
            <h3>{b.Unit?.Project?.name || "Project"}</h3>

            {/* الوحدة */}
            <div className="mb-row">
              <span className="mb-label">Unit:</span>
              <span>{b.Unit?.number}</span>
            </div>

            {/* حالة الحجز */}
            <div className="mb-row">
              <span className="mb-label">Status:</span>
              <span className={`status-badge status-${b.status}`}>
                {b.status}
              </span>
            </div>

            {/* موعد الزيارة */}
            <div className="mb-row">
              <span className="mb-label">Visit date:</span>
              <span>{new Date(b.visitDate).toLocaleString()}</span>
            </div>

            {/* حالة الدفع */}
            <div className="mb-row">
              <span className="mb-label">Payment status:</span>
              <span className={`pay-badge pay-${b.paymentStatus}`}>
                {b.paymentStatus}
              </span>
            </div>

            {/* العربون */}
            <div className="mb-row">
              <span className="mb-label">Deposit amount:</span>
              <span>{b.depositAmount?.toLocaleString() || 0} AED</span>
            </div>

            {/* الأزرار */}
            <div className="mb-actions">
              <button
                className="mb-btn secondary"
                onClick={() => navigate(`/user/bookings/${b.id}/installments`)}
              >
                View Installments
              </button>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default MyBookings;