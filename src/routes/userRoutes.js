const express = require("express");
const router = express.Router();

const authenticate = require("../middleware/authMiddleware");

router.get("/profile", authenticate, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Protected route berhasil diakses.",
    user: req.user,
  });
});

module.exports = router;