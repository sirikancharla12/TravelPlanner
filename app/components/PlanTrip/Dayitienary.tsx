"use client";
import { motion } from "framer-motion";
import ThingsToDo, { ThingsToDoType } from "./Thingstodo";

export type DayPlan = {
  day: string;
  title: string;
  overview: string;
  thingsToDo: ThingsToDoType;
};

export default function DayItinerary({ dayPlan }: { dayPlan: DayPlan }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="mt-8 max-w-3xl mx-auto px-4"
    //   style={{ fontFamily: "'Segoe UI', sans-serif" }}
    >
      <h2 className="text-2xl font-bold mb-4 text-gray-900">
        {dayPlan.day} - {dayPlan.title}
      </h2>

      <ThingsToDo things={dayPlan.thingsToDo} />
    </motion.div>
  );
}
