"use client";

import DestinationHero from "@/app/components/Destination/Hero";
import { use } from "react";
import { useEffect, useState } from "react";

export default function ExplorePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const decodedSlug = decodeURIComponent(slug);

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExplore = async () => {
      const res = await fetch("/api/explore", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: decodedSlug }),
      });

      const json = await res.json();
      setData(json);
      setLoading(false);
    };

    fetchExplore();
  }, [decodedSlug]);

  if (loading) return <p className="p-6">Loading...</p>;
  if (!data) return <p>Error loading destination</p>;

  return (
    <>
      <DestinationHero overview={data.overview} slug={decodedSlug} />

        <div className="max-w-6xl mx-auto p-6 space-y-12">
        <section>
          <h2 className="text-2xl font-semibold mb-2">Best Time to Visit</h2>
          <p className="text-gray-700">
            <strong>{data.bestTimeToVisit?.months}</strong> —{" "}
            {data.bestTimeToVisit?.reason}
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Top Attractions</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.attractions?.map((place: any, i: number) => (
              <div
                key={i}
                className="border rounded-2xl p-5 shadow-sm"
              >
                <h3 className="font-semibold text-lg">{place.name}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {place.description}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  {place.type} • {place.recommendedDuration}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Local Cuisine</h2>
          <ul className="list-disc pl-5 space-y-2">
            {data.localCuisine?.dishes?.map((dish: any, i: number) => (
              <li key={i}>
                <strong>{dish.name}</strong> — {dish.description}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Travel Tips</h2>
          <ul className="list-disc pl-5 space-y-1">
            {data.travelTips?.general?.map((tip: string, i: number) => (
              <li key={i}>{tip}</li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}
