const express = require("express");
const path = require("path");
const http = require("http");
const socketIo = require("socket.io");
const { SerialPort, ReadlineParser } = require("serialport");
const WebSocket = require("ws");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;

// Serve static files (index.html, CSS, JS)
app.use(express.static(path.join(__dirname, "public")));

// Default GPS Data (Fallback)
let gpsData = { lat: 33.5944181, lng: -84.3284513 };

// 📍 1️⃣ CONNECT TO GPS SENSOR (SERIAL PORT)
const gpsPort = new SerialPort({
  path: "/dev/ttyUSB0", // Adjust for your system (e.g., COM3 on Windows)
  baudRate: 9600
});

const gpsParser = gpsPort.pipe(new ReadlineParser({ delimiter: "\r\n" }));

gpsParser.on("data", (data) => {
  if (data.startsWith("$GPGGA")) { // Extract latitude & longitude from NMEA sentences
    const gpsInfo = parseNMEA(data);
    if (gpsInfo) {
      gpsData.lat = gpsInfo.latitude;
      gpsData.lng = gpsInfo.longitude;
      io.emit("gpsUpdate", gpsData);
    }
  }
});

// Function to parse NMEA GPS data
function parseNMEA(nmeaSentence) {
  const parts = nmeaSentence.split(",");
  if (parts.length < 6) return null;

  const latitude = convertNMEAToDecimal(parts[2], parts[3]);
  const longitude = convertNMEAToDecimal(parts[4], parts[5]);

  return { latitude, longitude };
}

// Convert NMEA format to decimal degrees
function convertNMEAToDecimal(coord, direction) {
  const degrees = parseInt(coord.slice(0, -7), 10);
  const minutes = parseFloat(coord.slice(-7)) / 60;
  let decimal = degrees + minutes;
  if (direction === "S" || direction === "W") decimal *= -1;
  return decimal;
}

// GPS API Endpoint
app.get("/api/gps", (req, res) => {
  res.json(gpsData);
});

// 🛰️ 2️⃣ CONNECT TO LiDAR SENSOR (SERIAL PORT)
const lidarPort = new SerialPort({
  path: "/dev/ttyUSB1", // Adjust for your system
  baudRate: 230400 // Check the baud rate in your LiDAR manual
});

lidarPort.on("data", (data) => {
  try {
    const lidarPoint = parseLiDARData(data);
    io.emit("lidarUpdate", lidarPoint);
  } catch (err) {
    console.error("Error parsing LiDAR data:", err);
  }
});

// Function to parse LiDAR data (Modify based on your LiDAR output format)
function parseLiDARData(rawData) {
  // Assume LiDAR sends JSON: { "x": 1.23, "y": 2.34, "z": 0.56 }
  return JSON.parse(rawData.toString());
}

// LiDAR API Endpoint
app.get("/api/lidar", (req, res) => {
  res.json({ message: "LiDAR data streaming via WebSocket" });
});

// 🔗 3️⃣ CONNECT TO LiDAR VIA WEBSOCKET (If running on another device)
const lidarSocket = new WebSocket("ws://192.168.1.100:8765"); // Adjust with LiDAR server IP

lidarSocket.on("message", (event) => {
  try {
    const lidarPoint = JSON.parse(event);
    io.emit("lidarUpdate", lidarPoint);
  } catch (err) {
    console.error("Error parsing WebSocket LiDAR data:", err);
  }
});

// 🖥️ 4️⃣ HANDLE CLIENT CONNECTIONS
io.on("connection", (socket) => {
  console.log("New client connected");

  socket.emit("gpsUpdate", gpsData); // Send initial GPS data
  socket.emit("lidarUpdate", { message: "LiDAR is streaming" });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// 🚀 5️⃣ START SERVER
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
