"use client";

import { Star, Sparkles, ArrowRight } from "lucide-react";

export default function DestinationHero({ overview }: any) {
  if (!overview) return null;

  return (
    <section className="pt-5 pb-6  ">
      <div className="max-w-7xl mx-auto px-6 space-y-4">

        <div className="text-sm text-gray-500">
          Home / Asia / India
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold">
              {overview.place},
              {overview.country}
            </h1>

            <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
              <span className="flex items-center gap-1 text-yellow-500">
                <Star className="w-4 h-4 fill-yellow-500" />
                <span className="font-semibold text-gray-800">{overview.rating}</span>
              </span>
              <span>• {overview.numberOfReviews} Reviews</span>
              <span className="text-green-600 font-medium">
                • {overview.trendRank}
              </span>
            </div>
          </div>

          <button className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg shadow hover:bg-blue-700 transition">
            Plan a Trip
            <ArrowRight size={16} />
          </button>
        </div>

        <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-lg p-4">
          <Sparkles className="text-blue-500 mt-1" size={18} />
          <p className="text-sm text-gray-700 leading-relaxed">
            <span className="font-semibold text-blue-600">AI Summary:</span>{" "}
            {overview.shortDescription}
          </p>
        </div>
      </div>
    </section>
  );
}
