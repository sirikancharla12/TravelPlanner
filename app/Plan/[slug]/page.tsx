"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import { getAuth } from "firebase/auth";

export default function TripPage() {
  const params = useParams();
  const slug = params?.slug;
  const decodedSlug = typeof slug === "string" ? decodeURIComponent(slug) : "";

  const [tab, setTab] = useState("overview");
  const [image, setImage] = useState<string | null>(null);
  const [destination, setDestination] = useState("");
  const [loading, setLoading] = useState(false);
  const [savedTrip, setSavedTrip] = useState<any | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false); // UI flag if trip is persisted

  useEffect(() => {
    if (!decodedSlug) return;

    const isNumericId = /^\d+$/.test(decodedSlug);

    const fetchData = async () => {
      try {
        setLoading(true);
        if (isNumericId) {
          // load saved trip by id
          const res = await axios.get(`/api/trips/get?id=${decodedSlug}`);
          setSavedTrip(res.data.trip || null);
          const destinationFromTrip =
            res.data.trip?.itinerary?.destination ?? res.data.trip?.title ?? "";
          setDestination(destinationFromTrip);
          setImage(res.data.trip?.image || null);
          setIsSaved(Boolean(res.data.trip)); // mark as saved if found
        } else {
          // AI generate plan for a destination slug (not a numeric saved id)
          const res = await axios.post("/api/plantrip", { destination: decodedSlug });
          setImage(res.data.image);
          setDestination(res.data.destination);
          setSavedTrip(null);
          setIsSaved(false);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [decodedSlug]);

  // Build payload for saving — uses savedTrip if present, else uses info from the generated plan response
  // For generated plans we assume backend expects itinerary in the same shape your save endpoint expects.
  const buildSavePayload = () => {
    // If savedTrip already loaded, send its canonical shape (and include chatId if present)
    if (savedTrip) {
      return {
        title: savedTrip.title || `${destination}`,
        itinerary: savedTrip.itinerary ?? {},
        fromLocation: savedTrip.fromLocation ?? null,
        toLocation: savedTrip.toLocation ?? (savedTrip.itinerary?.destination ?? destination) ?? null,
        date: savedTrip.date ?? null,
        chatId: savedTrip.chatId ?? savedTrip.chat?.id ?? null,
      };
    }

    // Otherwise ask the server to plan (we already called /api/plantrip earlier and got the image + destination).
    // If your /api/plantrip returns the full itinerary, you can store it locally and send here.
    // Fallback: save minimal info (title + destination) so backend will create a chat and trip record.
    return {
      title: destination || `Trip ${new Date().toLocaleString()}`,
      itinerary: { destination }, // minimal itinerary; ideally replace with real generated itinerary
      fromLocation: null,
      toLocation: destination || null,
      date: null,
      chatId: null,
    };
  };

  const handleSave = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        alert("Please sign in to save trips.");
        return;
      }

      const payload = buildSavePayload();

      setIsSaving(true);

      const token = await user.getIdToken();
      const res = await fetch("/api/trips/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ uid: user.uid, ...payload }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Save failed");
      }

      const json = await res.json();

      if (json?.alreadyExists) {
        // server says trip exists — adopt the returned trip as current savedTrip
        setSavedTrip(json.trip);
        setIsSaved(true);
        alert("This trip already exists in your saved trips. It has been selected.");
      } else {
        // created new trip
        setSavedTrip(json.trip);
        setIsSaved(true);
        alert("Trip saved successfully!");
      }
    } catch (err: any) {
      console.error("save error", err);
      alert("Failed to save trip: " + (err?.message ?? err));
    } finally {
      setIsSaving(false);
    }
  };

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
      <main className="flex-1 p-6 overflow-y-auto relative">
        {/* Page header with Save button */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">{destination || "Trip"}</h1>
            {savedTrip && <p className="text-sm text-gray-500 mt-1">{savedTrip.title ?? ""}</p>}
          </div>

          <div className="flex items-center gap-3">
            {/* Show Save button when there is something to save (either generated plan or trip loaded but not saved) */}
            <button
              onClick={handleSave}
              disabled={isSaving || isSaved}
              className={`px-4 py-2 rounded-md  font-medium shadow ${
                isSaved ? "bg-green-400 text-white cursor-default" : " bg-[#f55612] text-white hover:bg-[#e34c10]"
              }`}
            >
              {isSaving ? "Saving..." : isSaved ? "Saved" : "Save"}
            </button>
          </div>
        </div>

        {loading && <p>Loading...</p>}

        {tab === "overview" && image && (
          <div>
            <img src={image} alt={destination} className="w-[50%] h-[400px] rounded-lg shadow-md object-cover" />
            <h2 className="text-xl font-semibold mt-4">{destination}</h2>

            {savedTrip && (
              <div className="mt-2 text-sm text-gray-600">
                <p>Saved Trip: {savedTrip.title}</p>
                <p>
                  From: {savedTrip.fromLocation || "—"} • To: {savedTrip.toLocation || "—"}
                </p>
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
