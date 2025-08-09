const { Sequelize } = require("sequelize");
const dotenv = require("dotenv");

dotenv.config();

const sequelize = new Sequelize(process.env.DB_NAME||"web", process.env.DB_USER||"root", process.env.DB_PASSWORD||"root", {
  host: process.env.DB_HOST,
  dialect: "mysql",
  logging: false, // set to console.log to debug
});

module.exports = sequelize;
