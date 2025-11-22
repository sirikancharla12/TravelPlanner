"use client";

import { useEffect, useState } from "react";
import axios from "axios";

interface ImageGridProps {
  destination: string;
  limit?: number; // number of images to fetch
}

export default function ImageGrid({ destination, limit = 3 }: ImageGridProps) {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!destination) return;

    const fetchImages = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await axios.post("/api/plantrip", { destination });
        if (res.data.images) {
          setImages(res.data.images.slice(0, limit));
        } else if (res.data.image) {
          setImages([res.data.image]); // fallback single image
        } else {
          setImages([]);
        }
      } catch (err: any) {
        console.error(err);
        setError("Failed to load images");
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [destination, limit]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Loading images...</p>
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (images.length === 0) {
    return <p className="text-gray-500">No images found for {destination}</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {images.map((img, idx) => (
        <img
          key={idx}
          src={img}
          alt={`${destination} ${idx + 1}`}
          className="w-full h-60 object-cover rounded-lg shadow-md"
        />
      ))}
    </div>
  );
}
