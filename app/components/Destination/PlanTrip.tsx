import Link from "next/link";

export default function PlanTripCTA({ destination }: { destination: string }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <p className="font-medium text-lg">
          Ready to plan your trip to <span className="font-bold">{destination}</span>?
        </p>
        <Link
          href={`/plan?destination=${destination}`}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
        >
          Plan a Trip →
        </Link>
      </div>
    </div>
  );
}
