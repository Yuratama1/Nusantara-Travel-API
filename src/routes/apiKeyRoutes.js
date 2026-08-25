const express = require("express");
const router = express.Router();

const authenticate = require("../middleware/authMiddleware");

const {
  createApiKey,
  getMyApiKeys,
  deleteApiKey,
} = require("../controllers/apiKeyController");

// Buat API Key
router.post("/", authenticate, createApiKey);

// Lihat semua API Key milik user yang login
router.get("/", authenticate, getMyApiKeys);

// Hapus API Key
router.delete("/:id", authenticate, deleteApiKey);

module.exports = router;