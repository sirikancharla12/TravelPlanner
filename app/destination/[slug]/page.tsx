import CategoryShowcase from "@/app/components/Destination/Category";
import DestinationHero from "@/app/components/Destination/Hero";
import DestinationMap from "@/app/components/Destination/Map";
import PlanTripCTA from "@/app/components/Destination/PlanTrip";
import DestinationStats from "@/app/components/Destination/Stats";
import DestinationTabs from "@/app/components/Destination/Tabs";


// Mock AI/DB data (later you’ll load from API/AI)
const destinationData = {
  slug: "goa",
  name: "Goa",
  country: "India",
  rating: 4.8,
  reviews: "12k Reviews",
  trending: "#1 Trending in Beach Destinations",
  summary:
    "Goa is a kaleidoscopic blend of Indian and Portuguese cultures, sweetened with sun, sea, sand, seafood, and spirituality.",
  categories: [
    { title: "Beaches", image: "/destinations/goa/beach.jpg" },
    { title: "History & Culture", image: "/destinations/goa/culture.jpg" },
    { title: "Nightlife", image: "/destinations/goa/nightlife.jpg" },
    { title: "Food", image: "/destinations/goa/food.jpg" },
  ],
  stats: {
    whyVisit:
      "Perfect mix of beaches, nightlife, culture, and relaxation.",
    bestTime: "Nov – Feb",
    weather: "28°C avg / Humidity 76%",
    budget: "$$ (₹2500-₹5000 per day)",
    tips: ["Carry cash", "Rent a scooter", "Visit off-peak times"],
  },
  mapCoords: { lat: 15.2993, lng: 74.1240 },
};

export default function DestinationPage() {
  return (
    <main className="space-y-12 pb-32">
      <DestinationHero destination={destinationData} />

      <div className="max-w-7xl mx-auto px-6 space-y-10">
        <CategoryShowcase categories={destinationData.categories} />

        <DestinationStats stats={destinationData.stats} />

        <DestinationMap coords={destinationData.mapCoords} />

        <DestinationTabs destination={destinationData} />
      </div>

      <PlanTripCTA destination={destinationData.name} />
    </main>
  );
}
