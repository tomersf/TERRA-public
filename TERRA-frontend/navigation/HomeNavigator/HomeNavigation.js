import React, { useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useSelector, useDispatch } from "react-redux";
import DrawerNavigator from "../DrawerNavigator/DrawerNavigation";
import Routes from "../../constants/Routes";
import MapScreen from "../../screens/maps/MapScreen";
import AssetsMapScreen from "../../screens/maps/AssetsMapScreen";
import AssetInfoScreen from "../../screens/asset/AssetInfoScreen";
import onBoardingScreen from "../../screens/app/OnBoarding";
import EditAssetScreen from "../../screens/asset/EditAssetScreen";
import * as authActions from "../../store/actions/auth";
import ENV from "../../env";

const Stack = createNativeStackNavigator();
const HomeNavigator = (props) => {
  let isFirstTimeListener = useSelector((state) => state.auth.first_time);
  const [isFirstTime, setIsFirstTime] = useState(isFirstTimeListener);
  const dispatch = useDispatch();

  useEffect(() => {
    setIsFirstTime(isFirstTimeListener);
  }, [isFirstTimeListener]);

  if (isFirstTime) {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="OnBoarding"
          component={onBoardingScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    );
  }

  return (
    <Stack.Navigator>
      <Stack.Screen
        name={Routes.NAVIGATOR_DRAWER}
        component={DrawerNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={Routes.SCREEN_MAP}
        component={MapScreen}
        options={ENV.defaultNavOptions}
      />
      <Stack.Screen
        name={Routes.SCREN_ASSETS_MAP}
        component={AssetsMapScreen}
        options={ENV.defaultNavOptions}
      />
      <Stack.Screen
        name={Routes.SCREEN_ASSET_INFO}
        component={AssetInfoScreen}
        options={ENV.defaultNavOptions}
      />
      <Stack.Screen
        name={Routes.SCREEN_ASSET_EDIT}
        component={EditAssetScreen}
        options={ENV.defaultNavOptions}
      />
    </Stack.Navigator>
  );
};

export default HomeNavigator;
