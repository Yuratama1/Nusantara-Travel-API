const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");

require("dotenv").config();
const {notFound, errorHandler,} = require("./middleware/errorMiddleware");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const apiKeyRoutes = require("./routes/apiKeyRoutes");
const destinationRoutes = require("./routes/destinationRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

app.set("view engine", "ejs");

app.set(
  "views",
  path.join(__dirname, "views")
);

app.use(
  express.static(
    path.join(__dirname, "../public")
  )
);

const webRoutes = require("./routes/webRoutes");

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/keys", apiKeyRoutes);;

app.use("/api/v1/destinations", destinationRoutes);
app.use("/api/v1/categories", categoryRoutes);

app.use("/api/admin", adminRoutes);

app.use("/", webRoutes);

app.use(notFound);
app.use(errorHandler);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to Nusantara Travel API",
  });
});

app.use("/api/auth", authRoutes);

module.exports = app;