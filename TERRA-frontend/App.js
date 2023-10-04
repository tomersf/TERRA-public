// IMPORTS FROM REACT & REDUX
import React, { useState, useEffect } from "react";
import { createStore, combineReducers, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import ReduxThunk from "redux-thunk";
import * as Notifications from "expo-notifications";

// IMPORTS FROM EXPO
import AppLoading from "expo-app-loading";
import * as Font from "expo-font";

// IMPORTS FROM REDUX STORE
import authReducer from "./store/reducers/auth";
import assetsReducer from "./store/reducers/assets";
import categoriesReducer from "./store/reducers/categories";
import bookingsReducer from "./store/reducers/bookings";
import paymentsReducer from "./store/reducers/payment";

// IMPORTS FROM OUR COMPONENTS
import AppNavigator from "./navigation/AppNavigator";

Notifications.setNotificationHandler({
  handleNotification: async () => {
    return {
      shouldPlaySound: true,
      shouldShowAlert: true,
    };
  },
});

const fetchFonts = () => {
  return Font.loadAsync({
    "open-sans": require("./assets/fonts/OpenSans-Regular.ttf"),
    "open-sans-bold": require("./assets/fonts/OpenSans-Bold.ttf"),
  });
};

const rootReducer = combineReducers({
  auth: authReducer,
  assets: assetsReducer,
  categories: categoriesReducer,
  bookings: bookingsReducer,
  payment: paymentsReducer,
});

const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

export default function App() {
  const [fontLoaded, setFontLoaded] = useState(false);
  if (!fontLoaded) {
    return (
      <AppLoading
        startAsync={fetchFonts}
        onFinish={() => setFontLoaded(true)}
        onError={(err) => console.log(err)}
      />
    );
  }

  return (
    <Provider store={store}>
      <AppNavigator />
    </Provider>
  );
}
