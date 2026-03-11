
import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import AdminLayout from "../../components/Admin/AdminLayout";
import "./Users.css";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [filter, setFilter] = useState("");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "user",
    status: "active",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axiosInstance.get("/api/users");
      const filtered = res.data.filter((u) => u.role !== "admin");
      setUsers(filtered);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await axiosInstance.put(`/api/users/admin/${editingUser.id}`, formData);
      } else {
        await axiosInstance.post("/api/users", formData);
      }
      setShowModal(false);
      resetForm();
      fetchUsers();
    } catch (err) {
      alert("Error saving user");
      console.error(err);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
      phone: user.phone || "",
      role: user.role || "user",
      status: user.status || "active",
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axiosInstance.delete(`/api/users/${id}`);
      fetchUsers();
    } catch (err) {
      alert("Error deleting user");
      console.error(err);
    }
  };

  const toggleBlock = async (user) => {
    try {
      await axiosInstance.put(`/api/users/${user.id}/block`, {
        isBlocked: !user.isBlocked,
      });
      fetchUsers();
    } catch (err) {
      alert("Error updating status");
      console.error(err);
    }
  };

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      role: "user",
      status: "active",
    });
    setEditingUser(null);
  };

  const filteredList = users.filter(
    (u) =>
      `${u.firstName} ${u.lastName}`
        .toLowerCase()
        .includes(filter.toLowerCase()) ||
      u.email.toLowerCase().includes(filter.toLowerCase())
  );

  if (loading) return <div className="users-loading">Loading...</div>;

  return (
    <AdminLayout>
      <div className="users-page">
        <div className="users-header">
          <h1 className="users-title">Users Management</h1>
          <button
            className="users-add-btn"
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
          >
            + Add User
          </button>
        </div>

        <div className="users-filter-box">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>

        <div className="users-table-wrapper">
          <table className="users-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredList.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div className="user-info-box">
                      <img
                        src={user.avatar || "/default-avatar.png"}
                        alt="avatar"
                        className="user-avatar"
                      />
                      <div>
                        <div className="user-name">
                          {user.firstName} {user.lastName}
                        </div>
                        <div className="user-email">ID: {user.id}</div>
                      </div>
                    </div>
                  </td>

                  <td>{user.email}</td>
                  <td>{user.phone || "-"}</td>

                  <td>
                    <span className={`user-role-badge user-role-${user.role}`}>
                      {user.role}
                    </span>
                  </td>

                  <td>
                    <span
                      className={`user-status-badge ${
                        user.isBlocked ? "user-status-blocked" : "user-status-active"
                      }`}
                    >
                      {user.isBlocked ? "Blocked" : "Active"}
                    </span>
                  </td>

                  <td>
                    <div className="user-actions">
                      <button
                        className="user-action-btn user-edit-btn"
                        onClick={() => handleEdit(user)}
                      >
                        Edit
                      </button>

                      <button
                        className="user-action-btn user-block-btn"
                        onClick={() => toggleBlock(user)}
                      >
                        {user.isBlocked ? "Unblock" : "Block"}
                      </button>

                      <button
                        className="user-action-btn user-delete-btn"
                        onClick={() => handleDelete(user.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredList.length === 0 && (
                <tr>
                  <td colSpan="6" className="users-empty">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {showModal && (
          <div
            className="users-modal-overlay"
            onClick={() => {
              setShowModal(false);
              resetForm();
            }}
          >
            <div
              className="users-modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              <h2>{editingUser ? "Edit User" : "Add User"}</h2>

              <form onSubmit={handleSubmit}>
                <div className="users-form-row">
                  <div className="users-form-group">
                    <label>First Name</label>
                    <input
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          firstName: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="users-form-group">
                    <label>Last Name</label>
                    <input
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          lastName: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="users-form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>

                <div className="users-form-group">
                  <label>Phone</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                </div>

                <div className="users-form-row">
                  <div className="users-form-group">
                    <label>Role</label>
                    <select
                      value={formData.role}
                      onChange={(e) =>
                        setFormData({ ...formData, role: e.target.value })
                      }
                    >
                      <option value="user">User</option>
                    
                    </select>
                  </div>

                </div>

                <div className="users-modal-actions">
                  <button className="users-save-btn" type="submit">
                    Save
                  </button>
                  <button
                    className="users-cancel-btn"
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Users;