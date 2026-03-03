
import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import "./UserProfile.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [passwordMode, setPasswordMode] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const loadUser = async () => {
      const res = await axiosInstance.get("/api/users/me");
      setUser(res.data);

      setForm({
        firstName: res.data.firstName,
        lastName: res.data.lastName,
        email: res.data.email,
        phone: res.data.phone || "",
      });
    };

    loadUser();
  }, []);

       const handleUpdate = async () => {
    await axiosInstance.put("/api/users/me", form);
    setEditMode(false);
    window.location.reload();
  };

  
  const handlePasswordChange = async (e) => {
  e.preventDefault();

  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    alert("Passwords do not match ❌");
    return;
  }

  try {
    await axiosInstance.put("/api/users/change-password", {
      currentPassword: passwordForm.oldPassword,
      newPassword: passwordForm.newPassword
    });

    alert("Password changed successfully 🔐");

    setPasswordForm({
      oldPassword: "",
      newPassword: "",
      confirmPassword: ""
    });

    setPasswordMode(false);

  } catch (error) {
    alert("Current password is incorrect ❌");
  }
};

  if (!user) return <p className="loading">Loading profile...</p>;

  return (
    <div className="profile-container">

      {/* Header */}
      <div className="profile-header">
        <img
          src={user.avatar || "https://i.ibb.co/2FsfXqM/default-avatar.png"}
          alt="avatar"
          className="profile-avatar"
        />
        <h2>{user.firstName} {user.lastName}</h2>
        <p>{user.email}</p>
      </div>

      {/* Profile Details */}
      <div className="profile-card">
        <h3>Personal Information</h3>

        {!editMode ? (
          <div className="profile-info">
            <p><strong>First Name:</strong> {user.firstName}</p>
            <p><strong>Last Name:</strong> {user.lastName}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Phone:</strong> {user.phone || "Not provided"}</p>

            <button className="btn-edit" onClick={() => setEditMode(true)}>
              Edit Profile
            </button>
          </div>
        ) : (
          <div className="profile-edit">
            <input
              type="text"
              placeholder="First Name"
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
            />
            <input
              type="text"
              placeholder="Last Name"
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
            />
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <input
              type="text"
              placeholder="Phone"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />

            <button className="btn-save" onClick={handleUpdate}>Save</button>
            <button className="btn-cancel" onClick={() => setEditMode(false)}>Cancel</button>
          </div>
        )}
      </div>

      {/* Password Section */}
      <div className="profile-card">
        <h3>Security</h3>

        {!passwordMode ? (
          <button className="btn-password" onClick={() => setPasswordMode(true)}>
            Change Password
          </button>
        ) : (
          <div className="password-edit">
            <input
              type="password"
              placeholder="Old Password"
              onChange={(e) =>
                setPasswordForm({ ...passwordForm, oldPassword: e.target.value })
              }
            />
            <input
              type="password"
              placeholder="New Password"
              onChange={(e) =>
                setPasswordForm({ ...passwordForm, newPassword: e.target.value })
              }
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              onChange={(e) =>
                setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
              }
            />

            <button className="btn-save" onClick={handlePasswordChange}>Update Password</button>
            <button className="btn-cancel" onClick={() => setPasswordMode(false)}>Cancel</button>
          </div>
        )}
      </div>

    </div>
  );
};

export default Profile;