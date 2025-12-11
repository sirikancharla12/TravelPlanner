"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Trip = {
  id: number;
  title: string;
  from?: string;
  to?: string;
  date?: string;
  notes?: string;
};

export default function SavedTripsPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Trip | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uid, setUid] = useState<string | null>(null);

  const router = useRouter();

  const computeTitle = (t: Partial<Trip>) => {
    const hasTitle = typeof t.title === "string" && t.title.trim().length > 0;
    if (hasTitle) return t.title!.trim();
    const from = (t.from || "Unknown").trim();
    const to = (t.to || "Unknown").trim();
    return `${from} → ${to}`;
  };

  useEffect(() => {
    let mounted = true;
    import("../../lib/firebase").then(({ auth }) => {
      const unsubscribe = (auth as any)?.onAuthStateChanged?.((user: any) => {
        if (!mounted) return;
        setUid(user?.uid ?? null);
      });
      return () => { mounted = false; unsubscribe && unsubscribe(); };
    }).catch(() => { /* ignore */ });
  }, []);

  const loadTrips = async () => {
    try {
      setLoading(true);
      setError(null);
      if (!uid) {
        setTrips([]);
        setLoading(false);
        return;
      }

      const res = await fetch(`/api/trips/list?uid=${encodeURIComponent(uid)}`);
      if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
      const json = await res.json();

const mapped = (json.trips || []).map((t: any) => {
  const from = (t.fromLocation ?? t.from ?? "").toString().trim();
  const to = (t.toLocation ?? t.to ?? "").toString().trim();
  const titleFromServer = (t.title ?? "").toString().trim();

  const trip: Trip = {
    id: t.id,
    title: titleFromServer || (from || to ? `${from || "Unknown"} → ${to || "Unknown"}` : "Untitled Trip"),
    from,
    to,
    date: t.date ?? "",
    notes: t.notes ?? "",
  };
  return trip;
});


      setTrips(mapped);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to load trips");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (uid) loadTrips();
  }, [uid]);

  const openTrip = (id: number) => {
    const trip = trips.find((t) => t.id === id) || null;
    setSelected(trip);
  };

  const deleteTrip = async (id: number) => {
    try {
      const prev = trips;
      setTrips((p) => p.filter((t) => t.id !== id));
      setConfirmDeleteId(null);
      if (selected?.id === id) setSelected(null);

      // Delete not yet implemented 
      await new Promise((r) => setTimeout(r, 200));
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Delete failed");
      await loadTrips();
    }
  };

  const filtered = trips.filter((t) =>
    (t.title + " " + (t.from || "") + " " + (t.to || "")).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#FFF7F4] pt-24 pb-12">
      <div className="max-w-6xl mx-auto px-6">
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[var(--color-primary)]">Saved Trips</h1>
            <p className="text-sm text-gray-600">All your saved trip plans in one place.</p>
          </div>

          <div className="flex items-center gap-3">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search trips..."
              className="px-3 py-2 border rounded-md text-sm w-64"
            />
            <a
              href="/Plan"
              className="bg-[#f55612] hover:bg-[#e34c10] text-white px-4 py-2 rounded-md text-sm font-semibold"
            >
              + New Trip
            </a>
          </div>
        </header>

        <main className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <section className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-4">
              {loading ? (
                <div className="py-20 text-center text-gray-500">Loading trips…</div>
              ) : error ? (
                <div className="py-10 text-center text-red-500">{error}</div>
              ) : filtered.length === 0 ? (
                <div className="py-20 text-center text-gray-500">No saved trips found.</div>
              ) : (
                <ul className="space-y-3">
                  {filtered.map((t) => (
                    <li key={t.id} className="flex items-start justify-between p-3 rounded-md hover:bg-gray-50">
                      <div className="flex-1">
                        <button onClick={() => openTrip(t.id)} className="text-left w-full">
                          <h3 className="font-semibold text-lg text-gray-800 truncate">{t.title}</h3>
                          <div className="text-sm text-gray-500">{t.from} → {t.to}</div>
                        </button>
                      </div>

                      <div className="ml-3 flex items-center gap-2">
                        <a href={`/saved-trips/${t.id}`} className="text-sm text-blue-600">Open</a>
                        <button
                          onClick={() => setConfirmDeleteId(t.id)}
                          className="text-sm text-red-500"
                          aria-label={`Delete ${t.title}`}
                        >
                          Delete
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>

          <aside className="bg-white rounded-lg shadow-sm p-4">
            {selected ? (
              <div>
                <h2 className="font-semibold text-xl mb-1">{selected.title}</h2>
                <div className="text-sm text-gray-600 mb-3">{selected.from} → {selected.to}</div>
                <div className="text-sm text-gray-700 mb-2"><strong>Date:</strong> {selected.date}</div>
                <div className="text-sm text-gray-700 mb-4"><strong>Notes:</strong> {selected.notes}</div>
                <div className="flex gap-2">
                  <a href={`/saved-trips/${selected.id}`} className="px-3 py-2 bg-[#f55612] text-white rounded-md text-sm">Open Trip</a>
                  <button onClick={() => setConfirmDeleteId(selected.id)} className="px-3 py-2 border rounded-md text-sm text-red-500">Delete</button>
                </div>
              </div>
            ) : (
              <div className="text-gray-500">Select a trip to view details.</div>
            )}
          </aside>
        </main>

        {confirmDeleteId && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-2">Delete trip?</h3>
              <p className="text-sm text-gray-600 mb-4">Are you sure you want to delete this trip? This action cannot be undone.</p>
              <div className="flex justify-end gap-3">
                <button onClick={() => setConfirmDeleteId(null)} className="px-3 py-2 rounded-md border">Cancel</button>
                <button onClick={() => deleteTrip(confirmDeleteId!)} className="px-3 py-2 rounded-md bg-red-600 text-white">Delete</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
