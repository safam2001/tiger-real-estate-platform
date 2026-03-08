# 🏢 Tiger Real Estate Platform

A full-stack real estate management platform built with **Node.js + Express + PostgreSQL + Sequelize** on the backend and **React + Vite** on the frontend.  
The system provides a complete solution for managing real estate projects, units, bookings, payments, installments, and user/admin dashboards.

---

## 🚀 Features

### 🔹 User Features
- Browse real estate projects with images, videos, and maps
- View units with full details (price, area, bedrooms, bathrooms, images, videos)
- User authentication (JWT)
- User profile management
- Book units and manage bookings
- View installment plans and payment history
- Upload payment receipts
- Interactive maps (Leaflet)
- Image galleries and sliders
- Contact form

### 🔹 Admin Features
- Full admin dashboard
- Manage projects (create, update, delete)
- Manage units
- Manage users
- Manage bookings (approve, cancel, confirm, mark paid)
- Create installment plans
- Manage payments and approve receipts
- System statistics (users, bookings, payments, units)

---

## 🛠️ Tech Stack

### **Frontend**
- React
- Vite
- React Router
- Axios
- Leaflet Maps
- Chart.js
- React Slick / Image Gallery
- CSS Modules

### **Backend**
- Node.js
- Express.js
- PostgreSQL
- Sequelize ORM
- JWT Authentication
- Multer (file uploads)
- Nodemailer
- CORS

### **DevOps**
- Docker & Docker Compose
- Nginx (for frontend production)
- Concurrently (run both servers in development)

---

## 📁 Project Structure

### **Backend**

---

## 🔌 API Endpoints (Summary)

### **Auth**
- POST `/api/auth/register`
- POST `/api/auth/login`

### **Users**
- GET `/api/users` (admin)
- GET `/api/users/me`
- PUT `/api/users/me`
- PUT `/api/users/change-password`

### **Projects**
- GET `/api/projects`
- GET `/api/projects/:id`
- POST `/api/projects` (admin)
- PUT `/api/projects/:id` (admin)
- DELETE `/api/projects/:id` (admin)

### **Units**
- GET `/api/units`
- GET `/api/units/:id`
- POST `/api/units` (admin)
- PUT `/api/units/:id` (admin)
- DELETE `/api/units/:id` (admin)

### **Bookings**
- GET `/api/bookings` (admin)
- GET `/api/bookings/my` (user)
- POST `/api/bookings` (user)
- GET `/api/bookings/:id`
- PUT `/api/bookings/:id` (admin)
- DELETE `/api/bookings/:id` (admin)
- PUT `/api/bookings/:id/confirm` (admin)
- PUT `/api/bookings/:id/paid` (admin)

### **Installments**
- POST `/api/installments/:id/create-plan` (admin)
- GET `/api/installments/:id`
- PUT `/api/installments/pay/:id`
- PUT `/api/installments/installments/:id/confirm`

### **Payments**
- POST `/api/payments`
- POST `/api/payments/confirm`
- GET `/api/payments` (admin)
- PUT `/api/payments/approve/:paymentId` (admin)

---

## 🐳 Running the Project

### **Development Mode**

### **Production Mode (Docker)**

Frontend → http://localhost:5173  
Backend → http://localhost:5000

---

## 📌 Environment Variables (.env)





# 🏢 منصة تايغر العقارية | Tiger Real Estate Platform

منصة عقارية متكاملة مبنية باستخدام **Node.js + Express + PostgreSQL + Sequelize** في الباك‑إند، و **React + Vite** في الفرونت‑إند.  
توفّر المنصة نظامًا كاملًا لإدارة المشاريع والوحدات والحجوزات والمدفوعات وخطط الأقساط ولوحة تحكم للمستخدم والأدمن.

---

## 🚀 المميزات

### 🔹 مميزات المستخدم
- استعراض المشاريع العقارية مع الصور والفيديوهات والخرائط
- استعراض الوحدات مع التفاصيل الكاملة (السعر، المساحة، الغرف، الصور، الفيديو)
- تسجيل الدخول والتسجيل (JWT)
- إدارة الملف الشخصي
- حجز الوحدات وإدارة الحجوزات
- عرض خطط الأقساط والمدفوعات
- رفع إيصال الدفع
- خرائط تفاعلية (Leaflet)
- معرض صور وسلايدر
- صفحة تواصل معنا

### 🔹 مميزات الأدمن
- لوحة تحكم كاملة
- إدارة المشاريع (إضافة – تعديل – حذف)
- إدارة الوحدات
- إدارة المستخدمين
- إدارة الحجوزات (تأكيد – إلغاء – دفع – زيارة)
- إنشاء خطط الأقساط
- إدارة المدفوعات والموافقة على الإيصالات
- إحصائيات النظام

---

## 🛠️ التقنيات المستخدمة

### **الفرونت‑إند**
- React
- Vite
- React Router
- Axios
- Leaflet Maps
- Chart.js
- React Slick / Image Gallery
- CSS

### **الباك‑إند**
- Node.js
- Express.js
- PostgreSQL
- Sequelize ORM
- JWT
- Multer
- Nodemailer
- CORS

### **DevOps**
- Docker & Docker Compose
- Nginx
- Concurrently

---

## 📁 هيكلة المشروع

### **الباك‑إند**

---

## 🔌 ملخص الـ API

### **المصادقة**
- POST `/api/auth/register`
- POST `/api/auth/login`

### **المستخدمين**
- GET `/api/users` (أدمن)
- GET `/api/users/me`
- PUT `/api/users/me`
- PUT `/api/users/change-password`

### **المشاريع**
- GET `/api/projects`
- GET `/api/projects/:id`
- POST `/api/projects` (أدمن)
- PUT `/api/projects/:id` (أدمن)
- DELETE `/api/projects/:id` (أدمن)

### **الوحدات**
- GET `/api/units`
- GET `/api/units/:id`
- POST `/api/units` (أدمن)
- PUT `/api/units/:id` (أدمن)
- DELETE `/api/units/:id` (أدمن)

### **الحجوزات**
- GET `/api/bookings` (أدمن)
- GET `/api/bookings/my` (مستخدم)
- POST `/api/bookings` (مستخدم)
- GET `/api/bookings/:id`
- PUT `/api/bookings/:id` (أدمن)
- DELETE `/api/bookings/:id` (أدمن)
- PUT `/api/bookings/:id/confirm` (أدمن)
- PUT `/api/bookings/:id/paid` (أدمن)

### **الأقساط**
- POST `/api/installments/:id/create-plan` (أدمن)
- GET `/api/installments/:id`
- PUT `/api/installments/pay/:id`
- PUT `/api/installments/installments/:id/confirm`

### **المدفوعات**
- POST `/api/payments`
- POST `/api/payments/confirm`
- GET `/api/payments` (أدمن)
- PUT `/api/payments/approve/:paymentId` (أدمن)

---

## 🐳 تشغيل المشروع

### **وضع التطوير**

الفرونت‑إند → http://localhost:5173  
الباك‑إند → http://localhost:5000

---

## 📌 ملف البيئة (.env)