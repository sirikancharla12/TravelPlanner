"use client";
import { Star } from "lucide-react";

export default function DestinationHero({ destination }: any) {
  return (
    <section className="pt-24 pb-8 bg-gradient-to-b from-blue-100 to-transparent">
      <div className="max-w-7xl mx-auto px-6">
        {/* Title + Ratings */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold">
            {destination.name}, {destination.country}
          </h1>
          <div className="flex justify-center items-center gap-2 text-gray-600">
            <Star className="text-yellow-500" />{" "}
            <span className="font-semibold">{destination.rating}</span>
            <span>• {destination.reviews}</span>
            <span>• {destination.trending}</span>
          </div>

          <p className="mt-4 max-w-3xl mx-auto text-gray-700 text-lg">
            {destination.summary}
          </p>
        </div>
      </div>
    </section>
  );
}
