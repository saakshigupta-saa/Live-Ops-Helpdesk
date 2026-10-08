const express = require("express");
const cors = require("cors");
const path = require("path");

const ticketRoutes = require("./routes/ticketRoutes");

const app = express();

// =================================
// MIDDLEWARE
// =================================

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5000",
  })
);

app.use(express.json());

// =================================
// API ROUTES
// =================================

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Live Ops Helpdesk API is running",
  });
});

app.use("/api/tickets", ticketRoutes);

// =================================
// FRONTEND
// =================================

app.use(
  express.static(
    path.join(__dirname, "client")
  )
);

// =================================
// FRONTEND FALLBACK
// =================================

app.get("/", (req, res) => {
  res.sendFile(
    path.join(
      __dirname,
      "client",
      "index.html"
    )
  );
});

module.exports = app;