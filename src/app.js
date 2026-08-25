const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");

require("dotenv").config();

const {
  notFound,
  errorHandler,
} = require("./middleware/errorMiddleware");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const apiKeyRoutes = require("./routes/apiKeyRoutes");
const destinationRoutes = require("./routes/destinationRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const adminRoutes = require("./routes/adminRoutes");
const webRoutes = require("./routes/webRoutes");

const app = express();

// View Engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Static Files
app.use(
  express.static(
    path.join(__dirname, "../public")
  )
);

// Global Middleware
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root API Test
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to Nusantara Travel API",
  });
});

// Authentication
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// API Key Management
app.use("/api/keys", apiKeyRoutes);

// Public SaaS API
app.use(
  "/api/v1/destinations",
  destinationRoutes
);

app.use(
  "/api/v1/categories",
  categoryRoutes
);

// Admin API
app.use("/api/admin", adminRoutes);

// Web Dashboard
app.use("/", webRoutes);

// Error Handler
app.use(notFound);
app.use(errorHandler);

module.exports = app;