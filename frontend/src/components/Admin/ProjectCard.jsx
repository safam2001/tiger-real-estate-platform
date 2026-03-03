import React from "react";
import "./ProjectCard.css";

const ProjectCard = ({ project, onEdit, onDelete }) => {
  return (
    <div className="project-card">
      <div className="card-header">
        <h3>{project.name}</h3>
        <div className="card-actions">
          <button onClick={() => onEdit(project)} className="edit-btn">Edit</button>
          <button onClick={() => onDelete(project.id)} className="delete-btn">Delete</button>
        </div>
      </div>
      <p><strong>Status:</strong> {project.status}</p>
      <p><strong>Units:</strong> {project.unitsCount}</p>
      {project.image && (
        <img src={project.image} alt={project.name} className="project-image" />
      )}
    </div>
  );
};

export default ProjectCard;