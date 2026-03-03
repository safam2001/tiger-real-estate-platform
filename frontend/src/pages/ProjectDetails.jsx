
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./ProjectDetails.css";

const ProjectDetails = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProject();
  }, []);

  const fetchProject = async () => {
    try {
      const res = await axiosInstance.get(`/api/projects/${id}`);
      setProject(res.data);
    } catch (err) {
      console.error("Error fetching project:", err);
    } finally {
      setLoading(false);
    }
  };

  // دالة تحويل أي رابط يوتيوب إلى embed
  function convertToEmbed(url) {
    if (!url) return "";

    // watch?v=
    if (url.includes("watch?v=")) {
      return url.replace("watch?v=", "embed/");
    }

    // youtu.be
    if (url.includes("youtu.be")) {
      const id = url.split("youtu.be/")[1];
      return `https://www.youtube.com/embed/${id}`;
    }

    // shorts
    if (url.includes("shorts")) {
      const id = url.split("shorts/")[1];
      return `https://www.youtube.com/embed/${id}`;
    }

    return url;
  }

  useEffect(() => {
    if (!project) return;

    if (L.DomUtil.get("map") !== null) {
      L.DomUtil.get("map")._leaflet_id = null;
    }

    const map = L.map("map").setView(
      [project.latitude, project.longitude],
      13
    );

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);

    L.marker([project.latitude, project.longitude])
      .addTo(map)
      .bindPopup(project.name);

  }, [project]);

  if (loading) return <p>Loading...</p>;
  if (!project) return <p>Project not found</p>;

  const videoUrl = convertToEmbed(project.videos?.[0]);

  return (
    <div className="project-details-container">
      <button className="back-btn" onClick={() => navigate("/projects")}>
        ← Back to Projects
      </button>

      <h1 className="project-title">{project.name}</h1>

      {project.image && (
        <img
          src={project.image}
          alt={project.name}
          className="project-main-image"
        />
      )}

      {/* معرض الصور */}
      {project.images && project.images.length > 0 && (
        <>
          <h2 className="section-title">Gallery</h2>
          <div className="gallery-container">
            {project.images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`image-${index}`}
                className="gallery-image"
              />
            ))}
          </div>
        </>
      )}

      <h2 className="section-title">Description</h2>
      <p className="project-description">{project.description}</p>

      {/* فيديو المشروع */}
      {project.videos && project.videos.length > 0 && (
        <>
          <h2 className="section-title">Project Video</h2>
          <iframe
            className="project-video"
            src={videoUrl}
            title="Project Video"
            allowFullScreen
          ></iframe>
        </>
      )}

      <h2 className="section-title">Location</h2>
      <div id="map"></div>
    </div>
  );
};

export default ProjectDetails;