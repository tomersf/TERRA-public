import React from "react";
import { View, Text, StyleSheet, Button, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../constants/Colors";

import TouchableComponent from "./TouchableComponent";

const Filter = (props) => {
  return (
    <View style={styles.screen}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={props.openModal}
        style={styles.roundButton1}
      >
        <Text>FILTERS</Text>
        <Ionicons name="filter-outline" size={23} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  roundButton1: {
    width: 300,
    height: 60,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 35,
    borderRadius: 25,
    backgroundColor: Colors.filter,
  },
});

export default Filter;
