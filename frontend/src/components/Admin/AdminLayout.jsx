import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./AdminLayout.css";

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();

  return (
    <div className="admin-layout">

      <aside className="sidebar">
        <h2>Tiger Admin</h2>
        <ul>
          <li><Link to="/admin/dashboard">Dashboard</Link></li>
          <li><Link to="/admin/projects">Projects</Link></li>
          <li><Link to="/admin/units">Units</Link></li>
          <li><Link to="/admin/bookings">Bookings</Link></li>
          <li><Link to="/admin/users">Users</Link></li>
          <li><Link to="/admin/payments">Payments</Link></li>
          <li><Link to="/admin/adminprofile">Admin Profile</Link></li>



          {/* زر تسجيل الخروج */}
          <li>
            <button
              onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                window.location.href = "/login";
              }}
              className="logout-btn"
            >
              Logout
            </button>
          </li>
        </ul>
      </aside>

      {/* Main content */}
      <main className="admin-content">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;