const express = require("express");
const router = express.Router();

router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/dashboard", (req, res) => {
  res.render("dashboard");
});

router.get("/admin/destinations", (req, res) => {
  res.render("destinations");
});

router.get("/admin/categories", (req, res) => {
  res.render("categories");
});

router.get("/admin/api-keys", (req, res) => {
  res.render("api-keys");
});

router.get("/documentation", (req, res) => {
  res.render("documentation");
});
module.exports = router;