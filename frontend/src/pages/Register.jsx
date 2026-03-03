
import axiosInstance from '../api/axiosInstance';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';


import './Register.css';

const Register = () => {

  const navigate = useNavigate();

  // حالة لتخزين بيانات النموذج (الحقول المدخلة)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  // حالة لعرض رسائل النجاح أو الخطأ للمستخدم
  const [display, setDisplay] = useState('');

  // دالة لتحديث القيم عند الكتابة في الحقول
  const handleChange = (e) => {
    // نأخذ القيمة الجديدة ونحدث الحقل المناسب حسب id
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // دالة تنفيذ التسجيل عند الضغط على زر Register
  const handleSubmit = async (e) => {
    e.preventDefault(); // منع إعادة تحميل الصفحة
    setDisplay(''); // مسح أي رسالة سابقة

    try {
      // إرسال بيانات التسجيل إلى الباكند
      // الباكند هو الذي يحدد role = 'user'
      const response = await axiosInstance.post('/api/auth/register', formData);

      // التحقق أن الاستجابة تحتوي على توكن وبيانات مستخدم
      if (response.data && response.data.token && response.data.user) {

      

        // عرض رسالة نجاح
        setDisplay('Registration successful! Redirecting...');

        // بعد ثانية واحدة يتم التوجيه إلى صفحة تسجيل الدخول
        setTimeout(() => {
          navigate('/login'); // الانتقال إلى صفحة login

        }, 1000);

      } else {
        // في حال لم تكن الاستجابة صحيحة
        setDisplay('Invalid response from server. Please try again.');
      }

    } catch (error) {
      // في حال حدوث خطأ أثناء الاتصال بالباكند
      console.error('Registration error:', error);

      // استخراج رسالة الخطأ من الباكند إن وجدت
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Registration failed. Please try again.';

      // عرض رسالة الخطأ للمستخدم
      setDisplay(errorMessage);
    }
  };

  return (
    <div className="register-page">
      {/* نموذج التسجيل */}
      <form className="register-form" onSubmit={handleSubmit}>
        <h2>Create Account</h2>

        {/* حقل الاسم الأول */}
        <label htmlFor="firstName">First Name</label>
        <input
          type="text"
          id="firstName"
          placeholder="Enter your First Name"
          value={formData.firstName}
          onChange={handleChange}
          required
        />

        {/* حقل الاسم الأخير */}
        <label htmlFor="lastName">Last Name</label>
        <input
          type="text"
          id="lastName"
          placeholder="Enter your Last Name"
          value={formData.lastName}
          onChange={handleChange}
          required
        />

        {/* حقل البريد الإلكتروني */}
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          placeholder="Enter your Email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        {/* حقل كلمة المرور */}
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          placeholder="Enter your Password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        {/* زر التسجيل */}
        <button type="submit">Register</button>

        {/* عرض رسالة النجاح أو الخطأ */}
        {display && (
          <p className={`register-display ${display.includes('successful') ? 'success' : 'error'}`}>
            {display}
          </p>
        )}

        {/* رابط الانتقال إلى صفحة تسجيل الدخول */}
        <div className="register-link">
          Already have an account? <Link to="/login">Login here</Link>
        </div>
      </form>
    </div>
  );
};

export default Register;