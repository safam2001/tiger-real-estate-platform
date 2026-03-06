import React from 'react';
import './AboutUs.css';

const AboutUs = () => {
  return (
    <div className="about-us-page">
      {/* قسم البطل */}
      <div className="about-hero">
        <h1>About Tiger Real Estate</h1> {/* حول شركة تايغر العقارية */}
        <p>Dubai's Premier Property Developer</p> {/* مطور العقارات الرائد في دبي */}
      </div>

      {/* القسم الرئيسي */}
      <div className="about-content">
        <section className="about-section">
          <div className="section-content">
            <h2>Who We Are</h2> {/* من نحن */}
            <p>
              Tiger Real Estate is a leading property development company based in Dubai, 
              United Arab Emirates. With over a decade of experience in the real estate industry, 
              we have established ourselves as a trusted name in luxury residential and commercial 
              property development.
            </p> {/* تايغر العقارية هي شركة رائدة في تطوير العقارات مقرها دبي، الإمارات العربية المتحدة. مع أكثر من عقد من الخبرة في صناعة العقارات، أثبتنا أنفسنا كاسم موثوق في تطوير العقارات السكنية والتجارية الفاخرة */}
            <p>
              Our commitment to excellence, innovative design, and customer satisfaction has made us 
              one of the most respected developers in the region. We specialize in creating 
              world-class residential communities, commercial spaces, and mixed-use developments 
              that redefine modern living.
            </p> {/* التزامنا بالتميز والتصميم المبتكر ورضا العملاء جعلنا من أكثر المطورين احتراماً في المنطقة. نتخصص في إنشاء مجتمعات سكنية ومساحات تجارية ومشاريع متعددة الاستخدامات من الطراز العالمي التي تعيد تعريف الحياة العصرية */}
          </div>
          <div className="section-image">
            <div className="image-placeholder">
              <span>🏢</span>
            </div>
          </div>
        </section>

        <section className="about-section reverse">
          <div className="section-content">
            <h2>Our Mission</h2> {/* مهمتنا */}
            <p>
              To create exceptional living and working spaces that enhance the quality of life for 
              our residents and tenants. We strive to deliver projects that exceed expectations in 
              terms of design, quality, and value.
            </p> {/* إنشاء مساحات معيشية وعملية استثنائية تعزز جودة الحياة لسكاننا ومستأجرينا. نسعى جاهدين لتقديم مشاريع تتجاوز التوقعات من حيث التصميم والجودة والقيمة */}
            <ul>
              <li>Deliver world-class property developments</li> {/* تقديم مشاريع عقارية من الطراز العالمي */}
              <li>Maintain the highest standards of quality and craftsmanship</li> {/* الحفاظ على أعلى معايير الجودة والحرفية */}
              <li>Build lasting relationships with our clients</li> {/* بناء علاقات دائمة مع عملائنا */}
              <li>Contribute to Dubai's growth and development</li> {/* المساهمة في نمو وتطوير دبي */}
            </ul>
          </div>
          <div className="section-image">
            <div className="image-placeholder">
              <span>🎯</span>
            </div>
          </div>
        </section>

        <section className="about-section">
          <div className="section-content">
            <h2>Our Vision</h2> {/* رؤيتنا */}
            <p>
              To be the most trusted and innovative real estate developer in the Middle East, 
              recognized for our commitment to excellence, sustainability, and creating communities 
              that inspire and enrich lives.
            </p> {/* أن نكون مطور العقارات الأكثر ثقة وابتكاراً في الشرق الأوسط، معترف بنا لالتزامنا بالتميز والاستدامة وإنشاء مجتمعات تلهم وتثري الحياة */}
          </div>
          <div className="section-image">
            <div className="image-placeholder">
              <span>🌟</span>
            </div>
          </div>
        </section>

        {/* قيمنا */}
        <section className="values-section">
          <h2>Our Core Values</h2> {/* قيمنا الأساسية */}
          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon">💎</div>
              <h3>Excellence</h3> {/* التميز */}
              <p>We never compromise on quality and always strive for perfection in every project.</p> {/* لا نتساهل أبداً في الجودة ونسعى دائماً للكمال في كل مشروع */}
            </div>
            <div className="value-card">
              <div className="value-icon">🤝</div>
              <h3>Integrity</h3> {/* النزاهة */}
              <p>Honesty and transparency guide all our business relationships and transactions.</p> {/* الصدق والشفافية يوجهان جميع علاقاتنا التجارية ومعاملاتنا */}
            </div>
            <div className="value-card">
              <div className="value-icon">🚀</div>
              <h3>Innovation</h3> {/* الابتكار */}
              <p>We embrace new technologies and design trends to create cutting-edge developments.</p> {/* نتبنى التقنيات الجديدة واتجاهات التصميم لإنشاء مشاريع حديثة */}
            </div>
            <div className="value-card">
              <div className="value-icon">❤️</div>
              <h3>Customer Focus</h3> {/* التركيز على العملاء */}
              <p>Our clients' satisfaction is at the heart of everything we do.</p> {/* رضا عملائنا في قلب كل ما نقوم به */}
            </div>
            <div className="value-card">
              <div className="value-icon">🌱</div>
              <h3>Sustainability</h3> {/* الاستدامة */}
              <p>We are committed to environmentally responsible development practices.</p> {/* نحن ملتزمون بممارسات التطوير المسؤولة بيئياً */}
            </div>
            <div className="value-card">
              <div className="value-icon">🏆</div>
              <h3>Leadership</h3> {/* القيادة */}
              <p>We set industry standards and lead by example in the real estate sector.</p> {/* نضع معايير الصناعة ونقود بالقدوة في قطاع العقارات */}
            </div>
          </div>
        </section>

        {/* إحصائيات */}
        <section className="stats-section">
          <h2>Our Achievements</h2> {/* إنجازاتنا */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">50+</div>
              <div className="stat-label">Projects Completed</div> {/* مشاريع مكتملة */}
            </div>
            <div className="stat-card">
              <div className="stat-number">10+</div>
              <div className="stat-label">Years of Experience</div> {/* سنوات من الخبرة */}
            </div>
            <div className="stat-card">
              <div className="stat-number">5000+</div>
              <div className="stat-label">Happy Customers</div> {/* عملاء سعداء */}
            </div>
            <div className="stat-card">
              <div className="stat-number">100+</div>
              <div className="stat-label">Awards & Recognition</div> {/* جوائز وتقدير */}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutUs;
