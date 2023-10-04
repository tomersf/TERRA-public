import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
  FlatList,
  Linking,
  Button,
  ImageBackground,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";

import Colors from "../../constants/Colors";
import DUMMY_BOOKINGS from "../../data/booking-data";
import * as bookingActions from "../../store/actions/bookings";
import RentalsScreenModal from "../asset/Modals/RentalsScreenModal";
import TouchableComponent from "../../components/UI/TouchableComponent";

const MyRentalsScreen = (props) => {
  const userId = useSelector((state) => state.auth.userId);
  const userBookings = useSelector((state) => state.bookings.userBookings);
  const fDatesArr = useSelector((state) => state.bookings.datesArr);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [modalStatus, setModalStatus] = useState(false);
  const [error, setError] = useState();
  const [object, setObject] = useState(DUMMY_BOOKINGS[0]);
  const dispatch = useDispatch();

  console.log("inside user bookings!!!!!!!!!!!!");
  console.log(userBookings);

  const loadBookings = useCallback(async () => {
    setError(null);
    setIsRefreshing(true);
    try {
      await dispatch(bookingActions.getAllBookings(userId));
    } catch (err) {
      setError(err.message);
    }
    setIsRefreshing(false);
  }, [dispatch, setIsLoading, setError]);

  useEffect(() => {
    setIsLoading(true);
    loadBookings();
    setIsLoading(false);
  }, [dispatch]);

  if (error) {
    console.log("this is the error");
    console.log(error);
    return (
      <View style={styles.activityIndicator}>
        <Text>An error occurred!</Text>
        <Button
          title="Try again"
          onPress={loadBookings}
          color={Colors.primary}
        />
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.activityIndicator}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!isLoading && userBookings.length === 0) {
    return (
      <View style={styles.activityIndicator}>
        <ImageBackground
          source={require("../../assets/images/MyRentalsBackgroundImage.png")}
          style={{ width: "100%", height: "100%" }}
          imageStyle={{ opacity: 1 }}
          resizeMode="stretch"
          borderRadius={5}
        >
          <View
            style={{
              alignSelf: "center",
              alignItems: "center",
              marginTop: 300,
            }}
          >
            <Text>No bookings were found</Text>
            <Button
              title="Try again"
              onPress={loadBookings}
              color={Colors.primary}
            />
          </View>
        </ImageBackground>
      </View>
    );
  }

  if (error) {
    console.log("this is the error");
    console.log(error);
    return (
      <View style={styles.activityIndicator}>
        <Text>An error occurred!</Text>
        <Button
          title="Try again"
          onPress={loadBookings}
          color={Colors.primary}
        />
      </View>
    );
  }

  const openModalHandler = (object) => {
    setModalStatus(true);
    setObject(object);
  };

  const closeModalHandler = () => {
    setModalStatus(false);
  };

  const handlePress = async (mapLocation) => {
    // Checking if the link is supported for links with custom URL scheme.
    const url =
      "https://waze.com/ul?ll=" + mapLocation.lat + "," + mapLocation.lng;
    console.log(url);

    const supported = await Linking.canOpenURL(url);

    if (supported) {
      // Opening the link with some app, if the URL scheme is "http" the web link should be opened
      // by some browser in the mobile
      await Linking.openURL(url);
    } else {
      Alert.alert(`Don't know how to open this URL: ${url}`);
    }
  };

  console.log("USER BOOKINGS", userBookings);
  return (
    <View style={{ flex: 1, backgroundColor: Colors.primary }}>
      <ImageBackground
        source={require("../../assets/images/MyRentalsBackgroundImage.png")}
        style={{ width: "100%", height: "100%" }}
        imageStyle={{ opacity: 1 }}
        resizeMode="stretch"
        borderRadius={5}
      >
        <View style={{ padding: 10 }}>
          <FlatList
            bounces={true}
            pagingEnabled={false}
            onRefresh={loadBookings}
            refreshing={isRefreshing}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            data={userBookings}
            keyExtractor={(item) => item.id}
            renderItem={(itemData) => (
              <View key={itemData.item.id} style={{ padding: 10 }}>
                <TouchableComponent
                  onPress={() => openModalHandler(itemData.item)}
                  borderRadius={10}
                  style={styles.card}
                >
                  <View
                    style={{
                      padding: 10,
                      flexDirection: "row",
                      justifyContent: "space-evenly",
                    }}
                  >
                    <Text style={styles.text}>
                      {" "}
                      {"Date: " + fDatesArr[itemData.item.date]}{" "}
                    </Text>
                    <Text style={styles.assetText}>
                      {" "}
                      {itemData.item.asset.assetType}{" "}
                    </Text>
                    <Text style={styles.text}>
                      {" "}
                      {"Hours: " + itemData.item.hours}{" "}
                    </Text>
                  </View>
                </TouchableComponent>
              </View>
            )}
          />

          <View>
            <RentalsScreenModal
              modalStatus={modalStatus}
              assetImg={object.asset.image}
              onClose={closeModalHandler}
              date={fDatesArr[object.date]}
              hours={object.hours}
              description={object.asset.description}
              price={object.asset.price}
              address={object.asset.address}
              onWaze={() => handlePress(object.asset.location)}
            />
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

export const screenOptions = {
  headerTitle: "Rentals",
};

const styles = StyleSheet.create({
  temp: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    elevation: 2,
    borderRadius: 10,
    backgroundColor: "rgba(40, 32, 46, 0.6)",
    width: "90%",
    alignSelf: "center",
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  text: {
    fontSize: 13,
    color: "white",
  },
  assetText: {
    fontSize: 13,
    color: "white",
    alignSelf: "center",
    position: "relative",
    marginTop: "8%",
  },
  activityIndicator: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default MyRentalsScreen;
