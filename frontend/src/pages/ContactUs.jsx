// import React, { useState } from 'react';
// import './ContactUs.css';

// const ContactUs = () => {
//   // حالة النموذج
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     phone: '',
//     subject: '',
//     message: ''
//   });

//   // معالجة إرسال النموذج
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     // هنا يمكن إرسال البيانات إلى Backend
//     alert('Thank you for contacting us! We will get back to you soon.'); // شكراً لتواصلك معنا! سنتواصل معك قريباً
//     setFormData({
//       name: '',
//       email: '',
//       phone: '',
//       subject: '',
//       message: ''
//     });
//   };

//   return (
//     <div className="contact-us-page">
//       <div className="contact-hero">
//         <h1>Contact Us</h1> {/* اتصل بنا */}
//         <p>Get in touch with Tiger Real Estate</p> {/* تواصل مع شركة تايغر العقارية */}
//       </div>

//       <div className="contact-container">
//         <div className="contact-info">
//           <div className="info-card">
//             <div className="info-icon">📍</div>
//             <h3>Address</h3> {/* العنوان */}
//             <p>Dubai, United Arab Emirates</p> {/* دبي، الإمارات العربية المتحدة */}
//             <p>Business Bay, Tower A, Floor 15</p>
//           </div>

//           <div className="info-card">
//             <div className="info-icon">📞</div>
//             <h3>Phone</h3> {/* الهاتف */}
//             <p>+971 4 XXX XXXX</p>
//             <p>+971 50 XXX XXXX</p>
//           </div>

//           <div className="info-card">
//             <div className="info-icon">✉️</div>
//             <h3>Email</h3> {/* البريد الإلكتروني */}
//             <p>info@tigerrealestate.ae</p>
//             <p>sales@tigerrealestate.ae</p>
//           </div>

//           <div className="info-card">
//             <div className="info-icon">🕒</div>
//             <h3>Working Hours</h3> {/* ساعات العمل */}
//             <p>Sunday - Thursday: 9:00 AM - 6:00 PM</p> {/* الأحد - الخميس */}
//             <p>Friday - Saturday: 10:00 AM - 4:00 PM</p> {/* الجمعة - السبت */}
//           </div>
//         </div>

//         <div className="contact-form-section">
//           <h2>Send us a Message</h2> {/* أرسل لنا رسالة */}
//           <form onSubmit={handleSubmit} className="contact-form">
//             <div className="form-group">
//               <label htmlFor="name">Full Name *</label> {/* الاسم الكامل */}
//               <input
//                 type="text"
//                 id="name"
//                 required
//                 value={formData.name}
//                 onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                 placeholder="Enter your full name"
//               />
//             </div>

//             <div className="form-group">
//               <label htmlFor="email">Email Address *</label> {/* البريد الإلكتروني */}
//               <input
//                 type="email"
//                 id="email"
//                 required
//                 value={formData.email}
//                 onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//                 placeholder="Enter Your Email"
//               />
//             </div>

//             <div className="form-group">
//               <label htmlFor="phone">Phone Number</label> {/* رقم الهاتف */}
//               <input
//                 type="tel"
//                 id="phone"
//                 value={formData.phone}
//                 onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
//                 placeholder="+971 XX XXX XXXX"
//               />
//             </div>

//             <div className="form-group">
//               <label htmlFor="subject">Subject *</label> {/* الموضوع */}
//               <input
//                 type="text"
//                 id="subject"
//                 required
//                 value={formData.subject}
//                 onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
//                 placeholder="What is this regarding?"
//               />
//             </div>

//             <div className="form-group">
//               <label htmlFor="message">Message *</label> {/* الرسالة */}
//               <textarea
//                 id="message"
//                 required
//                 rows="6"
//                 value={formData.message}
//                 onChange={(e) => setFormData({ ...formData, message: e.target.value })}
//                 placeholder="Tell us how we can help you..."
//               />
//             </div>

//             <button type="submit" className="submit-btn">
//               Send Message {/* إرسال الرسالة */}
//             </button>
//           </form>
//         </div>
//       </div>

//       {/* خريطة الموقع */}
//       <div className="map-section">
//         <h2>Find Us on Map</h2> {/* ابحث عنا على الخريطة */}
//         <div className="map-placeholder">
//           <iframe
//             src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3610.198509554!2d55.2708!3d25.1972!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjXCsDExJzUwLjAiTiA1NcKwMTYnMTQuOSJF!5e0!3m2!1sen!2sae!4v1234567890"
//             width="100%"
//             height="450"
//             style={{ border: 0 }}
//             allowFullScreen=""
//             loading="lazy"
//             referrerPolicy="no-referrer-when-downgrade"
//             title="Tiger Real Estate Location"
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ContactUs;
import React, { useState } from "react";
import "./ContactUs.css";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    alert("Thank you! Our team will contact you shortly.");

    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    });
  };

  return (
    <div className="contact-us-page">
      
      {/* Hero Section */}
      <div className="contact-hero">
        <div className="hero-content">
          <h1>Contact Us</h1>
          <p>We’re here to help you find your dream property</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="contact-container">
        
        {/* Contact Info */}
        <div className="contact-info">
          <div className="info-card">
            <div className="info-icon">📍</div>
            <h3>Address</h3>
            <p>Tiger 2 building - Al Taawun Street - Al Khan</p>
            <p> - Emirate of Sharjah</p>
          </div>

          <div className="info-card">
            <div className="info-icon">📞</div>
            <h3>Phone</h3>
            <p>+971 4 369 5287</p>
            <p>+971 4 123 4567</p>
          </div>

          <div className="info-card">
            <div className="info-icon">✉️</div>
            <h3>Email</h3>
            <p>info@tigerrealestate.ae</p>
            <p>sales@tigerrealestate.ae</p>
          </div>

          <div className="info-card">
            <div className="info-icon">🕒</div>
            <h3>Working Hours</h3>
            <p>Sunday - Thursday: 9AM - 6PM</p>
            <p>Friday - Saturday: 10AM - 4PM</p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="contact-form-section">
          <h2>Send us a Message</h2>

          <form onSubmit={handleSubmit} className="contact-form">
            
            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter your full name"
              />
            </div>

            <div className="form-group">
              <label>Email Address *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="Enter your email"
              />
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                placeholder="+971 XX XXX XXXX"
              />
            </div>

            <div className="form-group">
              <label>Subject *</label>
              <input
                type="text"
                required
                value={formData.subject}
                onChange={(e) =>
                  setFormData({ ...formData, subject: e.target.value })
                }
                placeholder="What is your inquiry about?"
              />
            </div>

            <div className="form-group">
              <label>Message *</label>
              <textarea
                required
                rows="6"
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                placeholder="Write your message here..."
              />
            </div>

            <button type="submit" className="submit-btn-send">
              Send Message
            </button>
          </form>
        </div>
      </div>

      {/* Google Map */}
      <div className="map-section">
        <h2>Find Us on Map</h2>
        <div className="map-container">
        <iframe
            src="https://www.google.com/maps?q=Tiger+2+Building,+Al+Taawun+Street,+Al+Khan,+Sharjah&output=embed"
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Tiger Real Estate Location"
          />
        </div>
      </div>

    </div>
  );
};

export default ContactUs;