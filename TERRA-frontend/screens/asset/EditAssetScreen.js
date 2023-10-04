import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useSelector } from "react-redux";
import { useIsFocused } from "@react-navigation/native";
import { useHttpClient } from "../../hooks/http-hook";
import { useForm } from "../../hooks/form-hook";
import ImagePicker from "../../components/ImagePicker";
import ENV from "../../env";
import Colors from "../../constants/Colors";
import Input from "../../components/UI/Input";
import Sizes from "../../constants/Sizes";
import Fonts from "../../constants/Fonts";

const EditAssetScreen = ({ route, navigation }) => {
  const userId = useSelector((state) => state.auth.userId);
  const assetId = route.params.assetId;
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [isTouched, setIsTouched] = useState(false);
  const [pictureChanged, setPictureChanged] = useState(false);
  const isFocused = useIsFocused();
  const [formEditAssetState, dispatchformEditAssetState] = useForm(
    {
      description: {
        value: "",
        isValid: false,
      },
      price: {
        value: "",
        isValid: false,
      },
      image: {
        value: "",
        isValid: true,
      },
    },
    false
  );

  const setTouched = () => {
    setIsTouched(true);
  };

  useEffect(() => {
    if (error) {
      Alert.alert("An Error Occurred!", error, [{ text: "Okay" }]);
    }
  }, [error]);

  const submitEditAssetHandler = async () => {
    if (!formEditAssetState.isValid) {
      Alert.alert(
        "Form invalid!",
        "Please fill all the form fields correctly.",
        [{ text: "okay", style: "destructive" }]
      );
      return;
    }

    try {
      const formData = new FormData();
      formData.append("image", {
        type: "image/jpg",
        uri: formEditAssetState.inputs.image.value,
        name: "_image",
      });
      formData.append("userId", userId);
      formData.append(
        "description",
        formEditAssetState.inputs.description.value
      );
      formData.append("price", formEditAssetState.inputs.price.value);
      formData.append("assetId", selectedAsset.id);
      formData.append("pictureChanged", pictureChanged);

      await sendRequest(`${ENV.serverURL}/assets/edit`, "PATCH", formData, {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
      });
    } catch (err) {}

    navigation.goBack();
  };

  useEffect(() => {
    const fetchAsset = async () => {
      try {
        const responseData = await sendRequest(
          `${ENV.serverURL}/assets/detail/${assetId}`
        );
        setSelectedAsset(responseData.asset);
        dispatchformEditAssetState(responseData.asset.image, true, "image");
        dispatchformEditAssetState(
          responseData.asset.description,
          true,
          "description"
        );
        dispatchformEditAssetState(responseData.asset.price, true, "price");
      } catch (err) {}
    };
    if (isFocused) {
      fetchAsset();
    }
  }, [isFocused]);

  const imageTakenHandler = useCallback((image) => {
    dispatchformEditAssetState(image, true, "image");
    setTouched();
    setPictureChanged(true);
  }, []);

  const inputChangeHandler = useCallback(
    (inputIdentifier, inputValue, inputValidity) => {
      dispatchformEditAssetState(inputValue, inputValidity, inputIdentifier);
      setTouched();
    },
    [dispatchformEditAssetState]
  );

  return (
    <View style={{ flex: 1, alignItems: "center" }}>
      {selectedAsset && !isLoading && (
        <View style={{ flex: 1, width: Sizes.width * 0.9 }}>
          <View
            style={{
              alignItems: "center",
              marginTop: "5%",
            }}
          >
            <Input
              id="description"
              label="Asset Description"
              keyboardType="email-address"
              required
              minLength={10}
              maxLength={80}
              multiline
              placeholder="Asset Description"
              errorText="Please enter at least 10 chars."
              initialValue={selectedAsset.description}
              initiallyValid
              onInputChange={inputChangeHandler}
            />
          </View>
          <View
            style={{
              alignItems: "center",
              marginTop: "5%",
            }}
          >
            <Input
              id="price"
              label="Price Per Hour in NIS"
              keyboardType="numeric"
              price
              required
              placeholder="Price per hour"
              errorText="Please enter a valid price"
              onInputChange={inputChangeHandler}
              initialValue={`${selectedAsset.price}`}
              initiallyValid
            />
          </View>
          <View style={{ marginTop: 10 }}>
            <Text style={{ fontFamily: Fonts.OPEN_SANS_BOLD }}>
              Asset Image
            </Text>
            <ImagePicker
              onImageTaken={imageTakenHandler}
              initialImage={selectedAsset.image}
            />
          </View>
          <View style={{ marginTop: "10%" }}>
            <Button
              color={Colors.redButton}
              title="SAVE CHANGES"
              disabled={!isTouched || !formEditAssetState.isValid}
              onPress={() => submitEditAssetHandler()}
            />
          </View>
        </View>
      )}
      {isLoading && (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      )}
      {error && (
        <View>
          <Text style={{ ...Fonts.h2 }}>
            Can't display asset details, please try again later!
          </Text>
        </View>
      )}
    </View>
  );
};

export default EditAssetScreen;
