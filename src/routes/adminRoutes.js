const express = require("express");
const router = express.Router();

const authenticate = require("../middleware/authMiddleware");

const {
  createDestination,
  updateDestination,
  deleteDestination,
} = require("../controllers/destinationController");

router.post("/destinations", authenticate, createDestination);

router.put("/destinations/:id", authenticate, updateDestination);

router.delete("/destinations/:id", authenticate, deleteDestination);

const {
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");

router.post("/categories", authenticate, createCategory);

router.put("/categories/:id", authenticate, updateCategory);

router.delete("/categories/:id", authenticate, deleteCategory);

const {
  getApiUsage,
} = require("../controllers/usageController");

router.get("/usage", authenticate, getApiUsage);

const {
  getDashboardStats,
} = require("../controllers/dashboardController");

router.get(
  "/dashboard",
  authenticate,
  getDashboardStats
);

module.exports = router;