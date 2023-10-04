import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Routes from "../../constants/Routes";

import AuthScreen, {
  screenOptions as authScreenOptions,
} from "../../screens/user/AuthScreen";

import ENV from "../../env";

const AuthStackNavigator = createNativeStackNavigator();
export default AuthNavigator = () => {
  return (
    <AuthStackNavigator.Navigator screenOptions={ENV.defaultNavOptions}>
      <AuthStackNavigator.Screen
        name={Routes.SCREEN_AUTHENTICATE}
        component={AuthScreen}
        options={authScreenOptions}
      />
    </AuthStackNavigator.Navigator>
  );
};
