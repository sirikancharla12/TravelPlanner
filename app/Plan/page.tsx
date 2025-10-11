

"use client";
import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { SendHorizonal } from "lucide-react";

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
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [tripPlan, loading]);

  const handleSubmit = async () => {
    if (!inputValue.trim()) return;
    setLoading(true);

    try {
      const res = await axios.post("/api/plantrip", { text: inputValue });
      let data = res.data.reply;

      // Clean Markdown-style JSON
      const cleaned = data.replace(/```(?:json)?/g, "").trim();
      const parsed = JSON.parse(cleaned);

      const plan: DayPlan[] = (parsed.itinerary || []).map((day: any) => ({
        day: `Day ${day.day}`,
        title: day.title || "",
        description: day.description || "",
        activities: Array.isArray(day.activities) ? day.activities : [],
      }));

      setTripPlan(plan);
      setInputValue("");
    } catch (err) {
      console.error(err);
      alert("Failed to generate trip plan. Try again!");
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 pt-20">
      {/* Chat Section */}
      <div className="flex-1 overflow-y-auto px-4 py-6 flex flex-col items-center space-y-6">
        {tripPlan.length === 0 && !loading && (
          <p className="text-center text-gray-400 mt-32">
            ✈️ Start by typing your trip details below...
          </p>
        )}

        {tripPlan.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full max-w-2xl space-y-6"
          >
            {tripPlan.map((day, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="border border-gray-200 bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition"
              >
                <h3 className="font-semibold text-xl text-orange-600 mb-2">
                  {day.day}: {day.title}
                </h3>
                <p className="text-gray-700 mb-4">{day.description}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {day.activities.map((act, i) => (
                    <div
                      key={i}
                      className="border rounded-xl p-3 flex gap-3 items-center bg-gray-50 hover:bg-gray-100 transition"
                    >
                      {act.image && (
                        <img
                          src={act.image}
                          alt={act.activity}
                          className="w-16 h-16 object-cover rounded-lg shadow-sm"
                        />
                      )}
                      <div>
                        <p className="font-medium text-gray-800">{act.activity}</p>
                        {act.time && <p className="text-xs text-gray-500">{act.time}</p>}
                        {act.cost && <p className="text-xs text-gray-500">{act.cost}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {loading && (
          <div className="text-center text-gray-500 mt-6">Planning your trip...</div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Fixed Input Bar */}
      <div className="sticky bottom-0 w-full flex justify-center bg-white/90 backdrop-blur-md border-t border-gray-200 shadow-inner py-4">
        <div className="flex items-center gap-3 w-full max-w-2xl px-4">
          <textarea
            className="flex-1 p-4 h-20 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none text-gray-700"
            placeholder="Type your trip details here... ✈️"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSubmit()}
          />
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="p-4 rounded-xl bg-gradient-to-r from-orange-400 to-pink-500 text-white font-semibold shadow hover:shadow-lg transition disabled:opacity-50"
          >
            <SendHorizonal size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
