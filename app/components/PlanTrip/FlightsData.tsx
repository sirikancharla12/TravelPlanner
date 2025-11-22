"use client";
import { Plane } from "lucide-react";

type Flight = {
  price: number;
  airline: string;
  departure: { iataCode: string };
  arrival: { iataCode: string };
  duration?: string;
  currency?: string;
  type?: "Domestic" | "International";
};

type FlightsDataProps = {
  flights: Flight[];
  loading: boolean;
};

export default function FlightsData({ flights, loading }: FlightsDataProps) {
  if (loading) {
    return <p className="text-gray-500">✈️ Fetching flights...</p>;
  }

  if (!flights || flights.length === 0) {
    return <p className="text-gray-500">No flights found for this route.</p>;
  }

  // 🧠 Prioritize Domestic first, then International
  const domestic = flights.filter((f) => f.type === "Domestic");
  const international = flights.filter((f) => f.type === "International");

  // 🪙 Combine them (Domestic first)
  const sorted = [...domestic, ...international];

  // 💸 Sort by cheapest
  const cheapest = sorted
    .sort((a, b) => a.price - b.price)
    .slice(0, 4); // show top 4 cheapest flights

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-xl shadow-md border border-gray-200">
        <h2 className="text-lg font-semibold mb-3 text-indigo-700 flex items-center gap-2">
          <Plane size={18} /> ✈️ Cheapest Flights
        </h2>

        <ul className="space-y-3">
          {cheapest.map((f, i) => (
            <li
              key={i}
              className="border border-indigo-100 p-3 rounded-lg bg-gradient-to-r from-indigo-50 to-blue-50 flex justify-between items-center"
            >
              <div>
                <p className="font-semibold text-gray-800">
                  {f.airline} — {f.departure.iataCode} → {f.arrival.iataCode}
                </p>
                <p className="text-sm text-gray-600">
                  {f.type === "Domestic" ? "🇮🇳 Domestic" : "🌍 International"} •{" "}
                  Duration: {f.duration || "N/A"}
                </p>
              </div>

              <span className="font-bold text-indigo-700">
                {f.currency || "₹"} {f.price.toLocaleString("en-IN")}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
