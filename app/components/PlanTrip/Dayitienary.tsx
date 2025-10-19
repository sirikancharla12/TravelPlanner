

"use client";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import ThingsToDo, { ThingsToDoType } from "./Thingstodo";

export type DayPlan = {
  day: string;
  title: string;
  overview: string;
  thingsToDo: ThingsToDoType;
  totalCost?: string;
};

export default function DayItinerary({ dayPlan }: { dayPlan: DayPlan }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 overflow-hidden"
    >
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-gray-200">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-blue-600 font-bold text-lg">
            Day {dayPlan.day}
          </span>
          <ArrowRight size={16} className="text-gray-400" />
          <h3 className="text-2xl font-bold text-gray-900">
            {dayPlan.title}
          </h3>
        </div>
        <p className="text-gray-600 text-sm">{dayPlan.overview}</p>
      </div>

      <div className="p-6">
        <h4 className="text-sm font-semibold text-gray-700 uppercase mb-4">
          Plan for the Day
        </h4>
        <ThingsToDo things={dayPlan.thingsToDo} />
        {dayPlan.totalCost && (
          <div className="mt-6 border-t pt-3 text-gray-800 text-sm">
            💰 <span className="font-medium">Total Cost:</span>{" "}
            {dayPlan.totalCost}
          </div>
        )}
      </div>
    </motion.div>
  );
}
