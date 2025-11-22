import axios from "axios";

export async function getImagesFromPexels(query: string, limit = 3): Promise<string[]> {
  try {
    const res = await axios.get("https://api.pexels.com/v1/search", {
      params: {
        query: `${query} famous tourist attractions`,
        per_page: limit,
      },
      headers: {
        Authorization: process.env.PEXELS_API_KEY!, 
      },
    });

    const images: string[] = res.data.photos.map((photo: any) => photo.src.medium);
    return images;
  } catch (err) {
    console.error("Pexels API error:", err);
    return [];
  }
}
