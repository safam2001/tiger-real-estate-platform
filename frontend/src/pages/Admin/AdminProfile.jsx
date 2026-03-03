import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import "./AdminProfile.css";
import AdminLayout from "../../components/Admin/AdminLayout";

const AdminProfile = () => {

  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: ""
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");


  // Fetch current admin data
  
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await axiosInstance.get("/api/users/me");
      setProfile(data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  // Update profile info
 
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.put("/api/users/me", profile);
      setMessage("Profile updated successfully ✅");
    } catch (error) {
      setMessage("Error updating profile ❌");
    }
  };

  
  // Change password
 
  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage("Passwords do not match ❌");
      return;
    }

    try {
      await axiosInstance.put("/api/users/change-password", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });

      setMessage("Password changed successfully 🔐");

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });

    } catch (error) {
      setMessage("Current password is incorrect ❌");
    }
  };

  if (loading) return <div className="profile-loading">Loading...</div>;

  return (

    <AdminLayout>

    
    <div className="admin-profile-page">

      <h1 className="profile-title">Admin Profile Settings</h1>

      {message && <div className="profile-message">{message}</div>}

      {/* ================= PERSONAL INFO ================= */}
      <div className="profile-card">
        <h2>Personal Information</h2>

        <form onSubmit={handleProfileUpdate}>

          <div className="form-group">
            <label>First Name</label>
            <input
              type="text"
              value={profile.firstName}
              onChange={(e) =>
                setProfile({ ...profile, firstName: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label>Last Name</label>
            <input
              type="text"
              value={profile.lastName}
              onChange={(e) =>
                setProfile({ ...profile, lastName: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label>Email </label>
            <input
              type="email"
              value={profile.email}
              onChange={(e) =>
                setProfile({ ...profile, email: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label>Phone</label>
            <input
              type="text"
              value={profile.phone || ""}
              onChange={(e) =>
                setProfile({ ...profile, phone: e.target.value })
              }
            />
          </div>

          <button type="submit" className="profile-btn">
            Save Changes
          </button>

        </form>
      </div>

      {/* ================= PASSWORD ================= */}
      <div className="profile-card">
        <h2>Change Password</h2>

        <form onSubmit={handlePasswordChange}>

          <div className="form-group">
            <label>Current Password</label>
            <input
              type="password"
              value={passwordData.currentPassword}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  currentPassword: e.target.value
                })
              }
            />
          </div>

          <div className="form-group">
            <label>New Password</label>
            <input
              type="password"
              value={passwordData.newPassword}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  newPassword: e.target.value
                })
              }
            />
          </div>

          <div className="form-group">
            <label>Confirm New Password</label>
            <input
              type="password"
              value={passwordData.confirmPassword}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  confirmPassword: e.target.value
                })
              }
            />
          </div>

          <button type="submit" className="profile-btn">
            Update Password
          </button>

        </form>
      </div>

    </div>
    </AdminLayout>
  );
};

export default AdminProfile;