import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import Colors from "../../constants/Colors";
import Fonts from "../../constants/Fonts";

import Card from "../UI/Card";
import TouchableComponent from "../UI/TouchableComponent";

const AssetItem = (props) => {
  return (
    <Card style={{ ...styles.product, ...props.style }}>
      <TouchableComponent
        onPress={props.onSelect}
        useForeground
        style={{ height: "100%" }}
      >
        <View style={{ height: "100%" }}>
          <View style={styles.imageContainer}>
            <Image style={styles.image} source={{ uri: props.image }} />
          </View>
          <View>
            <View style={styles.details}>
              <Text style={styles.title}>{props.title}</Text>
              <Text style={styles.price}>{props.price} ILS</Text>
            </View>
            <View>
              <Text style={styles.address}>{props.address}</Text>
            </View>
          </View>
        </View>
      </TouchableComponent>
    </Card>
  );
};

const styles = StyleSheet.create({
  product: {
    height: 220,
    margin: 10,
  },
  touchable: {
    height: "100%",
    borderRadius: 10,
    overflow: "hidden",
  },
  imageContainer: {
    width: "100%",
    height: "60%",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  details: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 6,
  },
  title: {
    fontFamily: Fonts.OPEN_SANS_BOLD,
    fontSize: 18,
    marginVertical: 2,
  },
  price: {
    fontFamily: Fonts.OPEN_SANS_BOLD,
    fontSize: 14,
    color: Colors.redButton,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: "23%",
    paddingHorizontal: 20,
  },
  address: {
    textAlign: "center",
    fontFamily: Fonts.OPEN_SANS,
    fontSize: 14,
    color: Colors.primary,
    padding: 1,
  },
});

export default AssetItem;
