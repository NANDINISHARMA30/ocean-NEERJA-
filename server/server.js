// server.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Use node-fetch for Node <18, built-in fetch for Node >=18
let fetch;
try {
  fetch = global.fetch || require("node-fetch");
} catch (err) {
  console.error("Install node-fetch for Node <18: npm install node-fetch@2");
  process.exit(1);
}

// Routes
const authRoutes = require("./routes/auth");
const contactRoutes = require("./routes/contact");

const app = express();
const PORT = process.env.PORT || 5000;

// ----------------------
// Middleware
// ----------------------
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000", // ✅ default for dev
    credentials: true,
  })
);
app.use(express.json());

// ----------------------
// Auth & Contact Routes
// ----------------------
app.use("/api/auth", authRoutes);
app.use("/api/contact", contactRoutes);

// ----------------------
// Chatbot Route (Gemini)
// ----------------------
app.post("/api/chat", async (req, res) => {
  console.log("Incoming /api/chat request body:", req.body); // ✅ debug log

  const { message } = req.body;
  if (!message) {
    console.warn("⚠️ No message provided in request body!");
    return res.status(400).json({ error: "No message provided" });
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GOOGLE_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: message }],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const text = await response.text();
      console.error("❌ Gemini API error:", text);
      return res
        .status(500)
        .json({ error: "Gemini API failed", details: text });
    }

    const data = await response.json();
    console.log("Gemini raw response:", JSON.stringify(data, null, 2)); // ✅ debug log

    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response from Gemini";

    res.json({ reply });
  } catch (err) {
    console.error("❌ Fetch error:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

// ----------------------
// MongoDB Connection
// ----------------------
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully ✅");
  } catch (err) {
    console.error("MongoDB connection error ❌:", err);
    process.exit(1); // Exit if DB connection fails
  }
};

connectDB();

// ----------------------
// Global Error Handler
// ----------------------
app.use((err, req, res, next) => {
  console.error("Global error handler:", err);
  res
    .status(500)
    .json({ error: "Something went wrong!", details: err.message });
});

// ----------------------
// Start Server
// ----------------------
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
