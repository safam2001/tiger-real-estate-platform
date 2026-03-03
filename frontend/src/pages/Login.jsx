
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import "./Login.css";

const Login = ({ onLogin }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [display, setDisplay] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setDisplay("");

    try {
      const response = await axiosInstance.post("/api/auth/login", formData);

      if (response.data?.token && response.data?.user) {
        // حفظ بيانات المستخدم
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));

        // تحديث حالة App.jsx
        if (onLogin) onLogin(response.data.user);

        setDisplay("Login successful! Redirecting...");

        setTimeout(() => {
          if (response.data.user.role === "admin") {
            navigate("/dashboard");
          } else {
            navigate("/");
          }
        }, 800);
      } else {
        setDisplay("Invalid response from server. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Login failed. Please try again.";
      setDisplay(errorMessage);
    }
  };

  return (
    <div className="login-page">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>

        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          placeholder="Enter your Email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          placeholder="Enter your Password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <button type="submit">Login</button>

        {display && (
          <p
            className={`login-display ${
              display.includes("successful") ? "success" : "error"
            }`}
          >
            {display}
          </p>
        )}

        <div className="login-link">
          Don't have an account? <Link to="/register">Register here</Link>
        </div>
      </form>
    </div>
  );
};

export default Login;