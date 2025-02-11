import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function RobotGUI() {
  const [selectedMap, setSelectedMap] = useState("PointCloud");

  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      {/* Predefined Map */}
      <Card className="h-[400px]">
        <CardContent>
          <h2 className="text-xl font-bold">Desired Map</h2>
          <MapContainer center={[51.505, -0.09]} zoom={13} className="h-full w-full">
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          </MapContainer>
        </CardContent>
      </Card>

      {/* Selectable Map */}
      <Card className="h-[400px]">
        <CardContent>
          <h2 className="text-xl font-bold">Selectable Map</h2>
          <div className="flex space-x-2 mb-2">
            <Button onClick={() => setSelectedMap("PointCloud")}>PointCloud</Button>
            <Button onClick={() => setSelectedMap("GPS Tracking")}>GPS Tracking</Button>
            <Button onClick={() => setSelectedMap("Active Map")}>Active Map</Button>
          </div>
          {selectedMap === "PointCloud" && <p>Displaying PointCloud Map...</p>}
          {selectedMap === "GPS Tracking" && <p>Displaying GPS Tracking...</p>}
          {selectedMap === "Active Map" && <p>Displaying Active Map...</p>}
        </CardContent>
      </Card>

      {/* Live Camera Feed */}
      <Card className="col-span-2 h-[300px]">
        <CardContent>
          <h2 className="text-xl font-bold">Live Camera Feed</h2>
          <img src="http://your-robot-ip:port/video_feed" alt="Live Feed" className="w-full h-full object-cover" />
        </CardContent>
      </Card>

      {/* Agricultural Functions */}
      <Card className="col-span-2">
        <CardContent>
          <h2 className="text-xl font-bold">Agricultural Functions</h2>
          <div className="flex space-x-4">
            <Button>Plowing</Button>
            <Button>Seeding</Button>
            <Button>Soil Monitoring</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
