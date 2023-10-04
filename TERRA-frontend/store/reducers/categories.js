import { SELECT_CATEGORY } from "../actions/categories";
import assetTypes from "../../constants/assetTypes";

const initialState = {
  categories: Object.values(assetTypes),
  showAll: true,
  selectedCategory: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SELECT_CATEGORY:
      const categorySelected = action.name;
      if (state.categories.find(categorySelected)) {
        return {
          ...state,
          showAll: false,
          selectedCategory: categorySelected,
        };
      } else {
        return {
          ...state,
          showAll: true,
          selectedCategory: null,
        };
      }
    default:
      return state;
  }
};
