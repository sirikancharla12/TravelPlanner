"use client";

import { Star, Sparkles, ArrowRight } from "lucide-react";

export default function DestinationHero({ overview }: any) {
  if (!overview) return null;

  return (
    <section className="pt-5 pb-6">
      <div className="max-w-7xl mx-auto px-6 space-y-6">

        {/* Breadcrumb */}
        <div className="text-sm text-gray-500">
          Home / Asia / India
        </div>

        {/* Title + AI Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

          {/* LEFT: Title + Rating */}
          <div className="lg:col-span-2 space-y-3">
            <h1 className="text-4xl font-bold">
              {overview.place}, {overview.country}
            </h1>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="flex items-center gap-1 text-yellow-500">
                <Star className="w-4 h-4 fill-yellow-500" />
                <span className="font-semibold text-gray-800">
                  {overview.rating}
                </span>
              </span>
              <span>• {overview.numberOfReviews} Reviews</span>
              <span className="text-green-600 font-medium">
                • {overview.trendRank}
              </span>
            </div>

            {/* CTA */}
            <button className="mt-2 inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg shadow hover:bg-blue-700 transition">
              Plan a Trip
              <ArrowRight size={16} />
            </button>
          </div>

          {/* RIGHT: AI Summary */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <Sparkles className="text-blue-500 mt-1" size={18} />
              <div>
                <p className="text-xs font-semibold text-blue-600 uppercase">
                  AI Travel Summary
                </p>
                <p className="text-sm text-gray-700 leading-relaxed mt-1">
                  {overview.shortDescription}
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
