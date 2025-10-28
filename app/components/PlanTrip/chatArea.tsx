"use client";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { SendHorizonal, Sparkles } from "lucide-react";
import DayItinerary, { DayPlan } from "./Dayitienary";
import Overview from "./Overview";
import HowToGetThere from "./HowTogetthere";
import CheapestStay from "./cheapeststay";

type TripPlanData = {
  place: string;
  country: string;
  overview: string;
  howToGetThere: string;
  cheapestStay: string;
  from?: string;
  departureDate?: string;
  days: DayPlan[];
};

type Message = {
  role: "user" | "assistant";
  type?: "text" | "plan";
  content: string | TripPlanData;
};

export default function TripPlanner({
  initialMessages = [],
  onMessagesChange ,
}: {
  initialMessages: Message[];
  onMessagesChange: (updatedMessages: Message[]) => void;
}) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    contentRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    onMessagesChange(messages);
  }, [messages]);

  const handleSubmit = async () => {
    if (!inputValue.trim()) return;
    const userMessage: Message = { role: "user", type: "text", content: inputValue };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setLoading(true);

    try {
      const res = await axios.post("/api/plantrip", { text: inputValue, previousMessages: messages });
      const { reply } = res.data;
      const cleaned = String(reply).replace(/```(?:json)?/g, "").trim();

      let parsed: TripPlanData | null = null;
      try {
        parsed = JSON.parse(cleaned);
      } catch {
        console.error("Parse error");
      }

      const assistantMessage: Message = {
        role: "assistant",
        type: parsed ? "plan" : "text",
        content: parsed || cleaned,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };




  return (
    <div className="flex-1 relative bg-[var(--color-bg-default)] overflow-y-auto px-4 md:px-8 pt-8 pb-40 flex flex-col gap-8 max-h-full">
      {messages.length === 0 && !loading && (
        <motion.div
          className="flex flex-col items-center text-center mt-24 md:mt-32 gap-4"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <Sparkles size={40} className="text-[var(--color-primary)]" />
          <h1 className="text-2xl md:text-3xl font-semibold text-[var(--color-heading)]">
            Plan your next adventure effortlessly ✈️
          </h1>
          <p className="max-w-xl text-[var(--color-small)] text-base">
            Tell me where you want to go (and optionally from where),
            and I’ll create a complete day-wise plan for you.
          </p>
        </motion.div>
      )}

      <div className="flex flex-col gap-10 items-center">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`w-full flex ${
              msg.role === "user" ? "justify-end" : "justify-center"
            }`}
          >
            {msg.role === "user" && (
              <div className="bg-[var(--color-primary)] text-white px-5 py-3 rounded-2xl max-w-xl shadow-md text-base">
                {typeof msg.content === "string" ? msg.content : JSON.stringify(msg.content)}
              </div>
            )}

            {msg.role === "assistant" && msg.type === "plan" && typeof msg.content !== "string" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className=" w-full max-w-4xl p-8 space-y-10"
              >
                <Overview
                  place={msg.content.place}
                  country={msg.content.country}
                  text={msg.content.overview}
                />

                <HowToGetThere
                  text={msg.content.howToGetThere}
                  origin={msg.content.from || "Your location"}
                  destination={msg.content.place}
                  departureDate={msg.content.departureDate || "Flexible"}
                />

                <CheapestStay text={msg.content.cheapestStay} />

                {msg.content.days?.length > 0 ? (
                  <div className="space-y-8">
                    {msg.content.days.map((day, idx) => (
                      <DayItinerary key={idx} dayPlan={day} />
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500">No day itinerary found.</p>
                )}
              </motion.div>
            )}

            {msg.role === "assistant" && msg.type === "text" && typeof msg.content === "string" && (
              <div className="bg-gray-100 border border-gray-200 text-gray-800 px-5 py-4 rounded-2xl max-w-2xl shadow-sm text-base leading-relaxed">
                {msg.content}
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-center justify-center text-[var(--color-small)] text-lg mt-6">
            <motion.span
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              Planning your trip...
            </motion.span>
          </div>
        )}

        <div ref={contentRef} />
      </div>

      <div className="fixed bottom-0 left-64 right-0 bg-[var(--color-bg-default)] border-t border-gray-200 py-4 shadow-lg z-50">
        <div className="flex items-center gap-3 w-full max-w-3xl mx-auto px-4">
          <textarea
            className="flex-1 p-4 h-20 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] resize-none text-[var(--color-heading)] placeholder:text-[var(--color-small)]"
            placeholder={
              messages.length
                ? "Refine your trip: e.g. 'Add water activities on Day 2'"
                : "Example: Plan a 4-day trip to Japan from Mumbai"
            }
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
          />
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="p-4 rounded-2xl bg-[var(--color-primary)] text-white font-semibold shadow hover:shadow-lg transition disabled:opacity-50"
          >
            <SendHorizonal size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
