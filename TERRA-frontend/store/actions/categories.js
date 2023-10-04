export const SELECT_CATEGORY = "SELECT_CATEGORY";

export const selectCategory = (categoryName) => {
  return {
    type: SELECT_CATEGORY,
    name: categoryName,
  };
};
