const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const connectDB = require("./DataBase/connectDB");

const flightRoutes = require("./Apis/Flightlists");

// Middlewares
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Routes
app.use("/api/flights", flightRoutes);

app.use("/api/users", require("./Apis/ProfileRoute"));

// Test route
app.get("/", (req, res) => {
  res.send("Server is running...");
});

connectDB().then(() => {
  app.listen(PORT, () => console.log(`🚀 Server on http://localhost:${PORT}`));
});
