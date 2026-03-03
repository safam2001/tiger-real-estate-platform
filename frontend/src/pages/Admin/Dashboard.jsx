
import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/Admin/AdminLayout";
import axiosInstance from "../../api/axiosInstance";
import "./Dashboard.css";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, BarElement);

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [units, setUnits] = useState([]);
  const [users, setUsers] = useState([]);
  const [payments, setPayments] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [p1, p2, p3, p4, p5] = await Promise.all([
          axiosInstance.get("/api/projects"),
          axiosInstance.get("/api/units"),
          axiosInstance.get("/api/users"),
          axiosInstance.get("/api/payments"),
          axiosInstance.get("/api/bookings")
        ]);

        setProjects(p1.data);
        setUnits(p2.data);
        setBookings(p5.data);

        const filteredUsers = p3.data.filter(
          (u) => u.role === "user" && u.email !== "admin@gmail.com"
        );
        setUsers(filteredUsers);

        const paymentsWithUser = p4.data.map((p) => {
          const user = p.Booking?.User;
          return {
            ...p,
            userName: user ? `${user.firstName} ${user.lastName}` : "Unknown User",
          };
        });

        setPayments(paymentsWithUser);

      } catch (err) {
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) return <p className="dashboard-loading">Loading dashboard...</p>;

  // -------------------------------
  // 1) Payments Line Chart (Your original)
  // -------------------------------
  const safePayments = payments
    .filter((p) => p && p.amount && !isNaN(Number(p.amount)))
    .slice(-6);

  const chartData = {
    labels: safePayments.map((p) => `#${p.id}`),
    datasets: [
      {
        label: "Payments Trend",
        data: safePayments.map((p) => Number(p.amount)),
        borderColor: "#0a2342",
        backgroundColor: "rgba(10, 35, 66, 0.2)",
        tension: 0.4,
        pointRadius: 5,
        pointBackgroundColor: "#0a2342",
      },
    ],
  };

  // -------------------------------
  // 2) Monthly Payments Chart
  // -------------------------------
  const monthlyTotals = {};
  payments.forEach((p) => {
    const month = new Date(p.paidAt).toLocaleString("en", { month: "short" });
    monthlyTotals[month] = (monthlyTotals[month] || 0) + Number(p.amount);
  });

  const monthlyPaymentsChart = {
    labels: Object.keys(monthlyTotals),
    datasets: [
      {
        label: "Monthly Payments",
        data: Object.values(monthlyTotals),
        backgroundColor: "#0a2342",
      },
    ],
  };

  // -------------------------------
  // 3) Monthly Bookings Chart
  // -------------------------------
  const bookingTotals = {};
  bookings.forEach((b) => {
    const month = new Date(b.createdAt).toLocaleString("en", { month: "short" });
    bookingTotals[month] = (bookingTotals[month] || 0) + 1;
  });

  const bookingsChart = {
    labels: Object.keys(bookingTotals),
    datasets: [
      {
        label: "Bookings per Month",
        data: Object.values(bookingTotals),
        backgroundColor: "#1e90ff",
      },
    ],
  };

  // -------------------------------
  // 4) New Users Chart
  // -------------------------------
  const userTotals = {};
  users.forEach((u) => {
    const month = new Date(u.createdAt).toLocaleString("en", { month: "short" });
    userTotals[month] = (userTotals[month] || 0) + 1;
  });

  const usersChart = {
    labels: Object.keys(userTotals),
    datasets: [
      {
        label: "New Users per Month",
        data: Object.values(userTotals),
        backgroundColor: "#28a745",
      },
    ],
  };

  return (
    <AdminLayout>
      <div className="dashboard-container">

        {/* Stats Cards */}
        <div className="dashboard-cards">
          <div className="dash-card"><h3>Projects</h3><p>{projects.length}</p></div>
          <div className="dash-card"><h3>Units</h3><p>{units.length}</p></div>
          <div className="dash-card"><h3>Users</h3><p>{users.length}</p></div>
          <div className="dash-card"><h3>Bookings</h3><p>{bookings.length}</p></div>
          <div className="dash-card"><h3>Payments</h3><p>{payments.length}</p></div>
        </div>

        {/* Original Payments Line Chart */}
        <div className="dashboard-chart">
          <h2>Payments Overview</h2>
          <Line data={chartData} />
        </div>

        {/* New Charts */}
        <div className="dashboard-chart">
          <h2>Monthly Payments</h2>
          <Bar data={monthlyPaymentsChart} />
        </div>

        <div className="dashboard-chart">
          <h2>Monthly Bookings</h2>
          <Bar data={bookingsChart} />
        </div>

        <div className="dashboard-chart">
          <h2>New Users Per Month</h2>
          <Bar data={usersChart} />
        </div>

        {/* Latest Tables */}
        <div className="dashboard-tables">

          <div className="dash-table-box">
            <h2>Latest Users</h2>
            <table>
              <thead>
                <tr><th>ID</th><th>Name</th><th>Email</th></tr>
              </thead>
              <tbody>
                {users.slice(-5).map((u) => (
                  <tr key={u.id}>
                    <td>{u.id}</td>
                    <td>{u.firstName} {u.lastName}</td>
                    <td>{u.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="dash-table-box">
            <h2>Latest Payments</h2>
            <table>
              <thead>
                <tr><th>ID</th><th>User</th><th>Amount</th></tr>
              </thead>
              <tbody>
                {payments.slice(-5).map((p) => (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td>{p.userName}</td>
                    <td>${p.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;