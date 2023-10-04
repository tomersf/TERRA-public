import React, { useLayoutEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";

// CONSTANTS
import Routes from "../../constants/Routes";

// SCREENS
import AvailableAssetsList from "../../components/asset/AvailableAssetsList";
import FindAssetScreen from "../../screens/user/FindAssetScreen";
import AssetInfoScreen from "../../screens/asset/AssetInfoScreen";
import PayBookingsScreen from "../../screens/user/PayBookingsScreen";
import Colors from "../../constants/Colors";

const FindAssetsStackNavigator = createNativeStackNavigator();
export default AvailabeAssetsNavigator = ({ navigation, route }) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation, route]);
  return (
    <FindAssetsStackNavigator.Navigator>
      <FindAssetsStackNavigator.Screen
        name={Routes.SCREEN_FIND_ASSET}
        component={FindAssetScreen}
        options={{
          title: "Find Asset For Rent",
        }}
      />
      <FindAssetsStackNavigator.Screen
        name={Routes.SCREEN_AVILABLE_ASSETS}
        component={AvailableAssetsList}
      />
      <FindAssetsStackNavigator.Screen
        name={Routes.SCREEN_ASSET_INFO}
        component={AssetInfoScreen}
        options={{
          headerStyle: { backgroundColor: Colors.primary },
          headerTintColor: Colors.headerTitle,
        }}
      />
      <FindAssetsStackNavigator.Screen
        name={Routes.SCREEN_PAY_BOOKINGS}
        component={PayBookingsScreen}
        options={{
          headerShown: false,
          swipeEnabled: false,
          gestureEnabled: false
        }}
       
        
      />
    </FindAssetsStackNavigator.Navigator>
  );
};
