const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");         // <-- import cors
const authRoutes = require("./routes/authRoutes");
const { initDB } = require("./models");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());                      // <-- enable CORS for all origins
app.use(express.json());

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => res.send("API running..."));

initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });
});
