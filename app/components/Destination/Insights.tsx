const Card = ({ title, value }: any) => (
  <div className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-md transition">
    <h3 className="font-semibold text-lg mb-2">{title}</h3>
    <p className="text-gray-600 text-sm leading-relaxed">{value}</p>
  </div>
);

export default function DestinationInsights({ insights }: any) {
  return (
    <section className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card title="⭐ Why Visit This Place" value={insights.whyVisit} />
      <Card title="📅 Best Time to Visit" value={insights.bestTime} />
      <Card title="🌦 Weather Overview" value={insights.weather} />
      <Card title="🏖 Top Attractions" value={insights.attractions} />
      <Card title="🍴 Food & Culture" value={insights.food} />
      <Card title="💰 Budget Overview" value={insights.budget} />
      <Card title="🧳 Travel Tips" value={insights.tips} />
    </section>
  );
}
