"use client";
import React, { useState } from "react";
import axios from "axios";

type Activity = {
  time?: string;
  activity: string;
  cost?: string;
  image?: string;
};

type DayPlan = {
  day: string;
  title: string;
  description: string;
  activities: Activity[];
};

export default function ChatPlanner() {
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [tripPlan, setTripPlan] = useState<DayPlan[]>([]);

  const handleSubmit = async () => {
    if (!inputValue.trim()) return;

    setLoading(true);
    try {
      const res = await axios.post("/api/plantrip", { text: inputValue });
      let data = res.data.reply;

      // Strip Markdown ```json wrapper
      const cleaned = data.replace(/```(?:json)?/g, "").trim();

      // Parse JSON
      const parsed = JSON.parse(cleaned);

      // Extract itinerary array
      const plan: DayPlan[] = (parsed.itinerary || []).map((day: any) => ({
        day: `Day ${day.day}`,
        title: day.title || "",
        description: day.description || "",
        activities: Array.isArray(day.activities) ? day.activities : [],
      }));

      setTripPlan(plan);
    } catch (err) {
      console.error(err);
      alert("Failed to generate trip plan. Try again!");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 p-4">
      {!tripPlan.length && (
        <>
          <textarea
            className="w-full max-w-2xl p-4 rounded-lg border focus:outline-none focus:ring-2 focus:ring-orange-400 shadow-md"
            placeholder="Type your trip details here, e.g., 'Plan a 3-day trip to Goa…'"
            rows={5}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button
            className="mt-4 px-6 py-2 rounded-lg bg-[var(--color-primary)] text-white font-medium hover:bg-orange-500 transition"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Planning..." : "Plan Trip"}
          </button>
        </>
      )}

      {tripPlan.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Your Trip Itinerary</h2>
          {tripPlan.map((day, idx) => (
            <div key={idx} className="mb-6 border rounded-lg p-4 shadow-sm bg-white">
              <h3 className="font-semibold text-xl mb-2">
                {day.day}: {day.title}
              </h3>
              <p className="text-gray-700 mb-2">{day.description}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(day.activities || []).map((act, i) => (
                  <div key={i} className="border rounded-md p-2 flex gap-2 items-center bg-gray-50">
                    {act.image && (
                      <img src={act.image} alt={act.activity} className="w-16 h-16 object-cover rounded-md" />
                    )}
                    <div>
                      <p className="text-sm font-medium">{act.activity}</p>
                      {act.time && <p className="text-xs text-gray-500">{act.time}</p>}
                      {act.cost && <p className="text-xs text-gray-500">{act.cost}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
