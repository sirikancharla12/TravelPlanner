"use client";
import { useState } from "react";

const TABS = [
  "Explore All",
  "Beaches",
  "Landmarks",
  "Hotels",
  "Restaurants",
];

export default function DestinationTabs({ destination }: any) {
  const [active, setActive] = useState(TABS[0]);

  return (
    <section>
      {/* Tab Buttons */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            className={`px-4 py-2 rounded-full ${
              active === tab ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
            } transition`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Placeholder content */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <p className="text-gray-700">
          {active} for {destination.name} will be shown here.
        </p>
      </div>
    </section>
  );
}
