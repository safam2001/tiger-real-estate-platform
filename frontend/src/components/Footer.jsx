import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* معلومات الشركة */}
        <div className="footer-section">
          <div className="footer-logo">
            <svg className="footer-logo-icon" width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="48" fill="#d4af37" stroke="#FFF" strokeWidth="2"/>
              <path d="M30 40 L50 25 L70 40 L65 60 L50 70 L35 60 Z" fill="#FFF"/>
              <circle cx="50" cy="50" r="8" fill="#d4af37"/>
            </svg>
            <span className="footer-logo-text">Tiger Real Estate</span>
          </div>
          <p className="footer-description">
            Dubai's premier real estate developer, creating exceptional living spaces 
            and commercial properties that redefine luxury.
          </p> {/* مطور العقارات الرائد في دبي، ننشئ مساحات معيشية استثنائية وعقارات تجارية تعيد تعريف الفخامة */}
          <div className="social-links">
            <a href="#" aria-label="Facebook">📘</a>
            <a href="#" aria-label="Twitter">🐦</a>
            <a href="#" aria-label="Instagram">📷</a>
            <a href="#" aria-label="LinkedIn">💼</a>
          </div>
        </div>

        {/* روابط سريعة */}
        <div className="footer-section">
          <h3>Quick Links</h3> {/* روابط سريعة */}
          <ul className="footer-links">
            <li><Link to="/">Home</Link></li> {/* الرئيسية */}
            <li><Link to="/projects">Projects</Link></li> {/* المشاريع */}
            
            <li><Link to="/aboutus">About Us</Link></li> {/* من نحن */}
            <li><Link to="/contactus">Contact Us</Link></li> {/* اتصل بنا */}
          </ul>
        </div>

        {/* معلومات الاتصال */}
        <div className="footer-section">
          <h3>Contact Info</h3> {/* معلومات الاتصال */}
          <ul className="footer-contact">
            <li>
              <span className="contact-icon">📍</span>
              <span>Tiger 2 building - Al Taawun Street - Al Khan - Emirate of Sharjah</span> 
            </li>
            <li>
              <span className="contact-icon">📞</span>
              <span>+971 4 369 5287</span>
            </li>
            <li>
              <span className="contact-icon">✉️</span>
              <span>info@tigerrealestate.ae</span>
            </li>
            <li>
              <span className="contact-icon">🕒</span>
              <span>Sun-Thu: 9AM - 6PM</span> {/* الأحد-الخميس */}
            </li>
          </ul>
        </div>

        {/* النشرة الإخبارية */}
        <div className="footer-section">
          <h3>Newsletter</h3> {/* النشرة الإخبارية */}
          <p>Subscribe to get updates on new projects and exclusive offers.</p> {/* اشترك للحصول على تحديثات المشاريع الجديدة والعروض الحصرية */}
          <form className="newsletter-form" onSubmit={(e) => { e.preventDefault(); alert('Thank you for subscribing!'); }}>
            <input 
              type="email" 
              placeholder="Enter your email" 
              required 
            />
            <button type="submit">Subscribe</button> {/* اشترك */}
          </form>
        </div>
      </div>

      {/* حقوق النشر */}
      <div className="footer-bottom">
        <div className="footer-bottom-container">
          <p>&copy; {new Date().getFullYear()} Tiger Real Estate. All rights reserved.</p> {/* جميع الحقوق محفوظة */}
          <div className="footer-legal">
            <Link to="/privacy">Privacy Policy</Link> {/* سياسة الخصوصية */}
            <Link to="/terms">Terms of Service</Link> {/* شروط الخدمة */}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
