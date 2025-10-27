"use client";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { SendHorizonal } from "lucide-react";
import DayItinerary, { DayPlan } from "../components/PlanTrip/Dayitienary";
import Overview from "../components/PlanTrip/Overview";
import HowToGetThere from "../components/PlanTrip/HowTogetthere";
import CheapestStay from "../components/PlanTrip/cheapeststay";

type TripPlanData = {
  place: string;
  country: string;
  overview: string;
  howToGetThere: string;
  cheapestStay: string;
  from?: string; // Optional origin
  departureDate?: string;
  days: DayPlan[];
};

type Flight = {
  price: string;
  currency: string;
  airline: string;
  duration: string;
  departure: { iataCode: string; at: string };
  arrival: { iataCode: string; at: string };
};

export default function TripPlanner() {
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [tripPlan, setTripPlan] = useState<TripPlanData | null>(null);
  const [flights, setFlights] = useState<Flight[]>([]);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    contentRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [tripPlan, loading]);

  useEffect(() => {
    const fetchFlights = async () => {
         if (!tripPlan?.place || !tripPlan?.from) return;

      try {
        const params = new URLSearchParams({
          destination: tripPlan.place,
        });

        if (tripPlan.from) params.append("origin", tripPlan.from);
        if (tripPlan.departureDate) params.append("departureDate", tripPlan.departureDate);

        const res = await fetch(`/api/flights?${params.toString()}`);
        if (!res.ok) throw new Error("Failed to fetch flights");

        const data = await res.json();
        setFlights(data.flights || []);
      } catch (err) {
        console.error("Error fetching flights:", err);
      }
    };

    fetchFlights();
  }, [tripPlan]);

  const handleSubmit = async () => {
    if (!inputValue.trim()) return;
    setLoading(true);
    setInputValue("");

    try {
      const res = await fetch("/api/plantrip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputValue }),
      });
      if (!res.ok) throw new Error("Request failed");

      const { reply } = await res.json();
      const cleaned = String(reply).replace(/```(?:json)?/g, "").trim();
      const parsed: TripPlanData = JSON.parse(cleaned);
      setTripPlan(parsed);
    } catch (err) {
      console.error(err);
      alert("Failed to generate trip plan. Try again!");
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col min-h-screen pt-16 md:pt-20">
      <div className="flex-1 overflow-y-auto px-4 md:px-6 py-6 flex flex-col gap-8">
        {!tripPlan && !loading && (
          <motion.p
            className="text-center mt-24 md:mt-32 font-semibold text-lg text-pretty bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400"
            animate={{ backgroundPosition: ["0%", "100%"] }}
            transition={{ duration: 5, repeat: Infinity, repeatType: "mirror" }}
            style={{ backgroundSize: "200% auto" }}
          >
            Hi there! Tell me your destination (and optionally, where you're traveling from)
            and I’ll create a full trip plan with day-wise costs and things to do.
          </motion.p>
        )}

        {tripPlan && (
          <>
            <Overview
              place={tripPlan.place}
              country={tripPlan.country}
              text={tripPlan.overview}
            />
            <HowToGetThere
              text={tripPlan.howToGetThere}
              origin={tripPlan.from || "Your location"}
              destination={tripPlan.place}
              departureDate={tripPlan.departureDate || "Flexible"}
            />

        

            <CheapestStay text={tripPlan.cheapestStay} />

            {tripPlan?.days && tripPlan.days.length > 0 ? (
              tripPlan.days.map((day, idx) => (
                <DayItinerary key={idx} dayPlan={day} />
              ))
            ) : (
              <p className="text-center text-muted-foreground">
                No day itinerary found.
              </p>
            )}
          </>
        )}

        {loading && (
          <div className="text-muted-foreground mt-4 text-center text-lg">
            🛫 Planning your trip...
          </div>
        )}
        <div ref={contentRef} />
      </div>

      <div className="sticky bottom-0 w-full flex justify-center bg-background/90 backdrop-blur-md border-t border-border shadow-inner py-4">
        <div className="flex items-center gap-3 w-full max-w-3xl px-4">
          <textarea
            className="flex-1 p-4 h-20 rounded-xl border border-input focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none bg-card text-foreground placeholder:text-muted-foreground"
            placeholder="Example: Plan a 5-day trip to Bali (or: Plan a 5-day trip to Bali from Delhi)"

            value={inputValue}
            
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" &&
              !e.shiftKey &&
              (e.preventDefault(), handleSubmit())
            }
          />
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="p-4 rounded-xl bg-primary text-primary-foreground font-semibold shadow hover:shadow-lg transition disabled:opacity-50 inline-flex items-center justify-center"
          >
            <SendHorizonal size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
