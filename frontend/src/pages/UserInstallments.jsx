import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import "./UserInstallments.css";

const UserInstallments = () => {
    const { id } = useParams();
    const [installments, setInstallments] = useState([]);
    const navigate = useNavigate()
    useEffect(() => {
        axiosInstance.get(`/api/bookings/${id}`).then((res) => {
            console.log("user booking:", res.data)
            setInstallments(res.data.Installments || []);
        });
    }, []);

    return (
        <div className="user-installments">
            <button
                className="back-btn"
                onClick={() => navigate("/mybookings")}
            >
                ← Back to My Bookings
            </button>
            <h1>Installment Plan</h1>

            {installments.some(i => i.status === "pending" || i.status === "overdue") && (
                <button
                    className="pay-btn"
                    onClick={() => {
                        const next = installments.find(i => i.status === "pending" || i.status === "overdue");
                        navigate(`/user/bookings/${id}/payment?installmentId=${next.id}`);
                    }}
                >
                    Pay Now
                </button>
            )}


            <table className="installments-table-user">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Type</th>
                        <th>Amount</th>
                        <th>Due Date</th>
                        <th>Status</th>
                    </tr>
                </thead>

                <tbody>
                    {installments.map((ins) => {
                        const isOverdue =
                            ins.status === "pending" &&
                            new Date(ins.dueDate) < new Date();

                        return (
                            <tr key={ins.id} className={isOverdue ? "overdue-row" : ""}>
                                <td>{ins.installmentNumber}</td>
                                <td>{ins.type}</td>
                                <td>{ins.amount.toLocaleString()} AED</td>
                                <td>{new Date(ins.dueDate).toLocaleDateString()}</td>
                                <td className={`status-cell ${isOverdue ? "overdue" : ins.status}`}>
                                    {isOverdue ? "Overdue" : ins.status}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default UserInstallments;