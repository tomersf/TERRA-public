import React, { useCallback, useEffect, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  Image,
  Button,
  StyleSheet,
  Alert,
} from "react-native";
import MapPreview from "../../components/MapPreview";
import BookingAssetModal from "./Modals/BookingAssetModal";
import Routes from "../../constants/Routes";
import Colors from "../../constants/Colors";
import Card from "../../components/UI/Card";
import Fonts from "../../constants/Fonts";
import { useHttpClient } from "../../hooks/http-hook";
import { useIsFocused } from "@react-navigation/native";
import ENV from "../../env";
import { ActivityIndicator } from "react-native-paper";

const AssetInfoScreen = (props) => {
  const assetId = props.route.params.assetId;
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [selectedAsset, setSelectedAsset] = useState(null);
  const isFocused = useIsFocused();

  useEffect(() => {
    const fetchAsset = async () => {
      try {
        const responseData = await sendRequest(
          `${ENV.serverURL}/assets/detail/${assetId}`
        );
        console.log(responseData);
        setSelectedAsset(responseData.asset);
      } catch (err) {}
    };
    if (isFocused) {
      fetchAsset();
    }
  }, [isFocused]);

  const [showModal, setShowModal] = useState(false);

  let url;
  let selectedLocation;
  if (selectedAsset) {
    url = selectedAsset.image;
    selectedLocation = {
      lat: selectedAsset.location.lat,
      lng: selectedAsset.location.lng,
    };
  }

  const showMapHandler = () => {
    props.navigation.navigate(Routes.SCREEN_MAP, {
      readonly: true,
      initialLocation: selectedLocation,
    });
  };

  const showModalHandler = () => {
    setShowModal(true);
  };

  const closeModalHandler = useCallback(() => {
    Alert.alert("Are you sure?", "Do you really want to cancel?", [
      { text: "No", style: "default" },
      {
        text: "Yes",
        style: "destructive",
        onPress: () => {
          setShowModal(false);
        },
      },
    ]);
  }, []);

  return (
    <View style={{ flex: 1 }}>
      {selectedAsset && !isLoading && (
        <ScrollView style={styles.imageContainer}>
          <BookingAssetModal
            visible={showModal}
            onCancel={closeModalHandler}
            modalStatus={showModal}
            selectedAsset={selectedAsset}
            navigation={props.navigation}
          />
          <Image source={{ uri: url }} style={styles.image} />
          <View style={{ alignItems: "center" }}>
            <Card
              gradientColors={[Colors.primary, "#BAA7B0", "#B2ABBF"]}
              style={{
                position: "relative",
                bottom: "35%",
                width: "80%",
                elevation: 35,
                borderRadius: 35,
              }}
            >
              <Text style={styles.price}>
                {selectedAsset.price} ILS Per hour
              </Text>
              <Text style={styles.description}>
                {selectedAsset.description}
              </Text>
              <Text style={styles.address}>{selectedAsset.address}</Text>
              <View style={styles.activityContainer}>
                <Text style={styles.activity}>Activity Hours:</Text>
                <Text style={styles.activity}>
                  {selectedAsset.activityHours.start} -{" "}
                  {selectedAsset.activityHours.end}
                </Text>
              </View>
              <View style={styles.button}>
                <Button
                  title="Book Now"
                  color={Colors.redButton}
                  onPress={showModalHandler}
                />
              </View>
            </Card>
          </View>
          <View
            style={{
              alignItems: "center",
              paddingBottom: 20,
              position: "relative",
              bottom: "5%",
            }}
          >
            <Card
              style={{
                width: "85%",
                height: 250,
                elevation: 25,
              }}
            >
              <MapPreview
                location={selectedLocation}
                onPress={showMapHandler}
              />
            </Card>
          </View>
        </ScrollView>
      )}
      {!selectedAsset && isLoading && (
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

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: 250,
  },
  actions: {
    marginVertical: 10,
    alignItems: "center",
  },
  price: {
    fontSize: 20,
    color: Colors.headerTitle,
    textAlign: "center",
    marginVertical: 5,
    fontFamily: Fonts.OPEN_SANS_BOLD,
  },
  description: {
    fontFamily: Fonts.OPEN_SANS,
    fontSize: 18,
    textAlign: "center",
    marginHorizontal: 5,
    color: Colors.headerTitle,
  },
  address: {
    fontFamily: Fonts.OPEN_SANS,
    fontSize: 18,
    textAlign: "center",
    marginHorizontal: 5,
    color: Colors.headerTitle,
  },
  imageContainer: {
    width: "100%",
    height: "60%",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    flex: 1,
  },
  activity: {
    fontFamily: Fonts.OPEN_SANS_BOLD,
    borderTopColor: "black",
    textAlign: "center",
    fontSize: 16,
  },
  activityContainer: {
    fontFamily: Fonts.OPEN_SANS,
    fontSize: 20,
    textAlign: "center",
    padding: 5,
  },
  button: {
    width: "60%",
    justifyContent: "center",
    alignSelf: "center",
    marginVertical: 5,
  },
  modalButton: {
    width: "60%",
    justifyContent: "center",
    alignSelf: "center",
    borderRadius: 10,
    marginVertical: 20,
    marginTop: "70%",
  },
});

export default AssetInfoScreen;
