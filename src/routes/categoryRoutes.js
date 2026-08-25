const express = require("express");
const router = express.Router();

const validateApiKey = require("../middleware/apiKeyMiddleware");
const usageLogger = require("../middleware/usageLoggerMiddleware");

const {
  getAllCategories,
} = require("../controllers/categoryController");

router.get(
  "/",
  validateApiKey,
  usageLogger,
  getAllCategories
);

module.exports = router;