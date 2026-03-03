import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import ProjectCard from "./ProjectCard";
import "./ProjectTable.css";

const ProjectTable = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // جلب المشاريع من الباكند
  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/projects");
      setProjects(res.data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // حذف مشروع
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;

    try {
      await axiosInstance.delete(`/projects/${id}`);
      setProjects(projects.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Delete project error:", error);
    }
  };

  // تعديل مشروع (يمكن لاحقاً فتح Modal لتعديل المشروع)
  const handleEdit = (project) => {
    console.log("Edit project:", project);
    // هنا يمكن فتح نافذة تعديل المشروع
  };

  if (loading) return <p>Loading projects...</p>;

  return (
    <div className="project-table-container">
      {projects.length === 0 ? (
        <p>No projects found.</p>
      ) : (
        projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))
      )}
    </div>
  );
};

export default ProjectTable;