import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import apiRouter from "./router/api.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json({ limit: "20mb" }));

const port = process.env.PORT || 3000;



app.use("/api", apiRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({
    message: "Internal server error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
