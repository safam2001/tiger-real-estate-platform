
import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import axiosInstance from '../api/axiosInstance';
import './ProjectsList.css'; 

const ProjectsList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axiosInstance.get('/api/projects'); // جلب المشاريع من الباك
        setProjects(res.data);
      } catch (err) {
        console.error('Error fetching projects:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  if (loading) return <p style={{ textAlign: 'center', marginTop: '120px' }}>Loading projects...</p>;

  return (
    <div className="projects-container">
      {projects.length === 0 && <p>No projects available.</p>}
      {projects.map(project => (
        <div className="project-card" key={project.id}>
          {/* الصورة الرئيسية */}
          {project.image ? (
            <img src={project.image} alt={project.name} />
          ) : (
            <div style={{ height: '180px', background: '#ddd' }}></div>
          )}


          <div className="project-card">
            <div className="project-content">
              <h3>{project.name}</h3>
              <p className="location">{project.location}</p>
              <p className="description">{project.description?.slice(0, 60)}...</p>
            
              <div className="project-buttons">

                
                <Link to={`/projects/${project.id}`} className="btn-primary">
                  View Details
                </Link>
                <Link to={`/projects/${project.id}/units`} className="view-units-btn">
                  View Units
                </Link>

              </div>

            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProjectsList;