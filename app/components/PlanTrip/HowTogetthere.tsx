"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, Navigation, Plane } from "lucide-react";
import FlightsData from "./FlightsData";

type Flight = {
  price: number;
  airline: string;
  departure: { iataCode: string };
  arrival: { iataCode: string };
  duration?: string;
  currency?: string;
  type?: "Domestic" | "International";
};

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

  const INDIAN_AIRLINES = ["AI", "6E", "SG", "G8", "UK"];

  useEffect(() => {
    async function fetchFlights() {
      try {
        if (!destination) return;
        setLoading(true);

        let query = `/api/flights?destination=${encodeURIComponent(
          destination
        )}&departureDate=${departureDate}`;

        if (origin && origin.toLowerCase() !== "your location") {
          query += `&origin=${encodeURIComponent(origin)}`;
        } else if (navigator.geolocation) {
          const pos = await new Promise<GeolocationPosition>((res, rej) =>
            navigator.geolocation.getCurrentPosition(res, rej)
          );
          query += `&lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`;
          setUserOrigin("Your current location");
        }

        const res = await fetch(query);
        const data = await res.json();

        if (res.status === 429) {
          console.warn("Rate limit hit, waiting 10 seconds...");
          setTimeout(fetchFlights, 10000);
          return;
        }

        const rawFlights = data.flights || data.data || data.results || [];
        if (rawFlights.length > 0) {
          const parsed = rawFlights.map((f: any) => ({
            price: f.price?.total || f.price || 0,
            airline: f.airline || f.carrierCode || "Unknown Airline",
            departure:
              f.departure ||
              f.itineraries?.[0]?.segments?.[0]?.departure || {
                iataCode: "N/A",
              },
            arrival:
              f.arrival ||
              f.itineraries?.[0]?.segments?.slice(-1)[0]?.arrival || {
                iataCode: "N/A",
              },
            duration: f.duration || f.itineraries?.[0]?.duration || "N/A",
            currency: f.currency || f.price?.currency || "INR",
            type: INDIAN_AIRLINES.includes(f.airline)
              ? "Domestic"
              : "International",
          }));
          parsed.sort((a: Flight, b: Flight) => a.price - b.price);

          setFlights(parsed);
        } else {
          console.warn("⚠️ No flights found in API response");
          setFlights([]);
        }
      } catch (error) {
        console.error("Flight fetch error:", error);
        setFlights([]);
      } finally {
        setLoading(false);
      }
    }

    fetchFlights();
  }, [origin, destination, departureDate]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="mt-8 p-6 rounded-2xl border border-gray-200 shadow-sm bg-gradient-to-r from-blue-50 to-indigo-50"
    >
      <div className="flex items-center gap-2 mb-3">
        <Navigation className="text-indigo-600" size={22} />
        <h3 className="text-xl font-semibold text-gray-900">
          How to Get There
        </h3>
      </div>

      <p className="text-gray-700 leading-relaxed">
        {text || (
          <span className="text-gray-400 italic">
            Travel details are not available.
          </span>
        )}
      </p>

      {userOrigin && (
        <p className="text-sm text-gray-500 mt-2 italic">
          Using {userOrigin} as origin
        </p>
      )}

      {/* Flights Display Section */}
      <div className="mt-6">
        <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-1">
          <Plane size={18} /> Available Flights
        </h4>
        <FlightsData flights={flights} loading={loading} />
      </div>
    </motion.div>
  );
}
