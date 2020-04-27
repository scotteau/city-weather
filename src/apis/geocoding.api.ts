import Axios from "axios";

const fetchGeocoding = async (
  query: string
): Promise<{ lat: number; lng: number; cityName: string } | any> => {
  try {
    const googleGeocodingUrl =
      "https://maps.googleapis.com/maps/api/geocode/json";

    const geocoding_response = await Axios.get(googleGeocodingUrl, {
      params: {
        address: query,
        key: process.env.REACT_APP_GOOGLE_GEOCODING_ACCESS_KEY,
      },
    });

    const geocodingData = await geocoding_response.data.results[0];
    const lat = geocodingData.geometry.location.lat;
    const lng = geocodingData.geometry.location.lng;
    const cityName = geocodingData.address_components[0].long_name;

    if (cityName.match(/\d+/)) {
      console.log(lat, lng, cityName);
      console.log("not valid city name, should do something"); // todo - catch this error
      throw new Error("not valid city name!");
    } // good - can get geocoding

    return { lat, lng, cityName };
  } catch (e) {
    console.log(e);
  }
};

export default fetchGeocoding;
