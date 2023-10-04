import React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const Header = ({ onPress, name, color, size, headerStyle }) => {
  return (
    <View>
      <TouchableOpacity
        style={{ ...styles.headerButton, ...headerStyle }}
        onPress={onPress}
      >
        <Ionicons name={name} size={size || 26} color={color} />
      </TouchableOpacity>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  headerButton: {
    marginHorizontal: 15,
  },
});
