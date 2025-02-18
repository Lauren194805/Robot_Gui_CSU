const express = require("express");
const path = require("path");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;

// Serve static files (index.html, CSS, JS)
app.use(express.static(path.join(__dirname, "public")));

// Mock GPS Tracking Data (Replace with real GPS device API)
let gpsData = { lat: 37.7749, lng: -122.4194 }; // Default: San Francisco

// GPS Tracking API
app.get("/api/gps", (req, res) => {
  res.json(gpsData);
});

// Simulate real-time GPS updates every 3 seconds
setInterval(() => {
  gpsData.lat += (Math.random() - 0.5) * 0.0005; // Simulate movement
  gpsData.lng += (Math.random() - 0.5) * 0.0005;
  io.emit("gpsUpdate", gpsData);
}, 3000);

// WebSocket for real-time GPS tracking
io.on("connection", (socket) => {
  console.log("New client connected");
  socket.emit("gpsUpdate", gpsData);

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// Live Camera Feed API (Simulated)
app.get("/api/camera", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "camera.html"));
});

// Start server
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
