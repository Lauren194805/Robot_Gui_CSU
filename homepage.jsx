import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet-kml";

export default function RobotGUI() {
  const [selectedMap, setSelectedMap] = useState("PointCloud");

  useEffect(() => {
    if (selectedMap === "GPS Tracking") {
      fetch("/your-map-file.kml")
        .then((res) => res.text())
        .then((kmlText) => {
          const parser = new DOMParser();
          const kml = parser.parseFromString(kmlText, "text/xml");
          const trackLayer = new L.KML(kml);
          trackLayer.addTo(window.map); // Adding to the Leaflet map instance
        })
        .catch((error) => console.error("Error loading KML:", error));
    }
  }, [selectedMap]);

  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      {/* Predefined Map */}
      <Card className="h-[400px]">
        <CardContent>
          <h2 className="text-xl font-bold">Desired Map</h2>
          <MapContainer center={[51.505, -0.09]} zoom={13} className="h-full w-full">
            <TileLayer url=map.PNG />
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
          <MapContainer center={[51.505, -0.09]} zoom={13} className="h-full w-full" whenCreated={(map) => (window.map = map)}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          </MapContainer>
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

