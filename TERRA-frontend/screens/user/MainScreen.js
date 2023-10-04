import React from "react";
import { View, StyleSheet, ImageBackground, Text } from "react-native";
import { useSelector } from "react-redux";
import Fonts from "../../constants/Fonts";

const MainScreen = () => {
  const userName = useSelector((state) => state.auth.userName);
  return (
    <View style={styles.temp}>
      <ImageBackground
        source={require("../../assets/images/main_bgV2.png")}
        style={{ width: "100%", height: "100%" }}
        imageStyle={{ opacity: 0.8 }}
      >
        <Text style={styles.welcome}>Welcome, {userName}</Text>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  temp: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  welcome: {
    fontSize: 20,
    position: "relative",
    top: 13,
    left: 10,
    fontFamily: Fonts.OPEN_SANS,
  },
});

export default MainScreen;
