
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "../../components/Admin/AdminLayout";
import axiosInstance from "../../api/axiosInstance";
import "./BookingDetails.css";

const BookingDetails = () => {
    const { id } = useParams();
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchBooking = async () => {
        try {
            const res = await axiosInstance.get(`/api/bookings/${id}`);
            setBooking(res.data);
            console.log("BOOKING DATA:", res.data)
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBooking();
    }, []);

    if (loading) return <div>Loading booking...</div>;
    if (!booking) return <div>Booking not found.</div>;

    return (
        <AdminLayout>
            <div className="booking-details-page">
                <h1>Booking Details</h1>

                {/* معلومات الحجز */}
                <div className="details-card-page">
                    <h3>Booking Information</h3>

                    <div className="details-grid">
                        <p><strong>User:</strong> {booking.User?.firstName} {booking.User?.lastName}</p>
                        <p><strong>Unit:</strong> {booking.Unit?.number}</p>
                        <p><strong>Project:</strong> {booking.Unit?.Project?.name}</p>
                        <p><strong>Visit Date:</strong> {new Date(booking.visitDate).toLocaleString()}</p>
                        <p><strong>Status:</strong> {booking.status}</p>
                        <p><strong>Payment Status:</strong> {booking.paymentStatus}</p>
                        <p><strong>Deposit:</strong> {booking.depositAmount?.toLocaleString() || "No deposit"} AED</p>
                    </div>
                </div>

                {/* زر إنشاء خطة الأقساط */}
                <button
                    className="installment-btn-page"
                    onClick={() => navigate(`/admin/bookings/${id}/installments/create`)}
                >
                    Create Installment Plan
                </button>

                {/* جدول الأقساط — يظهر فقط إذا توجد خطة */}
                {Array.isArray(booking.Installments) && booking.Installments.length > 0 && (
                    <div className="installments-section">
                        <h3>Installment Plan</h3>

                        <table >
                            <thead>
                                <tr >
                                    <th>#</th>
                                    <th>Type</th>
                                    <th>Amount</th>
                                    <th>Due Date</th>
                                    <th>Status</th>
                                </tr>
                            </thead>

                            <tbody>
                                {booking.Installments.map((ins) => {
                                    const isOverdue =
                                        ins.status === "pending" &&
                                        new Date(ins.dueDate) < new Date();

                                    return (
                                        <tr key={ins.id} className={isOverdue ? "overdue-row" : ""}>
                                            <td>{ins.installmentNumber}</td>
                                            <td>{ins.type}</td>
                                            <td>{ins.amount.toLocaleString()} AED</td>
                                            <td>{new Date(ins.dueDate).toLocaleDateString()}</td>
                                            {/* <td>{isOverdue ? "Overdue" : ins.status}</td> */}
                                            <td className={`status-cell ${isOverdue ? "overdue" : ins.status}`}>
                                                {isOverdue ? "Overdue" : ins.status}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default BookingDetails;