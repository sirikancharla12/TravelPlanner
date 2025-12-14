const StatCard = ({ title, children }: any) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border">
    <h3 className="font-semibold text-lg mb-2">{title}</h3>
    {children}
  </div>
);

export default function DestinationStats({ stats }: any) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <StatCard title="⭐ Why Visit">
        <p className="text-gray-600">{stats.whyVisit}</p>
      </StatCard>

      <StatCard title="📅 Best Time to Visit">
        <p className="text-gray-600">{stats.bestTime}</p>
      </StatCard>

      <StatCard title="🌦 Weather Overview">
        <p className="text-gray-600">{stats.weather}</p>
      </StatCard>

      <StatCard title="💰 Budget Overview">
        <p className="text-gray-600">{stats.budget}</p>
      </StatCard>

      <StatCard title="🧳 Travel Tips">
        <ul className="text-gray-600 list-disc pl-5">
          {stats.tips.map((t: string, i: number) => (
            <li key={i}>{t}</li>
          ))}
        </ul>
      </StatCard>
    </section>
  );
}
