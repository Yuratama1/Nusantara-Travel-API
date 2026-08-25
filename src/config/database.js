const { Sequelize } = require("sequelize");

let sequelize;

if (process.env.DATABASE_URL) {
  // Production / Neon
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: "postgres",
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  });
} else {
  // Local PostgreSQL
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      dialect: "postgres",
      logging: false,
    }
  );
}

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate();

    console.log("PostgreSQL connected successfully.");

    console.log(
      process.env.DATABASE_URL
        ? "Database mode: Neon / Production"
        : "Database mode: Local PostgreSQL"
    );
  } catch (error) {
    console.error(
      "Unable to connect to PostgreSQL:",
      error.message
    );

    throw error;
  }
};

module.exports = {
  sequelize,
  connectToDatabase,
};