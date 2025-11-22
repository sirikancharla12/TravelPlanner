"use client";
export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full h-16 bg-white/80 backdrop-blur-md border-b border-gray-200 flex items-center justify-between px-6 z-50">
      <h1 className="font-bold text-lg bg-gradient-to-r from-blue-600 to-indigo-500 text-transparent bg-clip-text">
        AI Travel Planner
      </h1>
    </nav>
  );
}
