export const LOGIN = "LOGIN";
export const LOGOUT = "LOGOUT";
export const NOT_FIRST_TIME_LOADING_APP = "FIRST_TIME";

export const NotfirstTime = () => {
  return { type: NOT_FIRST_TIME_LOADING_APP };
};

export const login = (userId, userName) => {
  return {
    type: LOGIN,
    userId,
    userName,
  };
};

export const logout = () => {
  return { type: LOGOUT };
};
