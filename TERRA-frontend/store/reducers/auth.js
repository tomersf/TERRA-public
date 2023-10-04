import { LOGIN, LOGOUT, NOT_FIRST_TIME_LOADING_APP } from "../actions/auth";

const initialState = {
  userId: "",
  userName: "",
  first_time: true,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case NOT_FIRST_TIME_LOADING_APP:
      return {
        ...state,
        first_time: false,
      };
    case LOGIN:
      return {
        ...state,
        userId: action.userId,
        userName: action.userName,
      };
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
};
