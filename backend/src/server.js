// back-end/src/app.js
const express = require('express');
require('./config/database')
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Route تجريبي
// app.get('/api/test', (req, res) => {
//   res.json({ message: "Back-end works!" });
// });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));