"use client";

import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";

interface SavedTrip {
  id: number;
  title?: string;
  itinerary?: any;
  fromLocation?: string | null;
  toLocation?: string | null;
  date?: string | null;
}

export default function TripsPage() {
  const [trips, setTrips] = useState<SavedTrip[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const auth = getAuth();
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        setTrips([]);
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/trips/list?uid=${currentUser.uid}`);
        if (!res.ok) throw new Error("Failed to load saved trips");
        const json = await res.json();
        setTrips(json.trips || []);
      } catch (err) {
        console.warn("fetch saved trips error", err);
        setTrips([]);
      } finally {
        setLoading(false);
      }
    });

    return () => unsub();
  }, []);

  if (!user) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <p className="text-gray-600">
          Please login to view your saved trips.
        </p>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen bg-[var(--color-bg-default)]">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold mb-4">Saved Trips</h1>

        {loading ? (
          <p className="text-gray-600">Loading your trips...</p>
        ) : trips.length === 0 ? (
          <p className="text-gray-500 italic">
            No saved trips yet. Go to <span className="font-semibold">Plan a Trip</span> and save one!
          </p>
        ) : (
          <div className="space-y-4">
            {trips.map((trip) => (
              <div
                key={trip.id}
                className="rounded-lg border border-gray-200 bg-white shadow-sm p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <h2 className="font-semibold text-lg">
                    {trip.title || `Trip ${trip.id}`}
                  </h2>
                  {trip.date && (
                    <span className="text-xs text-gray-500">
                      {String(trip.date)}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600">
                  {trip.fromLocation && trip.toLocation
                    ? `${trip.fromLocation} → ${trip.toLocation}`
                    : "Custom itinerary"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
