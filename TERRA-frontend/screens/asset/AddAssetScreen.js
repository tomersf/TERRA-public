import React, { useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../constants/Colors";
import Fonts from "../../constants/Fonts";
import TouchableComponent from "../../components/UI/TouchableComponent";
import Card from "../../components/UI/Card";
import Input from "../../components/UI/Input";
import assetTypes from "../../constants/assetTypes";
import LocationPicker from "../../components/LocationPicker";
import ImagePicker from "../../components/ImagePicker";
import { useForm } from "../../hooks/form-hook";
import ActivityHoursPicker from "../../components/ActivityHoursPicker";
import * as assetActions from "../../store/actions/assets";
import Routes from "../../constants/Routes";
import { useHttpClient } from "../../hooks/http-hook";
import ENV from "../../env";

const AddAssetScreen = ({ navigation, route }) => {
  const categories = useSelector((state) => state.categories.categories);
  const userId = useSelector((state) => state.auth.userId);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const dispatch = useDispatch();
  const [formAddAssetState, dispatchformAddAssetState] = useForm(
    {
      assetType: {
        value: assetTypes.Football,
        isValid: true,
      },
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
        isValid: false,
      },
      location: {
        value: null,
        isValid: false,
      },
      activityHours: {
        value: {
          start: "",
          end: "",
        },
        isValid: false,
      },
    },
    false
  );

  useEffect(() => {
    if (error) {
      Alert.alert("An Error Occurred!", error, [{ text: "Okay" }]);
    }
  }, [error]);

  const submitFormHandler = async () => {
    if (!formAddAssetState.isValid) {
      Alert.alert("Form invalid!", "Please fill all the form fields.", [
        { text: "okay", style: "destructive" },
      ]);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("image", {
        type: "image/jpg",
        uri: formAddAssetState.inputs.image.value,
        name: "_image",
      });
      formData.append("userId", userId);
      formData.append("assetType", formAddAssetState.inputs.assetType.value);
      formData.append(
        "description",
        formAddAssetState.inputs.description.value
      );
      formData.append("price", formAddAssetState.inputs.price.value);
      formData.append(
        "activityHours_start",
        formAddAssetState.inputs.activityHours.value.start
      );
      formData.append(
        "activityHours_end",
        formAddAssetState.inputs.activityHours.value.end
      );
      formData.append(
        "location_lat",
        formAddAssetState.inputs.location.value.lat
      );
      formData.append(
        "location_lng",
        formAddAssetState.inputs.location.value.lng
      );

      await sendRequest(`${ENV.serverURL}/assets`, "POST", formData, {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
      });

      dispatch(
        assetActions.addAsset(
          userId,
          formAddAssetState.inputs.assetType.value,
          formAddAssetState.inputs.image.value,
          formAddAssetState.inputs.description.value,
          formAddAssetState.inputs.price.value,
          formAddAssetState.inputs.activityHours.value,
          formAddAssetState.inputs.location.value
        )
      );
    } catch (err) {}

    navigation.navigate({
      name: Routes.SCREEN_MY_ASSETS,
      params: { msg: "Successfully added asset!" },
      merge: true,
    });
  };

  const imageTakenHandler = useCallback((image) => {
    dispatchformAddAssetState(image, true, "image");
  }, []);

  const locationPickedHandler = useCallback((location) => {
    dispatchformAddAssetState(location, true, "location");
  }, []);

  const inputChangeHandler = useCallback(
    (inputIdentifier, inputValue, inputValidity) => {
      dispatchformAddAssetState(inputValue, inputValidity, inputIdentifier);
    },
    [dispatchformAddAssetState]
  );

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Add your asset now,</Text>
        <Text style={styles.title}>And let us take care of the rest.</Text>
      </View>
      {/* Main Section */}
      <View style={styles.main}>
        <Card style={styles.cardContent}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={{ marginBottom: 10, alignItems: "center" }}>
              <Text style={{ fontSize: 20 }}>- Add Asset Form -</Text>
            </View>
            <View style={styles.assetOption}>
              <Text
                style={{ fontFamily: Fonts.OPEN_SANS_BOLD, marginRight: 50 }}
              >
                Asset Type:
              </Text>
              <Picker
                dropdownIconColor={Colors.primary}
                style={{ width: "50%" }}
                mode="dropdown"
                selectedValue={formAddAssetState.inputs.assetType}
                onValueChange={(itemValue) =>
                  inputChangeHandler("assetType", itemValue, true)
                }
              >
                {categories.map((category) => (
                  <Picker.Item
                    key={category}
                    label={category}
                    value={category}
                  />
                ))}
              </Picker>
            </View>
            <View style={{ marginTop: 10, marginBottom: 0 }}>
              <Input
                id="description"
                label="Asset Description"
                keyboardType="default"
                required
                minLength={10}
                maxLength={80}
                multiline
                placeholder="Asset Description"
                errorText="Please enter at least 10 chars."
                onInputChange={inputChangeHandler}
              />
            </View>
            <View style={{ marginTop: 10 }}>
              <Input
                id="price"
                label="Price Per Hour in NIS"
                keyboardType="numeric"
                price
                required
                placeholder="Price per hour"
                errorText="Please enter a valid price"
                onInputChange={inputChangeHandler}
              />
            </View>
            <View style={{ marginTop: 10 }}>
              <ActivityHoursPicker onInputChange={inputChangeHandler} />
            </View>
            <View style={{ marginTop: 10 }}>
              <Text style={{ fontFamily: Fonts.OPEN_SANS_BOLD }}>
                Asset Image
              </Text>
              <ImagePicker onImageTaken={imageTakenHandler} />
            </View>
            <View style={{ marginTop: 10 }}>
              <Text style={{ fontFamily: Fonts.OPEN_SANS_BOLD }}>
                Asset Location
              </Text>
              <LocationPicker
                navigation={navigation}
                route={route}
                onLocationPicked={locationPickedHandler}
              />
            </View>
          </ScrollView>
        </Card>
      </View>
      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.footerBottom}></View>
        <View style={styles.upperFooterContainer}>
          <View style={styles.iconContainerBg}></View>
          <TouchableComponent
            style={
              !formAddAssetState.isValid
                ? styles.iconContainer
                : styles.iconContainerActive
            }
            onPress={submitFormHandler}
          >
            <Ionicons name="add-outline" size={45} color={Colors.accent} />
          </TouchableComponent>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    backgroundColor: Colors.headerTitle,
  },
  header: {
    backgroundColor: Colors.primary,
    height: "12%",
    borderBottomRightRadius: 35,
    borderBottomLeftRadius: 35,
    elevation: 15,
  },
  title: {
    paddingHorizontal: 15,
    fontFamily: Fonts.OPEN_SANS_BOLD,
    fontSize: 18,
    color: Colors.headerTitle,
  },
  main: {
    width: "100%",
    height: "78%",
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  cardContent: {
    marginTop: 15,
    borderTopRightRadius: 35,
    borderTopLeftRadius: 35,
    width: "90%",
    height: "100%",
    backgroundColor: Colors.headerTitle,
    elevation: 25,
    padding: 10,
    zIndex: 2,
  },
  assetOption: {
    flexDirection: "row",
  },
  footer: {
    height: "10%",
    backgroundColor: Colors.headerTitle,
    justifyContent: "flex-end",
  },
  active: {
    opacity: 0.8,
  },
  upperFooterContainer: {
    position: "absolute",
    top: -20,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  footerUpper: {
    textAlign: "center",
    height: "80%",
    backgroundColor: Colors.headerTitle,
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 60,
    width: "25%",
  },
  iconContainerBg: {
    position: "absolute",
    bottom: 3,
    height: "70%",
    backgroundColor: Colors.headerTitle,
    width: 80,
    borderRadius: 35,
  },
  iconContainer: {
    position: "absolute",
    backgroundColor: Colors.primary,
    width: 75,
    height: 75,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    opacity: 0.4,
  },
  iconContainerActive: {
    position: "absolute",
    backgroundColor: Colors.primary,
    width: 75,
    height: 75,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    opacity: 1,
  },
  footerBottom: {
    height: "50%",
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    backgroundColor: Colors.primary,
  },
});

export default AddAssetScreen;
