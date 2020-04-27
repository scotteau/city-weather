// next - go further to get weather and images

import Axios from "axios";
import { CardImage} from "../Model";

const fetchPhotos = async (cityName: string, numberOfImages: number) => {
  const query = cityName;
  const query_dark = `${cityName} night`;

  const unsplashBaseUrl = "https://api.unsplash.com/search/photos";

  const unsplash_response_light = await Axios.get(unsplashBaseUrl, {
    headers: {
      Authorization: process.env.REACT_APP_UNSPLASH_ACCESS_KEY,
    },
    params: {
      query: query,
      per_page: numberOfImages,
    },
  });
  const unsplash_response_dark = await Axios.get(unsplashBaseUrl, {
    headers: {
      Authorization: process.env.REACT_APP_UNSPLASH_ACCESS_KEY,
    },
    params: {
      query: query_dark,
      per_page: numberOfImages,
    },
  });

  const light = unsplash_response_light.data.results.map(
    (p: any) =>
      new CardImage(p.urls.regular, p.id, p.links.html, p.alt_description)
  );
  const dark = unsplash_response_dark.data.results.map(
    (p: any) =>
      new CardImage(p.urls.regular, p.id, p.links.html, p.alt_description)
  );

  return { light, dark };
};

export default fetchPhotos;
