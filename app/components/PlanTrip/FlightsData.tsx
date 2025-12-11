"use client";
import { Plane } from "lucide-react";

// Matches the Backend API response structure
export type Flight = {
  id: string;
  price: string | number;
  currency: string;
  airlineCode: string;
  airlineName: string;
  flightNumber: string;
  duration: string;
  departure: {
    iataCode: string;
    city: string;
    at: string; 
  };
  arrival: {
    iataCode: string;
    city: string;
    at: string;
  };
};

type FlightsDataProps = {
  flights: Flight[];
  loading: boolean;
};

export default function FlightsData({ flights, loading }: FlightsDataProps) {
  const formatTime = (isoString?: string) => {
    if (!isoString) return "--:--";
    return isoString.split("T")[1].slice(0, 5);
  };

  const formatDuration = (dur?: string) => {
    if (!dur) return "";
    return dur.replace("PT", "").toLowerCase();
  };

  if (loading) {
    return (
      <div className="p-8 text-center bg-white rounded-xl border border-gray-200 shadow-sm animate-pulse">
        <p className="text-gray-500 font-medium">✈️ Finding best fares...</p>
      </div>
    );
  }

  if (!flights || flights.length === 0) {
    return (
      <div className="p-6 text-center bg-gray-50 rounded-xl border border-dashed border-gray-300">
        <p className="text-gray-500">No flights found for this route.</p>
      </div>
    );
  }

  const cheapest = flights.slice(0, 5);

  return (
    <div className="space-y-4 w-full">
      {cheapest.map((f, i) => (
        <div
          key={f.id}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow duration-200"
        >
          {i === 0 && (
            <div className="mb-3">
              <span className="bg-orange-50 text-orange-700 text-xs font-bold px-2 py-1 rounded-md border border-orange-100 uppercase tracking-wide">
                Best Value
              </span>
            </div>
          )}

          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            
            {/* Airline Info */}
            <div className="flex items-center gap-3 w-full md:w-1/4">
              <div className="w-10 h-10 bg-white rounded-md flex items-center justify-center border border-gray-100 p-1 shrink-0 overflow-hidden">
                <img 
                  src={`https://pics.avs.io/60/60/${f.airlineCode}.png`} 
                  alt={f.airlineName}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                    (e.target as HTMLImageElement).parentElement!.innerText = f.airlineCode;
                  }}
                />
              </div>
              <div>
                <p className="font-bold text-gray-900 text-sm">{f.airlineName}</p>
                <p className="text-xs text-gray-500">{f.airlineCode}-{f.flightNumber}</p>
              </div>
            </div>

            {/* Schedule */}
            <div className="flex items-center justify-between w-full md:w-2/4 px-2">
              <div className="text-left">
                <p className="text-xl font-bold text-gray-800">{formatTime(f.departure.at)}</p>
                <p className="text-xs font-medium text-gray-500">{f.departure.city}</p>
              </div>

              <div className="flex flex-col items-center w-full px-4">
                <p className="text-xs text-gray-500 mb-1">{formatDuration(f.duration)}</p>
                <div className="w-full h-[2px] bg-green-400 relative">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">Non stop</p>
              </div>

              <div className="text-right">
                <p className="text-xl font-bold text-gray-800">{formatTime(f.arrival.at)}</p>
                <p className="text-xs font-medium text-gray-500">{f.arrival.city}</p>
              </div>
            </div>

            {/* Price */}
            <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-1/4 gap-2 md:gap-1 pl-4 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0">
              <p className="text-xl font-bold text-gray-900">
                {f.currency} {Number(f.price).toLocaleString("en-IN")}
              </p>
              <p className="text-xs text-gray-500 mb-2">per adult</p>
              
              <button className="px-5 py-1.5 rounded-full border border-blue-500 text-blue-600 font-bold text-xs uppercase hover:bg-blue-50 transition-colors w-full md:w-auto">
                View Prices
              </button>
            </div>
          </div>
          
          <div className="mt-4 pt-3 border-t border-dashed border-gray-200">
             <p className="text-xs text-gray-500 flex items-center gap-1">
               <span className="w-2 h-2 rounded-full bg-red-400 inline-block"></span>
               FLAT ₹ 380 OFF using <span className="font-bold text-gray-700">MMTSUPER</span>
             </p>
          </div>
        </div>
      ))}
    </div>
  );
}