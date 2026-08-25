const express = require("express");
const router = express.Router();
const usageLogger = require("../middleware/usageLoggerMiddleware");

const validateApiKey = require("../middleware/apiKeyMiddleware");

const {
  getAllDestinations,
  getDestinationById,
  searchDestinations,
} = require("../controllers/destinationController");

router.get(
  "/search",
  validateApiKey,
  usageLogger,
  searchDestinations
);

router.get(
  "/",
  validateApiKey,
  usageLogger,
  getAllDestinations
);

router.get(
  "/:id",
  validateApiKey,
  usageLogger,
  getDestinationById
);

module.exports = router;