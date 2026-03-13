import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/Admin/AdminLayout';
import axiosInstance from '../../api/axiosInstance';
import './Units.css';

const Units = () => {
  // ===== حالة البيانات =====
  const [units, setUnits] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // ===== حالة المودال =====
  const [showModal, setShowModal] = useState(false);
  const [editingUnit, setEditingUnit] = useState(null);

  // ===== بيانات النموذج =====
  const [formData, setFormData] = useState({
    number: '',
    type: '',
    price: '',
    description: '',
    image: '',
    images: '',
    videos: '',
    area: '',
    bedrooms: '',
    bathrooms: '',
    status: 'available',
    projectId: ''
  });

  // ===== جلب البيانات =====
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [unitsRes, projectsRes] = await Promise.all([
          axiosInstance.get('/api/units'),
          axiosInstance.get('/api/projects')
        ]);
        setUnits(unitsRes.data);
        setProjects(projectsRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // ===== حفظ أو تعديل الوحدة =====
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        price: parseFloat(formData.price) || 0,
        area: parseFloat(formData.area) || null,
        bedrooms: parseInt(formData.bedrooms) || null,
        bathrooms: parseInt(formData.bathrooms) || null,
        images: formData.images ? formData.images.split(',').map(s => s.trim()) : [],
        videos: formData.videos ? formData.videos.split(',').map(s => s.trim()) : []
      };

      if (editingUnit) {
        await axiosInstance.put(`/api/units/${editingUnit.id}`, data);
      } else {
        await axiosInstance.post('/api/units', data);
      }

      setShowModal(false);
      resetForm();
      const unitsRes = await axiosInstance.get('/api/units');
      setUnits(unitsRes.data);
    } catch (error) {
      alert('an error occurred during saving');
      console.error(error);
    }
  };

  // ===== فتح المودال للتعديل =====
  const handleEdit = (unit) => {
    setEditingUnit(unit);
    setFormData({
      number: unit.number || '',
      type: unit.type || '',
      price: unit.price || '',
      description: unit.description || '',
      image: unit.image || '',
       videos: unit.videos?.join(', ') || '', 
        images: unit.images?.join(', ') || '',
      area: unit.area || '',
      bedrooms: unit.bedrooms || '',
      bathrooms: unit.bathrooms || '',
      status: unit.status || 'available',
      projectId: unit.projectId || ''
    });
    setShowModal(true);
  };

  // ===== حذف الوحدة =====
  const handleDelete = async (id) => {
    if (!window.confirm('are you sure you want to delete the unit')) return;
    try {
      await axiosInstance.delete(`/api/units/${id}`);
      setUnits(units.filter(u => u.id !== id));
    } catch (error) {
     console.error("Delete unit failed:", error.response?.data || error.message);
      alert('an error occurred during deletion');
    }
  };

  // ===== إعادة ضبط النموذج =====
  const resetForm = () => {
    setFormData({
      number: '',
      type: '',
      price: '',
      currency:'',
      description: '',
      image: '',
      images: '',
      videos: '',
      area: '',
      bedrooms: '',
      bathrooms: '',
      status: 'available',
      projectId: ''
    });
    setEditingUnit(null);
  };

  if (loading) return <div className="loading">loading.</div>;

  return (
    <AdminLayout>
      <div className="admin-page units-page">
        {/* ===== رأس الصفحة ===== */}
        <div className="page-header-units">
          <h1>Units Management</h1>
          <button className="add-btn" onClick={() => { resetForm(); setShowModal(true); }}>
            + Add New Unit
          </button>
        </div>

        {/* ===== جدول الوحدات ===== */}
        <div className="table-container-units">
          <table className="data-table-units">
            <thead>
              <tr>
                <th>Image</th>
                <th>Number</th>
                <th>Type</th>
                <th>Project</th>
                <th>Price</th>
                <th>Area (m²)</th>
                <th>Bedrooms</th>
                <th>Bathrooms</th>
                <th>Status</th>
                <th>Actions</th>
             
              </tr>
            </thead>
            <tbody>
              {units.map(unit => (
                <tr key={unit.id}>
                  <td>{unit.image ? <img src={unit.image} className="table-image" alt={unit.number} /> : <span className="no-image">-</span>}</td>
                  <td>{unit.number}</td>
                  <td>{unit.type}</td>
                  <td>{unit.Project?.name || '-'}</td>
                  <td className="price-cell"> {unit.currency} {unit.price?.toLocaleString()}</td>
                  <td>{unit.area || '-'}</td>
                  <td>{unit.bedrooms || '-'}</td>
                  <td>{unit.bathrooms || '-'}</td>
                  <td><span className={`status-badge status-${unit.status}`}>{unit.status}</span></td>
                  <td>
                    <button className="edit-btn" onClick={() => handleEdit(unit)}>Edit</button>
                    <button className="delete-btn" onClick={() => handleDelete(unit.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ===== مودال الإضافة / التعديل ===== */}
        {showModal && (
          <div className="modal-overlay" onClick={() => { setShowModal(false); resetForm(); }}>
            <div className="modal-content large" onClick={e => e.stopPropagation()}>
              <h2>{editingUnit ? 'Edit Unit' : 'Add New Unit'}</h2>
              <form onSubmit={handleSubmit}>
                {/* ===== صف 1 ===== */}
                <div className="form-row">
                  <div className="form-group">
                    <label>Unit Number *</label>
                    <input type="text" required value={formData.number} onChange={e => setFormData({ ...formData, number: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>Project *</label>
                    <select required value={formData.projectId} onChange={e => setFormData({ ...formData, projectId: e.target.value })}>
                      <option value="">Select Project</option>
                      {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                  </div>
                </div>

                {/* ===== صف 2 ===== */}
                <div className="form-row">
                  <div className="form-group">
                    <label>Type</label>
                    <input type="text" value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>Price</label>
                    <input type="number" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} />
                  </div>
                </div>
                {/* */}
                <div className="form-group">
                  <label>Currency</label>
                  <select
                    value={formData.currency}
                    onChange={e => setFormData({ ...formData, currency: e.target.value })}
                  >
                    <option value="USD">USD</option>
                    <option value="AED">AED</option>
                    <option value="EUR">EUR</option>
                  </select>
                </div>
                {/* ===== صف 3 ===== */}
                <div className="form-row">
                  <div className="form-group">
                    <label>Area (m²)</label>
                    <input type="number" value={formData.area} onChange={e => setFormData({ ...formData, area: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>Bedrooms</label>
                    <input type="number" value={formData.bedrooms} onChange={e => setFormData({ ...formData, bedrooms: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>Bathrooms</label>
                    <input type="number" value={formData.bathrooms} onChange={e => setFormData({ ...formData, bathrooms: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>Status</label>
                    <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}>
                      <option value="available">Available</option>
                      <option value="booked">Booked</option>
                      <option value="sold">Sold</option>
                    </select>
                  </div>
                </div>

                {/* ===== صف الوصف والصور والفيديو ===== */}
                <div className="form-group">
                  <label>Description</label>
                  <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} rows="3" />
                </div>
                <div className="form-group">
                  <label>Main Image URL</label>
                  <input type="url" value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Additional Images (comma separated)</label>
                  <input type="text" value={formData.images} onChange={e => setFormData({ ...formData, images: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Videos (comma separated URLs)</label>
                  <input type="text" value={formData.videos} onChange={e => setFormData({ ...formData, videos: e.target.value })} />
                </div>

                {/* ===== أزرار الحفظ والإلغاء ===== */}
                <div className="modal-actions">
                  <button type="submit" className="submit-btn">Save</button>
                  <button type="button" className="cancel-btn-units" onClick={() => { setShowModal(false); resetForm(); }}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Units;