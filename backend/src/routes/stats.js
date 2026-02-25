const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
// const roleMiddleware= require("../middlewares/roleMiddleware");
const { getStats } = require("../controllers/statsController");
const{adminOnly}=require("../middlewares/roleMiddleware")
// إحصائيات المشروع (admin فقط)
router.get("/", authMiddleware, adminOnly, getStats);

module.exports = router;