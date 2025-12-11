"use client";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { MapPin, Navigation, Plane } from "lucide-react";
import FlightsData, { Flight } from "./FlightsData"; 

type Props = {
  text: string;
  origin?: string;
  destination?: string;
  departureDate?: string;
};

export default function HowToGetThere({
  text,
  origin,
  destination,
  departureDate = new Date().toISOString().split("T")[0],
}: Props) {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(false);
  const [userOrigin, setUserOrigin] = useState<string | null>(null);
  const searchIdRef = useRef(0);

  useEffect(() => {
    if (!destination) return;

    const currentSearchId = ++searchIdRef.current;

    async function executeSearch(url: string) {
      try {
        setLoading(true);
        const res = await fetch(url);

        if (currentSearchId !== searchIdRef.current) return;

        const data = await res.json();
        if (data.flights && Array.isArray(data.flights)) {
          setFlights(data.flights);
        } else {
          setFlights([]);
        }
      } catch (err) {
        console.error("Flight fetch error:", err);
        if (currentSearchId === searchIdRef.current) setFlights([]);
      } finally {
        if (currentSearchId === searchIdRef.current) setLoading(false);
      }
    }

    const base = `/api/flights?destination=${encodeURIComponent(
      destination
    )}&departureDate=${departureDate}`;

    if (origin && origin.trim() !== "") {
      setUserOrigin(null); // we're using explicit origin, not geo
      executeSearch(`${base}&origin=${encodeURIComponent(origin)}`);
      return;
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          if (currentSearchId !== searchIdRef.current) return;
          setUserOrigin("your current location");
          const url = `${base}&lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`;
          executeSearch(url);
        },
        (err) => {
          console.warn("Geolocation denied/failed: ", err);
          setFlights([]);
        }
      );
    } else {
      setFlights([]);
    }
  }, [origin, destination, departureDate]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="mt-8"
    >
      <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-xl mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Navigation className="text-indigo-600" size={22} />
          <h3 className="text-xl font-semibold text-gray-900">How to Get There</h3>
        </div>

        <p className="text-gray-700 leading-relaxed">
          {text || (
            <span className="text-gray-400 italic">
              Travel details are not available.
            </span>
          )}
        </p>

        {userOrigin && (
          <p className="text-sm text-gray-500 mt-2 italic flex items-center gap-1">
            <MapPin size={14} /> Using {userOrigin} as origin
          </p>
        )}
      </div>

      <div className="mt-6">
        <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2 text-lg">
          <Plane size={20} className="text-indigo-600" /> Available Flights
        </h4>
        <FlightsData flights={flights} loading={loading} />
      </div>
    </motion.div>
  );
}
