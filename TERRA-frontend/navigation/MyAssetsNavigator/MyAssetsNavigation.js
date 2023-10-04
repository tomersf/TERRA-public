import React, { useLayoutEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";

// CONSTANTS
import Routes from "../../constants/Routes";

// SCREENS
import MyAssetsScreen from "../../screens/user/MyAssetsScreen";
import AddAssetScreen from "../../screens/asset/AddAssetScreen";
import Colors from "../../constants/Colors";

const MyAssetsStackNavigator = createNativeStackNavigator();
export default MyAssetsNavigator = ({ navigation, route }) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown:
        getFocusedRouteNameFromRoute(route) === Routes.SCREEN_ADD_ASSET
          ? false
          : true,
    });
  }, [navigation, route]);
  return (
    <MyAssetsStackNavigator.Navigator>
      <MyAssetsStackNavigator.Screen
        name={Routes.SCREEN_MY_ASSETS}
        component={MyAssetsScreen}
        options={{ headerShown: false }}
      />
      <MyAssetsStackNavigator.Screen
        name={Routes.SCREEN_ADD_ASSET}
        component={AddAssetScreen}
        options={{
          headerTintColor: Colors.headerTitle,
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: Colors.primary,
          },
        }}
      />
    </MyAssetsStackNavigator.Navigator>
  );
};
