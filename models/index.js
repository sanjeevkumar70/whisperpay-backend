const sequelize = require("../config/db");
const User = require("./user");

const initDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("DB connected!");

    // Create tables if not exist
    await sequelize.sync({ alter: true });
    console.log("All models synced.");
  } catch (err) {
    console.error("DB connection error:", err);
  }
};

module.exports = {
  sequelize,
  User,
  initDB,
};
