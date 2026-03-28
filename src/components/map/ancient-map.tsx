"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

// Dynamic import to avoid SSR issues with Leaflet
import dynamic from "next/dynamic";

interface LocationPin {
  slug: string;
  title: string;
  label: string;
  lat: number;
  lng: number;
  sceneCount: number;
  era: string;
}

interface AncientMapProps {
  locations: LocationPin[];
}

const ERA_COLORS: Record<string, string> = {
  nativity: "#6BAE84",
  preparation: "#5B8FD4",
  galilean: "#A67EC8",
  confrontation: "#D4A853",
  passion: "#D4826B",
  resurrection: "#F5C842",
};

function MapInner({ locations }: AncientMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedPin, setSelectedPin] = useState<LocationPin | null>(null);
  const [L, setL] = useState<typeof import("leaflet") | null>(null);

  useEffect(() => {
    // Dynamic import Leaflet on client only
    import("leaflet").then((leaflet) => {
      setL(leaflet);
    });
  }, []);

  useEffect(() => {
    if (!L || !containerRef.current || mapRef.current) return;

    // Import leaflet CSS
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    document.head.appendChild(link);

    // Create map centered on Israel
    const map = L.map(containerRef.current, {
      center: [31.8, 35.2],
      zoom: 8,
      zoomControl: true,
      scrollWheelZoom: true,
      attributionControl: false,
    });

    // Use a muted/ancient-feeling tile layer
    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png",
      { maxZoom: 15 }
    ).addTo(map);

    // Add location pins
    locations.forEach((loc) => {
      const color = ERA_COLORS[loc.era] || "#C9A96E";

      const icon = L.divIcon({
        className: "custom-pin",
        html: `<div style="
          width: 14px; height: 14px; border-radius: 50%;
          background: ${color}; border: 2px solid white;
          box-shadow: 0 0 8px ${color}80;
          cursor: pointer;
        "></div>`,
        iconSize: [14, 14],
        iconAnchor: [7, 7],
      });

      const marker = L.marker([loc.lat, loc.lng], { icon }).addTo(map);

      marker.on("click", () => {
        setSelectedPin(loc);
        map.flyTo([loc.lat, loc.lng], 10, { duration: 0.5 });
      });
    });

    // Attribution
    L.control
      .attribution({ prefix: false })
      .addAttribution("Tiles &copy; CartoDB")
      .addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
      link.remove();
    };
  }, [L, locations]);

  return (
    <div className="relative">
      <div
        ref={containerRef}
        className="w-full h-[500px] rounded-lg overflow-hidden border"
        style={{ background: "#E8D5A3" }}
      />

      {/* Info panel */}
      <AnimatePresence>
        {selectedPin && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="absolute top-4 right-4 w-64 bg-surface/95 backdrop-blur-sm rounded-lg border shadow-lg p-4"
          >
            <button
              onClick={() => setSelectedPin(null)}
              className="absolute top-2 right-2 text-dim hover:text-parchment text-xs"
            >
              ×
            </button>
            <h3 className="font-heading text-sm text-parchment pr-4">
              {selectedPin.label}
            </h3>
            <p className="text-xs font-ui text-dim mt-1">
              {selectedPin.sceneCount} scene{selectedPin.sceneCount > 1 ? "s" : ""} at this location
            </p>
            <Link
              href={`/scene/${selectedPin.slug}`}
              className="inline-block mt-3 text-xs font-ui text-gold hover:underline"
            >
              View scene →
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mt-3 justify-center">
        {Object.entries(ERA_COLORS).map(([era, color]) => (
          <div key={era} className="flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: color }}
            />
            <span className="text-xs font-ui text-dim capitalize">{era}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Export as dynamic with no SSR
export const AncientMap = dynamic(() => Promise.resolve(MapInner), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[500px] rounded-lg border bg-surface flex items-center justify-center">
      <p className="text-dim font-ui text-sm">Loading map...</p>
    </div>
  ),
});
