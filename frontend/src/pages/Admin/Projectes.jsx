
import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';
import './Projectes.css';
import AdminLayout from '../../components/Admin/AdminLayout';

const Projectes = () => {

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    latitude: '',
    longitude: '',
    image: '',
    images: [],
    videos: []
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await axiosInstance.get('/api/projects');
      setProjects(res.data);
    } catch (err) {
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        location: formData.location,
        latitude: formData.latitude,
        longitude: formData.longitude,

        image: formData.image,
        images: JSON.stringify(formData.images),
        videos: JSON.stringify(formData.videos)
      };

      if (editingProject) {
        await axiosInstance.put(`/api/projects/${editingProject.id}`, payload);
      } else {
        await axiosInstance.post('/api/projects', payload);
      }

      setShowModal(false);
      resetForm();
      fetchProjects();

    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء حفظ المشروع');
    }
  };

  // ===== تعديل المشروع =====
  const handleEdit = (project) => {
    setEditingProject(project);

    // هنا صلحنا JSON.parse لتجنب الأخطاء إذا كانت array أو null
    setFormData({
      name: project.name || '',
      description: project.description || '',
      location: project.location || '',
      latitude: project.latitude || '',
      longitude: project.longitude || '',
      image: project.image || '',
      images: Array.isArray(project.images) ? project.images : [],
      videos: Array.isArray(project.videos) ? project.videos : []
    });

    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;

    try {
      await axiosInstance.delete(`/api/projects/${id}`);
      fetchProjects();
    } catch (err) {
      console.error(err);
      alert('An error occurred during deletion');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      location: '',
      latitude: '',
      longitude: '',
      image: '',
      images: [],
      videos: []
    });
    setEditingProject(null);
  };

  if (loading) return <p>Loading...</p>;

  return (
    <AdminLayout>
      <div className="admin-page">

        <div className="page-header">
          <h1>Project Management</h1>
          <button
            className="add-btn"
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
          >
            + Add New Project
          </button>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Main Image</th>
                <th>Name</th>
                <th>Location</th>

                <th>Units</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map(project => (
                <tr key={project.id}>
                  <td>
                    {project.image ? (
                      <img
                        src={project.image}
                        alt={project.name}
                        className="table-image"
                      />
                    ) : (
                      <span>-</span>
                    )}
                  </td>
                  <td>{project.name}</td>
                  <td>{project.location}</td>
                  <td>{project.Units?.length || 0}</td>
                  <td>
                    <button
                      className="edit-btn"
                      onClick={() => handleEdit(project)}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(project.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showModal && (
          <div
            className="modal-overlay"
            onClick={() => {
              setShowModal(false);
              resetForm();
            }}
          >
            <div
              className="modal-content"
              onClick={e => e.stopPropagation()}
            >
              <h2>{editingProject ? 'Edit Project' : 'Add New Project'}</h2>

              <form onSubmit={handleSubmit}>

                <label>Project Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />

                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={e =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                ></textarea>

                <label>Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={e =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                />
                <label>Latitude</label>
                <input
                  type="number"
                  step="0.000001"
                  value={formData.latitude}
                  onChange={e =>
                    setFormData({ ...formData, latitude: e.target.value })
                  }
                />

                <label>Longitude</label>
                <input
                  type="number"
                  step="0.000001"
                  value={formData.longitude}
                  onChange={e =>
                    setFormData({ ...formData, longitude: e.target.value })
                  }
                />

                <label>Main Image URL</label>
                <input
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={formData.image}
                  onChange={e =>
                    setFormData({ ...formData, image: e.target.value })
                  }
                />

                <label>Additional Image URLs (comma separated)</label>
                <input
                  type="text"
                  placeholder="url1, url2, url3"
                  value={formData.images.join(', ')}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      images: e.target.value
                        .split(',')
                        .map(v => v.trim())
                        .filter(v => v)
                    })
                  }
                />

                <label>Video URLs (comma separated)</label>
                <input
                  type="text"
                  placeholder="https://youtube.com/..."
                  value={formData.videos.join(', ')}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      videos: e.target.value
                        .split(',')
                        .map(v => v.trim())
                        .filter(v => v)
                    })
                  }
                />

                <div className="modal-actions">
                  <button type="submit" className="submit-btn">
                    Save
                  </button>
                  <button
                    type="button"
                    className="cancel-btn-project"
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

export default Projectes;