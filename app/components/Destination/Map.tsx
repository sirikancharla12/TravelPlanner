"use client";

export default function DestinationMap({ coords }: any) {
  return (
    <section className="h-72 rounded-xl overflow-hidden shadow-lg">
      <iframe
        className="w-full h-full"
        loading="lazy"
        allowFullScreen
        src={`https://maps.google.com/maps?q=${coords.lat},${coords.lng}&z=12&output=embed`}
      ></iframe>
    </section>
  );
}
