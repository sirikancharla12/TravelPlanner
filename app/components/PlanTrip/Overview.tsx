"use client";
import { motion } from "framer-motion";

export default function Overview({
  place,
  country,
  text,
}: {
  place?: string;
  country?: string;
  text: string;
}) {
  const hasLocation = place && country;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="mt-10 max-w-3xl mx-auto px-4"
    >
      {hasLocation && (
        <div className="text-center mb-3">
          <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 tracking-tight">
            {place}, <span className="text-blue-600">{country}</span>
          </h2>
        </div>
      )}

      <p className="text-gray-700 text-lg leading-relaxed text-justify">
        {text}
      </p>
    </motion.div>
  );
}
