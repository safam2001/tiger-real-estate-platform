import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";
import "./Home.css";

const Home = () => {

  return (
    <div className="home-container">

      {/* ================= HERO SECTION ================= */}
      <section className="hero-section">
        <div className="hero-image"></div>

        <div className="hero-content">
          <h1>Discover Your Next Home</h1>
          <p>Luxury Real Estate in Sharjah by Tiger Properties</p>
        
        </div>
      </section>


      {/* ================= IMAGE GALLERY ================= */}

      <section className="gallery-section">
    
        <Swiper
          modules={[Pagination, Autoplay]}
          slidesPerView={1}
          pagination={{ clickable: true }}
          autoplay={{ delay: 2500 }}
          className="mySwiper"  >

          <SwiperSlide>
            <img src="/images/gallery1.jpeg" className="gallery-img" />
          </SwiperSlide>

          <SwiperSlide>
            <img src="/images/gallery2.jpeg" className="gallery-img" />
          </SwiperSlide>

          <SwiperSlide>
      <img src="https://images.bayut.com/thumbnails/819215218-1066x800.webp" className="gallery-img" />
    </SwiperSlide> 
        </Swiper>
      </section>
      <section className="stats-section">
        <div className="stats-container">
          <div className="stat-item">
            <div className="stat-icon">🏢</div>
            <div className="stat-number">50+</div>
            <div className="stat-label">Completed Projects</div> {/* مشاريع مكتملة */}
          </div>
          <div className="stat-item">
            <div className="stat-icon">👥</div>
            <div className="stat-number">10,000+</div>
            <div className="stat-label">Happy Customers</div> {/* عملاء سعداء */}
          </div>
          <div className="stat-item">
            <div className="stat-icon">⭐</div>
            <div className="stat-number">15+</div>
            <div className="stat-label">Years of Experience</div> {/* سنوات من الخبرة */}
          </div>
          <div className="stat-item">
            <div className="stat-icon">🏆</div>
            <div className="stat-number">100+</div>
            <div className="stat-label">Awards & Recognition</div> {/* جوائز وتقدير */}
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;