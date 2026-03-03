
import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/Admin/AdminLayout";
import "./Bookings.css";
import axiosInstance from "../../api/axiosInstance";
import { useNavigate } from "react-router-dom";

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showPayModal, setShowPayModal] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [depositAmount, setDepositAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [paymentDate, setPaymentDate] = useState("");
const navigate=useNavigate()
 
  // جلب كل الحجوزات (Admin فقط)
 
  const fetchBookings = async () => {
    try {
      setLoading(true);

      const res = await axiosInstance.get("/api/bookings");
      setBookings(Array.isArray(res.data) ? res.data : []);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch bookings.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // تأكيد الحجز

  const confirmBooking = async (id) => {
    try {
      await axiosInstance.put(`/api/bookings/${id}/confirm`);

      setBookings((prev) =>
        prev.map((b) =>
          b.id === Number(id) ? { ...b, status: "confirmed" } : b
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  // إلغاء الحجز

  const cancelBooking = async (id) => {
    try {
      await axiosInstance.post(`/api/bookings/${id}/cancel`);

      setBookings((prev) =>
        prev.map((b) =>
          b.id === Number(id)
            ? { ...b, status: "cancelled", paymentStatus: "failed" }
            : b
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  // مودال الدفع (Mark Paid)

  const openPayModal = (id) => {
    setSelectedBookingId(id);
    setShowPayModal(true);
  };

  const submitPayment = async () => {
    try {
      const res = await axiosInstance.put(`/api/bookings/${selectedBookingId}/paid`, {
        depositAmount,
        paymentMethod,
        paymentDate,
      });

      const updatedBooking = res.data.booking;

      setBookings((prev) =>
        prev.map((b) =>
          b.id === updatedBooking.id ? updatedBooking : b
        )
      );

      setShowPayModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  // UI

  if (loading) return <div>Loading bookings...</div>;
  if (error) return <div>{error}</div>;

  return (
    <AdminLayout>
      <div className="admin-bookings">
        <h1>Bookings Management</h1>

        {bookings.length === 0 ? (
          <p>No bookings found.</p>
        ) : (
          <table className="bookings-table">
            <thead>
              <tr>
                <th>#</th>
                <th>User</th>
                <th>Unit / Project</th>
                <th>Visit Date</th>
                <th>Status</th>
                <th>Payment Status</th>
                <th>Deposit</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {bookings.map((b, index) => (
                <tr key={b.id}>
                  <td>{index + 1}</td>

                  {/* اسم المستخدم */}
                  <td>
                    {b.User
                      ? `${b.User.firstName} ${b.User.lastName}`
                      : "N/A"}
                  </td>

                  {/* الوحدة + المشروع */}
                  <td>
                    {b.Unit?.number || "N/A"} /{" "}
                    {b.Unit?.Project?.name || "N/A"}
                  </td>

                  <td>{new Date(b.visitDate).toLocaleString()}</td>

                  <td>{b.status}</td>
                  <td>{b.paymentStatus}</td>

                  {/* الدفعة الأولى */}
                  <td>{b.depositAmount ? `${b.depositAmount} AED` : "—"}</td>

                  <td>
                    {b.status !== "confirmed" && (
                      <button
                        className="confirm-btn"
                        onClick={() => confirmBooking(b.id)}
                      >
                        Confirm
                      </button>
                    )}

                    {b.status !== "cancelled" && (
                      <button
                        className="cancel-btn"
                        onClick={() => cancelBooking(b.id)}
                      >
                        Cancel
                      </button>
                    )}

                    {b.paymentStatus !== "paid" && (
                      <button
                        className="paid-btn"
                        onClick={() => openPayModal(b.id)}
                      >
                        Mark Paid
                      </button>
                    )}

                    <button
                      className="details-btn"
                      onClick={() => navigate(`/admin/bookings/${b.id}`)}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/*  مودال الدفع */}
        {showPayModal && (
          <div className="modal-overlay">
            <div className="modal">
              <h3>Record Payment</h3>

              <label>Deposit Amount</label>
              <input
                type="number"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
              />

              <label>Payment Method</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <option value="cash">Cash</option>
                <option value="bank">Bank Transfer</option>
              </select>

              <label>Payment Date</label>
              <input
                type="date"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
              />

              <button onClick={submitPayment}>Save</button>
              <button onClick={() => setShowPayModal(false)}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Bookings;