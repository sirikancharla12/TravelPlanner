"use client";
import { motion } from "framer-motion";
import DayCost from "./Daycost";

export type ThingsToDoType = {
  morning: string;
  afternoon: string;
  evening: string;
  dayCost:string
};

export default function ThingsToDo({ things }: { things: ThingsToDoType }) {
  const renderSentences = (text: string) =>
    text.split(/(?<=[.!?])\s+/).map((sentence, idx) => (
      <p key={idx} className="mb-2">
        {sentence}
      </p>
    ));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="mt-8 max-w-3xl mx-auto px-4"
    >
      <h3 className="text-2xl font-semibold text-gray-900 mb-4">Things to Do</h3>

      <div className="mb-4">
        <h4 className="text-xl font-medium text-gray-800 mb-2">🌅 Morning</h4>
        {renderSentences(things.morning)}
      </div>

      <div className="mb-4">
        <h4 className="text-xl font-medium text-gray-800 mb-2">🌇 Afternoon</h4>
        {renderSentences(things.afternoon)}
      </div>

      <div className="mb-4">
        <h4 className="text-xl font-medium text-gray-800 mb-2">🌃 Evening</h4>
        {renderSentences(things.evening)}
      </div>

      <div className="mb-4">
        <DayCost cost={things.dayCost} />
      </div>
    </motion.div>
  );
}
