import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import decisionRoutes from "./routes/decisionRoutes.js";

// Load environment variables FIRST
dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// ✅ Middleware
app.use(cors());
app.use(express.json()); // already correct

// ✅ Debug middleware (VERY IMPORTANT for your error)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/decision", decisionRoutes);

// ✅ Test route
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

// ✅ Global error handler (helps debugging)
app.use((err, req, res, next) => {
  console.error("ERROR:", err);
  res.status(500).json({ msg: "Server error" });
});

// Port config
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});