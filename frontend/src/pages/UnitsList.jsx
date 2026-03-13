
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./UnitsList.css";
import axiosInstance from "../api/axiosInstance";
import { useParams } from "react-router-dom";


const UnitsList = () => {
  const [units, setUnits] = useState([]);
  const [filteredUnits, setFilteredUnits] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const { projectId } = useParams(); // هذا هو projectId
  // ===== البحث والفلاتر =====
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minArea, setMinArea] = useState("");
  const [maxArea, setMaxArea] = useState("");
  const [openBooking, setOpenBooking] = useState(false);
  const [visitDate, setVisitDate] = useState("");
  const [visitTime, setVisitTime] = useState("");
  const [selectedVideo, setSelectedVideo] = useState(null);



  function convertToEmbed(url) {
    if (url.includes("watch?v=")) {
      return url.replace("watch?v=", "embed/");
    }

    if (url.includes("youtu.be")) {
      const id = url.split("youtu.be/")[1];
      return `https://www.youtube.com/embed/${id}`;
    }

    return url; // إذا كان embed جاهز
  }
  useEffect(() => {
    axiosInstance.get(`/api/units?projectId=${projectId}`)
      .then((res) => {
        setUnits(res.data);
        setFilteredUnits(res.data);
      })
      .catch((err) => console.error(err));
  }, [projectId]);

  useEffect(() => {
    let result = [...units];

    if (search.trim() !== "") {
      result = result.filter((u) =>
        JSON.stringify(u).toLowerCase().includes(search.toLowerCase())
      );
    }

    if (status) result = result.filter((u) => u.status === status);
    if (bedrooms) result = result.filter((u) => u.bedrooms == bedrooms);

    if (minPrice) result = result.filter((u) => u.price >= minPrice);
    if (maxPrice) result = result.filter((u) => u.price <= maxPrice);

    if (minArea) result = result.filter((u) => u.area >= minArea);
    if (maxArea) result = result.filter((u) => u.area <= maxArea);

    setFilteredUnits(result);
  }, [search, status, bedrooms, minPrice, maxPrice, minArea, maxArea, units]);


  const generateTimes = () => {
    const times = [];
    for (let hour = 10; hour <= 17; hour++) {
      const suffix = hour < 12 ? "AM" : "PM";
      const hour12 = hour > 12 ? hour - 12 : hour;

      times.push({ value: `${hour.toString().padStart(2, "0")}:00`, label: `${hour12}:00 ${suffix}` });
      times.push({ value: `${hour.toString().padStart(2, "0")}:30`, label: `${hour12}:30 ${suffix}` });
    }
    return times;
  };

  const times = generateTimes();

  // ===== handleBooking =====
  const handleBooking = async () => {
    if (!selectedUnit) {
      alert("No unit selected");
      return;
    }
    if (!visitDate || !visitTime) {
      alert("Please select date and time");
      return;
    }
    const now = new Date();

    // دمج التاريخ + الوقت
    const [hours, minutes] = visitTime.split(":").map(Number);
    const selectedDateTime = new Date(visitDate);
    selectedDateTime.setHours(hours, minutes, 0, 0);

    // ❗ 1) منع الحجز في الماضي
    if (selectedDateTime < now) {
      alert("You cannot book a past date or time.");
      return;
    }

    // ❗ 2) السماح فقط بالحجز خلال 48 ساعة
    const maxAllowed = new Date(now.getTime() + 48 * 60 * 60 * 1000);
    if (selectedDateTime > maxAllowed) {
      alert("Booking must be within 48 hours from now.");
      return;
    }

    // ❗ 3) التحقق من ساعات العمل
    const hour = selectedDateTime.getHours();
    const minute = selectedDateTime.getMinutes();
    if (hour < 10 || hour > 17 || (hour === 17 && minute > 30)) {
      alert("Booking time must be between 10:00 AM and 5:30 PM");
      return;
    }
    
    // كل شيء تمام → إرسال للحجز
    try {
      await axiosInstance.post("/api/bookings", {
        unitId: selectedUnit.id,
        visitDate,
        visitTime,
        paymentMethod: "cash",
      });
      alert("Booking confirmed!");
      setOpenBooking(false);
      setVisitDate("");
      setVisitTime("");
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="units-page">

      {/* ===== البحث ===== */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search units..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

      </div>

      {/* ===== الفلاتر ===== */}
      <div className="filters-container">

        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">Status</option>
          <option value="available">Available</option>
          <option value="booked">Booked</option>
          <option value="sold">Sold</option>
        </select>

        <select value={bedrooms} onChange={(e) => setBedrooms(e.target.value)}>
          <option value="">Bedrooms</option>
          {/* <option value="0">Studio</option> */}
          <option value="1">1 Bedroom</option>
          <option value="2">2 Bedrooms</option>
          <option value="3">3 Bedrooms</option>

        </select>

        <input type="number" placeholder="Min Price" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
        <input type="number" placeholder="Max Price" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />

        <input type="number" placeholder="Min Area" value={minArea} onChange={(e) => setMinArea(e.target.value)} />
        <input type="number" placeholder="Max Area" value={maxArea} onChange={(e) => setMaxArea(e.target.value)} />
      </div>
      <button className="back-btn" onClick={() => window.history.back()}>
        ← Back
      </button>
      {/* ===== عرض الوحدات ===== */}
      <div className="units-grid">
        {filteredUnits.map((unit) => {
          const parsedImages = Array.isArray(unit.images)
            ? unit.images
            : typeof unit.images === "string"
              ? unit.images.split(",").map((img) => img.trim())
              : [];

          const parsedVideos = Array.isArray(unit.videos)
            ? unit.videos
            : typeof unit.videos === "string"
              ? unit.videos.split(",").map((v) => v.trim())
              : [];

          return (

            <div className={`unit-card ${unit.status === "sold" ? "sold" : ""}`} key={unit.id}>
              <div className="image-wrapper">
                <img
                  className="main-image"
                  src={unit.image || parsedImages[0]}
                  alt={unit.number}
                />
              </div>

              {parsedImages.length > 1 && (

                <div className="slider">
                  {parsedImages.map((img, index) => (
                    <img key={index} src={img} alt="" className="slide-image" />
                  ))}
                </div>
              )}

              <div className="unit-info">
                <div className="unit-header">
                  <h3>{unit.number}</h3>
                  <span className={`status-badge ${unit.status}`}>{unit.status}</span>

                </div>

                {unit.type && <p className="unit-type">Type: {unit.type}</p>} {/* النوع */}
                <p>{unit.area} m² | {unit.bedrooms} Bedrooms | {unit.bathrooms} Bathrooms
                </p>

                <p className="price">
                  {unit.currency} {unit.price?.toLocaleString()}
                </p>



                <div className="actions">

                  {parsedVideos.length > 0 && (
                    <button
                      className="btn video"
                      onClick={() => {
                        const embedUrl = convertToEmbed(parsedVideos[0]);
                        setSelectedVideo(embedUrl);
                      }}
                    >
                      View Video
                    </button>


                  )}
                  {unit.status === "sold" ? (
                    <button className="btn sold" disabled>Sold</button>
                  ) : (
                    <button
                      className="btn book"
                      onClick={() => {
                        setSelectedUnit(unit);
                        setOpenBooking(true);
                      }}
                    >
                      Book Viewing
                    </button>
                  )}

                </div>


              </div>
            </div>
          );
        })}
      </div>
      {openBooking && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Book a Viewing</h2>


            <div className="booking-note">
              • The selected viewing date must be at least <strong>48 hours</strong> from now.<br />
              • If the user does not attend the viewing within <strong>15 days</strong>, they cannot book again.
              • Each viewing lasts <strong>30 minutes</strong>.<br />


            </div>


            <label>Select Date</label>
            <input
              type="date"
              value={visitDate}
              onChange={(e) => setVisitDate(e.target.value)}
            />
            {/* ///////////////////////////////////// */}
            <label>Select Time</label>
            <select
              value={visitTime}
              onChange={(e) => setVisitTime(e.target.value)}
            >
              <option value="">-- Select Time --</option>
              {times.map((t, i) => (
                <option key={i} value={t.value}>{t.label}</option> // value = 24h, label = AM/PM
              ))}
            </select>

            <div className="modal-buttons">
              <button className="btn confirm" onClick={handleBooking}>
                Confirm
              </button>
              <button className="btn cancel" onClick={() => setOpenBooking(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== نافذة الفيديو ===== */}
      {selectedVideo && (

        <div className="video-modal" onClick={() => setSelectedVideo(null)}>
          <div className="video-content" onClick={(e) => e.stopPropagation()}>
            <iframe src={selectedVideo} allowFullScreen></iframe>
          </div>
        </div>
      )}
    </div>
  );
};

export default UnitsList;