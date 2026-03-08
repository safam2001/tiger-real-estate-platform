
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

// Layouts
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// صفحات عامة
import Home from "./pages/Home";
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";
import Login from "./pages/Login";
import Register from "./pages/Register";

// صفحات المستخدم
import Profile from "./pages/Profile";
import ProjectsList from "./pages/ProjectsList";
// import ProjectUnits from "./pages/ProjectUnits";
import ProjectDetails from "./pages/ProjectDetails";
import UnitsList from "./pages/UnitsList";
// import UnitDetails from "./pages/UnitDetails";
import MyBookings from "./pages/MyBookings";
import UserInstallments from "./pages/UserInstallments";
import PaymentPage from "./pages/PaymentPage";


// صفحات الأدمن
import Dashboard from "./pages/Admin/Dashboard";
import Projectes from "./pages/Admin/Projectes";
import Units from "./pages/Admin/Units";
import Users from "./pages/Admin/Users";
import Payments from "./pages/Admin/Payments";

import AdminProfile from "./pages/Admin/AdminProfile";
import Bookings from "./pages/Admin/Bookings";
import BookingDetails from "./pages/Admin/BookingDetails";
import CreateInstallmentPlan from "./pages/Admin/CreateInstallmentPlan";


// حماية الصفحات
const ProtectedRoute = ({ children, role }) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  if (!token) return <Navigate to="/login" replace />;
  if (role && user?.role !== role) return <Navigate to="/" replace />;

  return children;
};

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <Router>

      {/* ========== صفحات الموقع العام فقط ========== */}
      <Routes>
        <Route
          path="/*"
          element={
            <>
              <Navbar user={user} onLogout={handleLogout} />

              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/aboutus" element={<AboutUs />} />
                <Route path="/contactus" element={<ContactUs />} />
                <Route path="/login" element={<Login onLogin={(u) => setUser(u)} />} />
                <Route path="/register" element={<Register />} />

                {/* صفحات المستخدم */}
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute role="user">
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/mybookings"
                  element={
                    <ProtectedRoute role="user">
                      <MyBookings />
                    </ProtectedRoute>
                  }
                />
                <Route path="/projects" element={<ProjectsList />} />
              
                <Route path="/projects/:id" element={<ProjectDetails />} />
          
                <Route path="/user/bookings/:id/installments" element={<UserInstallments />} />
                 <Route path="/user/bookings/:id/payment" element={<PaymentPage />} />

                <Route path="/projects/:projectId/units" element={<UnitsList />} />
                
              

                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>

              <Footer />
            </>
          }
        />

        {/* ========== صفحات الأدمن (بدون Navbar وبدون Footer) ========== */}

        <Route
          path="/admin/*"
          element={
            <Routes>
              <Route
                path="dashboard"
                element={
                  <ProtectedRoute role="admin">
                    <Dashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="projects"
                element={
                  <ProtectedRoute role="admin">
                    <Projectes />
                  </ProtectedRoute>
                }
              />

              <Route
                path="units"
                element={
                  <ProtectedRoute role="admin">
                    <Units />
                  </ProtectedRoute>
                }
              />

              <Route
                path="bookings"
                element={
                  <ProtectedRoute role="admin">
                    <Bookings />
                  </ProtectedRoute>
                }
              />

              <Route
                path="bookings/:id"
                element={
                  <ProtectedRoute role="admin">
                    <BookingDetails />
                  </ProtectedRoute>
                }
              />
            
              <Route
                path="bookings/:id/installments/create"
                element={
                  <ProtectedRoute role="admin">
                    <CreateInstallmentPlan />
                  </ProtectedRoute>
                }
              />


              <Route
                path="users"
                element={
                  <ProtectedRoute role="admin">
                    <Users />
                  </ProtectedRoute>
                }
              />

              <Route
                path="payments"
                element={
                  <ProtectedRoute role="admin">
                    <Payments />
                  </ProtectedRoute>
                }
              />

              <Route
                path="adminprofile"
                element={
                  <ProtectedRoute role="admin">
                    <AdminProfile />
                  </ProtectedRoute>
                }
              />

            </Routes>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;