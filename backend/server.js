const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend files from public folder
app.use(express.static(path.join(__dirname, "public")));

// PostgreSQL connection using DATABASE_URL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Test DB connection
pool.query("SELECT NOW()", (err, result) => {
  if (err) {
    console.error("PostgreSQL connection error:", err);
  } else {
    console.log("PostgreSQL connected at:", result.rows[0].now);
  }
});

// Root route - serve portfolio page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Contact form route
app.post("/contact", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email) {
    return res.status(400).json({
      message: "Name and email are required",
    });
  }

  try {
    const result = await pool.query(
      "INSERT INTO messages (name, email, message) VALUES ($1, $2, $3) RETURNING *",
      [name, email, message]
    );

    res.status(201).json({
      message: "Message saved successfully!",
      data: result.rows[0],
    });
  } catch (err) {
    console.error("Error saving message:", err);
    res.status(500).json({
      message: "Server error",
    });
  }
});

// Optional: handle unknown routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});