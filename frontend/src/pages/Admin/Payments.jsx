
import React, { useState, useEffect, useMemo } from "react";
import axiosInstance from "../../api/axiosInstance";
import AdminLayout from "../../components/Admin/AdminLayout";
import "./Payments.css";

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [methodFilter, setMethodFilter] = useState("");
  const [search, setSearch] = useState("");
             
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await axiosInstance.get("/api/payments");
        setPayments(res.data || []);
      } catch (err) {
        console.error("Error fetching payments:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);
          // ////////////////
  const approvePayment = async (id) => {
  try {
    await axiosInstance.put(`/api/payments/approve/${id}`);
    alert("Payment approved!");
    window.location.reload();
  } catch (err) {
    console.error(err);
    alert("Error approving payment");
  }
};
  // ====== Aggregated stats ======
  const stats = useMemo(() => {
    if (!payments.length) {
      return {
        totalCount: 0,
        totalPaidAmount: 0,
        totalPendingAmount: 0,
        totalFailedAmount: 0,
        byMethod: {},
        byStatus: {},
      };
    }

    let totalPaidAmount = 0;
    let totalPendingAmount = 0;
    let totalFailedAmount = 0;
    const byMethod = {};
    const byStatus = {};

    payments.forEach((p) => {
      const amount = Number(p.amount) || 0;

      // by status
      byStatus[p.status] = (byStatus[p.status] || 0) + 1;

      if (p.status === "paid") totalPaidAmount += amount;
      else if (p.status === "pending") totalPendingAmount += amount;
      else if (p.status === "failed") totalFailedAmount += amount;

      // by method
      byMethod[p.method] = (byMethod[p.method] || 0) + amount;
    });

    return {
      totalCount: payments.length,
      totalPaidAmount,
      totalPendingAmount,
      totalFailedAmount,
      byMethod,
      byStatus,
    };
  }, [payments]);

  // ====== Filtering ======
  const filteredPayments = useMemo(() => {
    return payments.filter((p) => {
     const userName = p.Booking?.User
      ? `${p.Booking.User.firstName} ${p.Booking.User.lastName}`.toLowerCase()
      : "unknown user";

      const matchesSearch = userName
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesStatus = statusFilter ? p.status === statusFilter : true;
      const matchesMethod = methodFilter ? p.method === methodFilter : true;

      return matchesSearch && matchesStatus && matchesMethod;
    });
  }, [payments, search, statusFilter, methodFilter]);

  if (loading) {
    return (
      <AdminLayout>
        <div className="payments-page__loading">Loading payments...</div>
      </AdminLayout>
    );
  }
 
  return (
    <AdminLayout>
      <div className="payments-page">
        {/* ===== Header ===== */}
        <div className="payments-page__header">
          <h1 className="payments-page__title">Payments Overview</h1>
          <p className="payments-page__subtitle">
            Track all payments, methods, and statuses across the platform.
          </p>
        </div>

        {/* ===== Top Stats Cards ===== */}
        <div className="payments-stats">
          <div className="payments-stats__card">
            <span className="payments-stats__label">Total Payments</span>
            <span className="payments-stats__value">
              {stats.totalCount}
            </span>
          </div>

          <div className="payments-stats__card payments-stats__card--paid">
            <span className="payments-stats__label">Total Paid Amount</span>
            <span className="payments-stats__value">
              {stats.totalPaidAmount.toLocaleString()} AED
            </span>
          </div>

          <div className="payments-stats__card payments-stats__card--pending">
            <span className="payments-stats__label">Pending Amount</span>
            <span className="payments-stats__value">
              {stats.totalPendingAmount.toLocaleString()} AED
            </span>
          </div>

          <div className="payments-stats__card payments-stats__card--failed">
            <span className="payments-stats__label">Failed Amount</span>
            <span className="payments-stats__value">
              {stats.totalFailedAmount.toLocaleString()} AED
            </span>
          </div>
        </div>

        {/* ===== Simple “Chart” by Method ===== */}
        <div className="payments-charts">
          <div className="payments-charts__card">
            <h2 className="payments-charts__title">Amount by Method</h2>
            <div className="payments-charts__bars">
              {Object.entries(stats.byMethod).map(([method, amount]) => {
                const max = Math.max(...Object.values(stats.byMethod));
                const width = max ? (amount / max) * 100 : 0;
                return (
                  <div
                    key={method}
                    className="payments-charts__bar-row"
                  >
                    <span className="payments-charts__bar-label">
                      {method}
                    </span>
                    <div className="payments-charts__bar-track">
                      <div
                        className="payments-charts__bar-fill"
                        style={{ width: `${width}%` }}
                      />
                    </div>
                    <span className="payments-charts__bar-value">
                      {amount.toLocaleString()} AED
                    </span>
                  </div>
                );
              })}
              {!Object.keys(stats.byMethod).length && (
                <p className="payments-charts__empty">
                  No payment data available yet.
                </p>
              )}
            </div>
          </div>

          <div className="payments-charts__card">
            <h2 className="payments-charts__title">Payments by Status</h2>
            <ul className="payments-charts__status-list">
              {Object.entries(stats.byStatus).map(([status, count]) => (
                <li
                  key={status}
                  className={`payments-charts__status-item payments-charts__status-item--${status}`}
                >
                  <span className="payments-charts__status-label">
                    {status}
                  </span>
                  <span className="payments-charts__status-value">
                    {count}
                  </span>
                </li>
              ))}
              {!Object.keys(stats.byStatus).length && (
                <p className="payments-charts__empty">
                  No payments recorded yet.
                </p>
              )}
            </ul>
          </div>
        </div>

        {/* ===== Filters ===== */}
        <div className="payments-filters">
          <input
            type="text"
            placeholder="Search by user..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>

          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
          >
            <option value="">All Methods</option>
            <option value="bank-transfer">Bank Transfer</option>
            <option value="credit-card">Credit Card</option>
            <option value="cash">Cash</option>
          </select>
        </div>

        {/* ===== Table ===== */}
        <div className="payments-table-container">
          <table className="payments-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>User</th>
                <th>Project / Unit</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Status</th>
                <th>Paid At</th>
                <th>Receipt</th>
              </tr>
            </thead>


            <tbody>
              {filteredPayments.map((p) => {
                const userName = p.Booking?.User
                  ? `${p.Booking.User.firstName} ${p.Booking.User.lastName}`.trim()
                  : "Unknown User";

                const projectName =
                  p.Booking?.Unit?.Project?.name || "Unknown Project";

                const unitName =
                  p.Booking?.Unit?.number || "Unknown Unit";

                return (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td>{userName}</td>
                    <td>
                      {projectName}
                      {unitName ? ` – ${unitName}` : ""}
                    </td>
                    <td>{Number(p.amount).toLocaleString()} AED</td>
                    <td>{p.method}</td>
                    <td>
                      <span className={`payment-status payment-status--${p.status}`}>
                        {p.status}
                      </span>
                    </td>
                    <td>
                      {p.paidAt ? new Date(p.paidAt).toLocaleString() : "-"}
                    </td>

                    <td>
                      {p.receiptUrl ? (
                        <a
                          href={`http://localhost:5000${p.receiptUrl}`}
                          target="_blank"
                          rel="noreferrer"
                          className="payments-receipt-link"
                        >
                          View
                        </a>
                      ) : (
                        "-"
                      )}
                      {/* ///////////// */}


                      {p.status === "pending" && (
                        <button
                          className="btn-confirm"
                          onClick={() => approvePayment(p.id)}
                          style={{ marginLeft: "10px" }}
                        >
                          Confirm
                        </button>
                      )}
               </td>
                  </tr>
                );
              })}

              {!filteredPayments.length && (
                <tr>
                  <td colSpan="8" style={{ textAlign: "center", padding: 20 }}>
                    No payments match the current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Payments;