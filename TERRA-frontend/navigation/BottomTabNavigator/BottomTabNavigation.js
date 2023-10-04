import React, { useLayoutEffect } from "react";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";

// CONSTANTS
import Colors from "../../constants/Colors";
import Routes from "../../constants/Routes";

// SCREENS

import HomeScreen from "../../screens/user/MainScreen";
import MyAssetsScreen from "../../screens/user/MyAssetsScreen";
import MyRentalsScreen from "../../screens/user/MyRentalsScreen";

const HomeBottomTabNavigator = createMaterialBottomTabNavigator();
export default HomeTabNavigator = ({ navigation, route }) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: getFocusedRouteNameFromRoute(route),
    });
  }, [navigation, route]);

  return (
    <HomeBottomTabNavigator.Navigator
      barStyle={{ backgroundColor: Colors.primary }}
      activeColor={Colors.accent}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color }) => {
          let iconName;
          if (route.name === Routes.SCREEN_HOME) {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === Routes.SCREEN_MY_ASSETS) {
            iconName = focused ? "business" : "business-outline";
          } else if (route.name === Routes.SCREEN_MY_RENTALS) {
            iconName = focused ? "fitness" : "fitness-outline";
          }

          return <Ionicons name={iconName} size={20} color={color} />;
        },
      })}
    >
      <HomeBottomTabNavigator.Screen
        name={Routes.SCREEN_HOME}
        component={HomeScreen}
      />
      <HomeBottomTabNavigator.Screen
        name={Routes.SCREEN_MY_ASSETS}
        component={MyAssetsScreen}
      />
      <HomeBottomTabNavigator.Screen
        name={Routes.SCREEN_MY_RENTALS}
        component={MyRentalsScreen}
      />
    </HomeBottomTabNavigator.Navigator>
  );
};
