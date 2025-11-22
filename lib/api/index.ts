import { getPlaceImage } from "./googlePlaces";
import { getImagesFromPexels } from "./UnsplashImages";

export async function googleImage(destination: string) {
  const photoRef = await getPlaceImage(destination);
  if (photoRef) {
    return `/api/photo?photoRef=${photoRef}`; 
  } else {
    const pexelsImage = await getImagesFromPexels(destination);
    return pexelsImage;
  }
}
