import axios from "axios";

export async function getPlaceImage(destination: string, limit = 3) {
  try {
    const searchRes = await axios.get(
      
      "https://maps.googleapis.com/maps/api/place/textsearch/json",
      {
        params: {
          query: `${destination} famous landmark`,
          key: process.env.GOOGLE_API_KEY,
          rankby: "prominence",
          // type: "famous_tourist_attraction",
        },
      }
    );

    const results = searchRes.data.results;
    if (!results || results.length === 0) return null;

    const placeWithPhoto = results.find((p: any) => p.photos?.length > 0);
    if (!placeWithPhoto) return null;

    return placeWithPhoto.photos[0].photo_reference; 
  } catch (err) {
    console.error(err);
    return null;
  }
}
