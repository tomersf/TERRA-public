import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { View, Text, StyleSheet } from "react-native";

const Card = (props) => {
  const colors = props.gradientColors;
  const propsStlye = props.style;
  let content = (
    <View style={{ ...styles.card, ...propsStlye }}>{props.children}</View>
  );
  if (colors) {
    content = (
      <LinearGradient
        colors={[...colors]}
        style={{ ...styles.gradientCard, ...propsStlye }}
      >
        {props.children}
      </LinearGradient>
    );
  }
  return content;
};

const styles = StyleSheet.create({
  card: {
    elevation: 8,
    borderRadius: 10,
    backgroundColor: "white",
  },
  gradientCard: {
    elevation: 8,
    borderRadius: 10,
  },
});

export default Card;
