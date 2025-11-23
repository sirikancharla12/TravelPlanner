"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";

export default function TripPage() {
  const params = useParams();
  const slug = params?.slug;
  const decodedSlug = typeof slug === "string" ? decodeURIComponent(slug) : "";
  const [tab, setTab] = useState("overview");
  const [image, setImage] = useState<string | null>(null);
  const [destination, setDestination] = useState("");
  const [loading, setLoading] = useState(false);
  const [savedTrip, setSavedTrip] = useState<any | null>(null);

  useEffect(() => {
    if (!decodedSlug) return;

    const isNumericId = /^\d+$/.test(decodedSlug);

    const fetchData = async () => {
      try {
        setLoading(true);
        if (isNumericId) {
          const res = await axios.get(`/api/trips/get?id=${decodedSlug}`);
          setSavedTrip(res.data.trip || null);
          if (res.data.trip?.itinerary?.destination) {
            setDestination(res.data.trip.itinerary.destination);
          } else {
            setDestination(res.data.trip?.title || "");
          }
          setImage(res.data.trip?.image || null);
        } else {
          const res = await axios.post("/api/plantrip", { destination: decodedSlug });
          setImage(res.data.image);
          setDestination(res.data.destination);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [decodedSlug]);

  return (
    <div className="flex h-screen mt-20">
      {/* Sidebar */}
      <aside className="w-40 bg-gray-100 p-4 flex flex-col gap-2">
        {["overview", "flights", "hotels", "plan"].map((item) => (
          <button
            key={item}
            onClick={() => setTab(item)}
            className={`p-2 rounded ${tab === item ? "bg-orange-500 text-white" : "bg-white text-gray-700"}`}
          >
            {item.charAt(0).toUpperCase() + item.slice(1)}
          </button>
        ))}
      </aside>

      {/* Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        {loading && <p>Loading...</p>}

        {tab === "overview" && image && (
          <div>
            <img
              src={image}
              alt={destination}
              className="w-[50%] h-[400px] rounded-lg shadow-md object-cover"
            />
            <h1 className="text-2xl font-bold mt-4">{destination}</h1>
            {savedTrip && (
              <div className="mt-2 text-sm text-gray-600">
                <p>Saved Trip: {savedTrip.title}</p>
                <p>From: {savedTrip.fromLocation || "—"} • To: {savedTrip.toLocation || "—"}</p>
              </div>
            )}
          </div>
        )}

        {tab === "flights" && <p>✈️ Flights info coming soon...</p>}
        {tab === "hotels" && <p>🏨 Hotels info coming soon...</p>}
        {tab === "plan" && <p>🗓️ Travel itinerary based on your trip details...</p>}
      </main>
    </div>
  );
}
