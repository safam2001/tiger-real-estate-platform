
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    onLogout();            // يمسح اليوزر من App.jsx
    setMenuOpen(false);    // يسكر المينيو بالموبايل
    navigate("/login");    // يروح لصفحة اللوج إن
  };

  return (
    <nav className="navbar">
      {/* LOGO */}
      <div className="logo" onClick={() => navigate("/")}></div>

      {/* MENU BUTTON (MOBILE) */}
      <div className="menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </div>

      {/* LINKS */}
     <ul className={`nav-links ${menuOpen ? "open" : ""}`}>

  {/* روابط العميل */}
  {(!user || user.role === "user") && (
    <>
      <li><Link to="/">Home</Link></li>
      <li><Link to="/projects">Projects</Link></li>
      <li><Link to="/mybookings">MyBookings</Link></li>
      <li><Link to="/aboutus">About Us</Link></li>
      <li><Link to="/contactus">Contact Us</Link></li>

      {!user && (
        <li><Link to="/login">Login</Link></li>
      )}

      {user && user.role === "user" && (
        <>
          <li><Link to="/profile">Profile</Link></li>
          <li><button onClick={handleLogout}>Logout</button></li>
        </>
      )}
    </>
  )}

  {/* روابط الأدمن */}
  {user && user.role === "admin" && (
    <>
      <li><Link to="/admin/dashboard">Dashboard</Link></li>
      <li><Link to="/admin/users">Users</Link></li>
      <li><Link to="/admin/projects">Projects</Link></li>
      <li><Link to="/admin/units">Units</Link></li>
      <li><button onClick={handleLogout}>Logout</button></li>
    </>
  )}

</ul>
    </nav>
  );
};

export default Navbar;