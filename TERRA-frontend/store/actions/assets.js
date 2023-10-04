import { Alert } from "react-native";
import uuid from "react-native-uuid";
import ENV from "../../env";
export const SET_ASSETS = "ALL ASSETS";
export const ADD_ASSET = "ADD ASSET";
export const USER_ASSETS = "USER ASSETS";
export const RENTED_ASSETS = "RENTED ASSETS";
export const REMOVE_ASSET = "REMOVE ASSET";
export const FILTER_ASSETS = "FILTER_ASSETS";
export const OPEN_FILTER = "OPEN_FILTER";
export const CLOSE_FILTER = "CLOSE_FILTER";

export const setAssets = (assets) => {
  return (dispatch) => {
    dispatch({ type: SET_ASSETS, assets });
  };
};

export const getAllAssets = () => {
  return async (dispatch) => {
    try {
      const response = await fetch(`${ENV.serverURL}/assets`);
      if (!response.ok) {
        throw new Error("Somthing went wrong!");
      }
      const resData = await response.json();

      dispatch({ type: SET_ASSETS, assets: resData });
    } catch (err) {
      //send to analytic server
      throw err;
    }
  };
};

export const getUserAssets = (userId) => {
  return async (dispatch) => {
    // fetch from backend all user Assets
    dispatch({
      type: USER_ASSETS,
      assets: [],
    });
  };
};

export const addAsset = (
  ownerId,
  assetType,
  imageUrl,
  description,
  price,
  activityHours,
  mapLocation
) => {
  return async (dispatch) => {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${mapLocation.lat},${mapLocation.lng}&key=${ENV.googleApiKey}`
    );

    if (!response.ok) {
      Alert.alert("Geocoding error", "Couldn't add the new asset! Try again!");
      return;
    }

    const resData = await response.json();
    const assetAddress = resData.results[0].formatted_address;
    const assetCity = resData.results[0].address_components[2].short_name;

    dispatch({
      type: ADD_ASSET,
      assetData: {
        id: uuid.v4(),
        ownerId,
        assetType,
        imageUrl,
        description,
        address: assetAddress,
        price,
        activityHours: activityHours.start + "-" + activityHours.end,
        location: {
          lat: mapLocation.lat,
          lng: mapLocation.lng,
        },
        city: assetCity,
      },
    });
  };
};

export const getRentedAssets = (userId) => {
  return async (dispatch) => {
    dispatch({
      type: RENTED_ASSETS,
      assets: [],
    });
  };
};

export const removeAsset = (assetId) => {
  return async (dispatch) => {
    dispatch({ type: REMOVE_ASSET });
  };
};

export const filterAssets = (assetType, assetPrice, assetCity) => {
  return async (dispatch) => {
    dispatch({
      type: FILTER_ASSETS,
      filterData: {
        assetType,
        assetPrice,
        assetCity,
      },
    });
  };
};

export const openFilter = () => {
  return async (dispatch) => {
    dispatch({ type: OPEN_FILTER });
  };
};

export const closeFilter = () => {
  return async (dispatch) => {
    dispatch({ type: CLOSE_FILTER });
  };
};
