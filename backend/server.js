
require("dotenv").config();
const express = require('express');
const cors = require('cors');

//  تعريف sequelize 
const sequelize = require('./src/config/database');

const app = express();
app.use(cors());
app.use(express.json());


app.use("/uploads", express.static("uploads"));
// 2استدعاء الـ routes
app.use("/api/auth", require("./src/routes/authRoutes"));
app.use("/api/users", require("./src/routes/users"));

app.use("/api/bookings", require("./src/routes/bookings"));
app.use("/api/units", require("./src/routes/units"));
 app.use("/api/projects", require("./src/routes/projects"));
app.use("/api/payments", require("./src/routes/payments"));
app.use("/api/stats", require("./src/routes/stats"));
app.use("/api/installments", require("./src/routes/installments"));



// 3️⃣ مزامنة الجداول وتشغيل السيرفر
const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await sequelize.sync({ alter: true }); // إنشاء/تعديل الجداول
    console.log("✅ Database synced");

    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error("❌ DB error:", err); // لو حصل خطأ في الاتصال بالقاعدة
    process.exit(1);
  }
})();