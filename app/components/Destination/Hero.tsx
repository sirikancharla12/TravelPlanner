"use client";

import { Star, Sparkles, CalendarCheck2, X } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function DestinationHero({
  overview,
  slug,
}: {
  overview: any;
  slug: string;
}) {
  const [open, setOpen] = useState(false);
  const [prompt, setPrompt] = useState(
    `Create a 5 day friends trip to ${slug}`
  );
  const [loading, setLoading] = useState(false);

  const router = useRouter();

const handleGeneratePlan = async () => {
  try {
    setLoading(true);

    const res = await axios.post("/api/plantrip", {
      text: prompt,
      previousMessages: [],
    });

    localStorage.setItem(
      "pending_trip_chat",
      JSON.stringify({
        title: `Trip to ${slug}`,
        messages: [
          {
            role: "assistant",
            content: res.data.reply,
          },
        ],
      })
    );

    router.push("/Plan"); 
  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
    setOpen(false);
  }
};


  if (!overview) return null;

  return (
    <>
      <section className="pt-5 pb-6">
        <div className="max-w-7xl mx-auto px-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            <div className="lg:col-span-2 space-y-3">
              <h1 className="text-4xl font-bold">
                {overview.place}, {overview.country}
              </h1>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Star className="w-4 h-4 fill-yellow-500" />
                {overview.rating} • {overview.numberOfReviews} Reviews
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setOpen(true)}
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-full hover:bg-blue-700 transition"
              >
                <CalendarCheck2 size={16} />
                Plan a Trip
              </button>
            </div>
          </div>

          <div className="bg-blue-50 border rounded-xl p-4">
            <Sparkles className="inline mr-2 text-blue-500" />
            {overview.shortDescription}
          </div>
        </div>
      </section>

      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-lg p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Plan your trip</h2>
              <X
                className="cursor-pointer"
                onClick={() => setOpen(false)}
              />
            </div>

            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full h-32 p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              onClick={handleGeneratePlan}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
            >
              {loading ? "Generating..." : "Generate Trip Plan"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
