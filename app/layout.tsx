import Navbar from "./components/Navbar";
import "./globals.css";

export const metadata = {
  title: "AI Travel Planner",
  description: "Plan trips smartly with AI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 font-inter">
        
        <Navbar />

        {/* Main content wrapper — TripAdvisor style */}
        <main className="pt-20 max-w-6xl mx-auto px-6">
          {children}
        </main>

      </body>
    </html>
  );
}
