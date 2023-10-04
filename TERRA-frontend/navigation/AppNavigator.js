import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as authActions from "../store/actions/auth";

import AuthNavigation from "./AuthNavigator/AuthNavigation";
import HomeNavigator from "./HomeNavigator/HomeNavigation";

const AppNavigator = () => {
  let isAuth = useSelector((state) => !!state.auth.userId);
  const [isDataSetted, setIsDataSetted] = useState(false);
  const dispatch = useDispatch();

  const storeData = async (value) => {
    try {
      await AsyncStorage.setItem("@storage_Key", value);
    } catch (e) {
      // saving error
    }
  };

  const getData = async () => {
    if (isDataSetted) {
      return;
    }
    try {
      const value = await AsyncStorage.getItem("@storage_Key");
      if (value !== null) {
        await dispatch(authActions.NotfirstTime());
      } else {
        storeData("true");
        setIsDataSetted(true);
      }
    } catch (e) {
      // error reading value
    }
  };

  getData();

  return (
    <NavigationContainer>
      {isAuth && <HomeNavigator />}
      {!isAuth && <AuthNavigation />}
    </NavigationContainer>
  );
};

export default AppNavigator;
