import React from "react";
import {
  View,
  TouchableOpacity,
  TouchableNativeFeedback,
  Platform,
} from "react-native";

const TouchableComponent = (props) => {
  let content;
  let isNativeFeedback = false;
  let TouchableCmp = TouchableOpacity;
  if (Platform.OS === "android" && Platform.Version >= 21) {
    TouchableCmp = TouchableNativeFeedback;
    isNativeFeedback = true;
  }

  if (isNativeFeedback) {
    content = (
      <View style={{ ...props.style }}>
        <TouchableCmp onPress={props.onPress} {...props}>
          {props.children}
        </TouchableCmp>
      </View>
    );
  } else {
    content = (
      <TouchableCmp
        style={{ ...props.style }}
        onPress={props.onPress}
        {...props}
      >
        {props.children}
      </TouchableCmp>
    );
  }

  return content;
};

export default TouchableComponent;
