const app = require("./app");
const { connectToDatabase, sequelize } = require("./config/database");

// Import semua model dan relationship
require("./models");

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await connectToDatabase();

    await sequelize.sync();

    console.log("Database synchronized.");

    app.listen(PORT, () => {
      console.log(`Server berjalan di http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();