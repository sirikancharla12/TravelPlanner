

"use client";
import { motion } from "framer-motion";
import DayCost from "./Daycost";

export type ThingsToDoType = {
  morning: string;
  afternoon: string;
  evening: string;
  totalCost: string;
};

interface ThingsToDoProps {
  things: ThingsToDoType;
}



export default function ThingsToDo({ things }: ThingsToDoProps) {
  const renderSentences = (text?: string) => {
    if (!text)
      return <p className="text-gray-400 italic">No activities available.</p>;

    return text.split(/(?<=[.!?])\s+/).map((sentence, idx) => (
      <p key={idx} className="mb-2 text-gray-700 leading-relaxed">
        {sentence}
      </p>
    ));
  };

  const timeBlocks = [
    { label: "🌅 Morning", text: things.morning, color: "from-yellow-50 to-yellow-100" },
    { label: "🌇 Afternoon", text: things.afternoon, color: "from-orange-50 to-orange-100" },
    { label: "🌃 Evening", text: things.evening, color: "from-indigo-50 to-indigo-100" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="mt-8 max-w-3xl mx-auto"
    >

      <div className="space-y-4">
        {timeBlocks.map((block, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1, duration: 0.5 }}
            className={`p-4 rounded-xl bg-gradient-to-r ${block.color} border border-gray-200 shadow-sm`}
          >
            <h4 className="text-lg font-semibold text-gray-900 mb-2">{block.label}</h4>
            {renderSentences(block.text)}
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="mt-6 p-4 rounded-xl bg-green-50 border border-green-200 flex items-center justify-between"
      >
        <span className="font-semibold text-gray-800">💰 Estimated Cost</span>
        <span className="text-green-700 font-bold"> {things.totalCost}</span>

      </motion.div>
    </motion.div>
  );
}
