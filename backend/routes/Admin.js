const express = require("express");
const router = express.Router();
const { auth, isAdmin } = require("../midddlewares/auth"); // Assuming isAdmin middleware exists or I need to create/check it
const { getAdminStats, getAllUsers, deleteUser, deleteMessage } = require("../controllers/Admin");

router.get("/stats", auth, getAdminStats); // Add isAdmin later if needed
router.get("/users", auth, getAllUsers);
router.delete("/deleteUser", auth, deleteUser);
router.delete("/deleteMessage", auth, deleteMessage);

module.exports = router;
