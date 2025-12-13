import { Search } from "lucide-react";

export default function Searchtrip() {
  return (
    <div className="text-center max-w-3xl mx-auto space-y-6">

     

      {/* Heading */}
      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
        Plan your perfect trip <br />
        with AI assistance
      </h1>

      {/* Subtitle */}
      <p className="text-gray-600 max-w-xl mx-auto">
        Discover destinations, build smart itineraries, and explore the world
        in seconds with your personal travel assistant.
      </p>

      {/* Search bar */}
      <div className="flex items-center bg-white rounded-xl shadow-lg overflow-hidden max-w-2xl mx-auto">
        <div className="px-4 text-gray-400">
          <Search size={18} />
        </div>
        <input
          type="text"
          placeholder="Where do you want to go? (e.g. Goa, Paris, Bali)"
          className="flex-1 py-4 px-2 outline-none text-gray-700"
        />
        <button className="bg-blue-600 text-white px-6 py-3 rounded-xl m-1 hover:bg-blue-700 transition">
          Explore
        </button>
      </div>

      {/* Popular chips */}
      <div className="flex flex-wrap justify-center gap-3 pt-2 text-sm">
        {["Beach", "Mountains", "Weekend trip", "Budget friendly"].map(
          (item) => (
            <span
              key={item}
              className="px-4 py-2 bg-white/80 rounded-full shadow text-gray-700 cursor-pointer hover:bg-white"
            >
              {item}
            </span>
          )
        )}
      </div>
    </div>
  );
}
