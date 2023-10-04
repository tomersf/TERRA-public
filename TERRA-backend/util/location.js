const axios = require("axios");

const CustomError = require("../models/custom-error");

const API_KEY = process.env.GOOGLE_API_KEY;

async function getAddressForCoords(lat, lng) {
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${API_KEY}`
    );

    const data = response.data;

    if (!data) {
      const error = new CustomError(
        "Could not find location for the specified address.",
        422
      );
      throw error;
    }

    const assetAddress = data.results[0].formatted_address;
    const assetCity = data.results[0].address_components[2].short_name;

    return { assetAddress, assetCity };
  } catch (err) {
    const error = new CustomError(
      "Could not translate asset location to address!.",
      422
    );
    throw error;
  }
}

module.exports = getAddressForCoords;
