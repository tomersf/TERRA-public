import React, { useEffect } from "react";
import { View, SafeAreaView, Button, Alert, ToastAndroid } from "react-native";
import {
  createDrawerNavigator,
  DrawerItemList,
} from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch } from "react-redux";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import * as authActions from "../../store/actions/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";

// CONSTANTS
import Colors from "../../constants/Colors";
import Routes from "../../constants/Routes";

// SCREENS
import MyRentalsScreen from "../../screens/user/MyRentalsScreen";
import BillingInfoScreen from "../../screens/user/BillingInfoScreen";

// NAVIGATORS
import FindAssetsNavigator from "../FindAssetsNavigator/FindAssetsNavigation";
import MyAssetsNavigator from "../MyAssetsNavigator/MyAssetsNavigation";
import HomeTabNavigator from "../BottomTabNavigator/BottomTabNavigation";

import ENV from "../../env";

const HomeDrawerNavigator = createDrawerNavigator();
export default DrawerNavigator = (props) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const foregroundSubscription =
      Notifications.addNotificationReceivedListener(() => {
        ToastAndroid.show("One of your assets got booked!", ToastAndroid.SHORT);
      });
    return () => {
      foregroundSubscription.remove();
    };
  }, []);

  const clearCache = async () => {
    try {
      const value = await AsyncStorage.getItem("@storage_Key");
      if (value !== null) {
        await AsyncStorage.removeItem("@storage_Key");
        Alert.alert("Cache cleared", "Your cache is cleared!");
      } else {
        Alert.alert("Cache is empty", "Your cache is already empty!");
      }
    } catch (e) {}
  };

  return (
    <HomeDrawerNavigator.Navigator
      screenOptions={ENV.defaultNavOptions}
      drawerContent={(props) => {
        return (
          <View style={{ flex: 1, paddingTop: 60 }}>
            <SafeAreaView forceInset={{ top: "always", horizontal: "never" }}>
              <DrawerItemList {...props} />
              <View
                style={{
                  marginTop: 35,
                  marginLeft: 20,
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  width: "70%",
                  flex: 1,
                }}
              >
                <View style={{ width: "20%" }}>
                  <Ionicons
                    name="log-out-outline"
                    size={23}
                    color={Colors.headerTitle}
                  />
                </View>
                <Button
                  title="Logout"
                  color={Colors.primary}
                  onPress={() => {
                    dispatch(authActions.logout());
                  }}
                />
              </View>
              <View
                style={{
                  marginTop: 70,
                  marginLeft: 20,
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  width: "70%",
                  flex: 1,
                }}
              >
                <View style={{ width: "20%" }}>
                  <Ionicons
                    name="file-tray-full-outline"
                    size={23}
                    color={Colors.headerTitle}
                  />
                </View>
                <Button
                  title="Clear Cache"
                  color={Colors.primary}
                  onPress={() => {
                    clearCache();
                  }}
                />
              </View>
            </SafeAreaView>
          </View>
        );
      }}
    >
      <HomeDrawerNavigator.Screen
        name={Routes.SCREEN_MAIN}
        component={HomeTabNavigator}
        options={{
          drawerIcon: ({ focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={23}
              color={Colors.headerTitle}
            />
          ),
        }}
      />
      <HomeDrawerNavigator.Screen
        name={Routes.NAVIGATOR_AVILABLE_ASSETS_SCREEN}
        component={FindAssetsNavigator}
        options={({ route }) => ({
          headerTitle: "Find Asset For Rent",
          headerShown:
            getFocusedRouteNameFromRoute(route) === Routes.SCREEN_ADD_ASSET
              ? false
              : true,
          drawerIcon: ({ focused }) => (
            <Ionicons
              name={focused ? "search" : "search-outline"}
              size={23}
              color={Colors.headerTitle}
            />
          ),
        })}
      />
      <HomeDrawerNavigator.Screen
        name={Routes.NAVIGATOR_MY_ASSETS_SCREEN}
        component={MyAssetsNavigator}
        options={({ navigation, route }) => ({
          headerTitle: Routes.SCREEN_MY_ASSETS,
          headerShown:
            getFocusedRouteNameFromRoute(route) === Routes.SCREEN_ADD_ASSET
              ? false
              : true,
          drawerIcon: ({ focused }) => (
            <Ionicons
              name={focused ? "business" : "business-outline"}
              size={23}
              color={Colors.headerTitle}
            />
          ),
          headerRight: () => (
            <Ionicons
              name="add-outline"
              size={40}
              color={Colors.accent}
              onPress={() => navigation.navigate(Routes.SCREEN_ADD_ASSET)}
            />
          ),
        })}
      />
      <HomeDrawerNavigator.Screen
        name={Routes.SCREEN_MY_RENTALS}
        component={MyRentalsScreen}
        options={{
          unmountOnBlur: true,
          drawerIcon: ({ focused }) => (
            <Ionicons
              name={focused ? "fitness" : "fitness-outline"}
              size={23}
              color={Colors.headerTitle}
            />
          ),
        }}
      />
      <HomeDrawerNavigator.Screen
        name={Routes.SCREEN_BILLING}
        component={BillingInfoScreen}
        options={{
          drawerIcon: ({ focused }) => (
            <Ionicons
              name={focused ? "cash" : "cash-outline"}
              size={23}
              color={Colors.headerTitle}
            />
          ),
        }}
      />
    </HomeDrawerNavigator.Navigator>
  );
};
