export default function CategoryShowcase({ categories }: any) {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {categories.map((cat: any) => (
        <div
          key={cat.title}
          className="relative h-44 rounded-xl overflow-hidden shadow-lg cursor-pointer hover:scale-105 transition"
        >
          <img
            src={cat.image}
            alt={cat.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30" />
          <h3 className="relative z-10 text-white text-xl font-semibold p-4">
            {cat.title}
          </h3>
        </div>
      ))}
    </section>
  );
}
