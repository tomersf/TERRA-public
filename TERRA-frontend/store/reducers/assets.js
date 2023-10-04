import Asset from "../../models/Asset";
import {
  ADD_ASSET,
  SET_ASSETS,
  USER_ASSETS,
  RENTED_ASSETS,
  FILTER_ASSETS,
  OPEN_FILTER,
  CLOSE_FILTER,
} from "../actions/assets";

const initialState = {
  availableAssets: [],
  filteredAssets: [],
  userAssets: [],
  rentingAssets: [],
  assetsRegions: [],
  filterModalStatus: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_ASSETS:
      let RegionsArr = [];
      action.assets.forEach((element) => {
        if (RegionsArr.indexOf(element.city) === -1) {
          RegionsArr.push(element.city);
        }
      });
      RegionsArr.unshift("None");
      return {
        ...state,
        availableAssets: action.assets,
        filteredAssets: action.assets,
        assetsRegions: RegionsArr,
      };

    case USER_ASSETS:
      return {
        ...state,
        userAssets: action.assets,
      };

    case ADD_ASSET:
      const newAsset = new Asset(
        action.assetData.id,
        action.assetData.ownerId,
        action.assetData.assetType,
        action.assetData.imageUrl,
        action.assetData.description,
        action.assetData.address,
        action.assetData.price,
        action.assetData.activityHours,
        action.assetData.location,
        action.assetData.city
      );
      return {
        ...state,
        availableAssets: state.availableAssets.concat(newAsset),
        userAssets: state.userAssets.concat(newAsset),
      };

    case RENTED_ASSETS:
      return {
        ...state,
        rentingAssets: action.assets,
      };

    case FILTER_ASSETS:
      let filteredAssetsArr = [];

      filteredAssetsArr = state.availableAssets.filter(
        (asset) => asset.assetType === action.filterData.assetType
      );

      if (action.filterData.assetPrice > 0) {
        filteredAssetsArr = filteredAssetsArr.filter(
          (asset) => asset.price <= action.filterData.assetPrice
        );
      }

      if (action.filterData.assetCity !== "None") {
        filteredAssetsArr = filteredAssetsArr.filter(
          (asset) => asset.city === action.filterData.assetCity
        );
      }
      console.log(filteredAssetsArr);
      return {
        ...state,
        filteredAssets: filteredAssetsArr,
      };

    case OPEN_FILTER:
      return {
        ...state,
        filterModalStatus: true,
      };

    case CLOSE_FILTER:
      return {
        ...state,
        filterModalStatus: false,
      };
  }
  return state;
};
