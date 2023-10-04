import React, { useState, useEffect, useCallback } from "react";
import {
  ScrollView,
  View,
  Text,
  Button,
  Platform,
  Modal,
  Alert,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  ActivityIndicator,
} from "react-native";

import { useDispatch, useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import Colors from "../../../constants/Colors";
import Fonts from "../../../constants/Fonts";
import * as bookingActions from "../../../store/actions/bookings";
import * as paymentActions from "../../../store/actions/payment";
import { useHttpClient } from "../../../hooks/http-hook";
import ENV from "../../../env";
import Routes from "../../../constants/Routes";

const BookingAssetModal = (props) => {
  const [timeSlots, setTimeSlots] = useState([]);
  const userId = useSelector((state) => state.auth.userId);
  const wasPaid = useSelector((state) => state.payment.Paid);
  const cancelPayment = useSelector((state) => state.payment.cancelPayment);
  const { isLoading, sendRequest } = useHttpClient();
  const { selectedAsset } = props;
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);
  const [text, setText] = useState("Set Date");
  const [timeSlotsTaken, setTimeSlotsTaken] = useState([]);
  const dispatch = useDispatch();
  const todayDate = new Date();
  const currDateMonth = todayDate.getUTCMonth();
  const currDateDay = todayDate.getDate();
  const nextWeekDate = new Date(
    todayDate.getFullYear(),
    todayDate.getMonth(),
    todayDate.getDate() + 7
  );
  const nextWeekDateMonth = nextWeekDate.getUTCMonth();
  const nextWeekDay = nextWeekDate.getDate();

  //---------------Set Calendar Date----------------------------------------

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === "ios");
    setDate(currentDate);

    let tempDate = new Date(currentDate);
    let fDate =
      tempDate.getDate() +
      "/" +
      (tempDate.getMonth() + 1) +
      "/" +
      tempDate.getFullYear();
    setText(fDate);
  };

  //------------------------------------------------------------------------

  const manageBooking = (item) => {
    if (timeSlotsTaken.indexOf(item) >= 0) {
      setTimeSlotsTaken((prevSlots) =>
        prevSlots.filter((timeSlot) => timeSlot !== item)
      );
    } else {
      setTimeSlotsTaken((prevSlots) => prevSlots.concat(item));
    }
  };

  //------------------------------------------------------------------------

  useEffect(() => {
    if (cancelPayment) {
      setTimeSlotsTaken([]);
      dispatch(paymentActions.initialCancelParam());
    }
  }, [cancelPayment]);

  //------------------------------------------------------------------------

  useEffect(() => {
    if (text == "Set Date") {
      return;
    }
    const fetchTimeSlots = async (assetId, date) => {
      try {
        const [day, month, year] = date.split("/");
        const timeSlotsResponse = await sendRequest(
          `${ENV.serverURL}/assets/avilability/${assetId}/${day}/${month}/${year}`
        );

        console.log(timeSlotsResponse.slots);
        setTimeSlots(timeSlotsResponse.slots);
      } catch (err) {}
    };

    fetchTimeSlots(selectedAsset.id, text);
  }, [text]);

  //------------------------------------------------------------------------

  useEffect(() => {
    if (wasPaid && timeSlotsTaken.length > 0) {
      dispatch(paymentActions.initialWasPaidParam());
      let hoursToPop = "";
      timeSlotsTaken.forEach((item) => {
        if (text !== "Set Date") {
          hoursToPop = hoursToPop + " " + item;
          let bookingId =
            selectedAsset.id + " " + userId + " " + text + " " + item;
          console.log("checking user booking params");
          console.log(userId);
          console.log(item);
          console.log(selectedAsset.id);
          let newDate = text.split("/");
          newDate = newDate[1] + "/" + newDate[0] + "/" + newDate[2];
          console.log(newDate);

          dispatch(
            bookingActions.addBooking(
              userId,
              bookingId,
              newDate,
              item,
              false,
              selectedAsset.id,
              selectedAsset.ownerId,
              selectedAsset.assetType,
              selectedAsset.imageUrl,
              selectedAsset.description,
              selectedAsset.address,
              selectedAsset.price,
              selectedAsset.mapLocation,
              selectedAsset.city
            )
          );
        } else {
          Alert.alert("Error", "Something went wrong please try again");
          setTimeSlotsTaken([]);
          return;
        }
      });

      Alert.alert("Bookings Display", "You Booked:" + hoursToPop);
      setTimeSlotsTaken([]);
    }
  }, [wasPaid]);

  //------------------------------------------------------------------------

  const cancelModalHandler = useCallback(() => {
    setTimeSlotsTaken([]);
  }, []);

  //------------------------------------------------------------------------

  const confirmModalHandler = () => {
    console.log("pressed confirm");
    if (timeSlotsTaken.length > 0) {
      console.log(selectedAsset.price);
      console.log(userId);
      timeSlotsTaken.forEach((item) => {
        dispatch(paymentActions.addToPayment(userId, selectedAsset.price));
      });
      console.log("pressed confirm");
      props.navigation.navigate(Routes.SCREEN_PAY_BOOKINGS, {
        pushToken: selectedAsset.ownerPushToken,
      });
    }
    //props.navigation.navigate(Routes.SCREEN_PAY_BOOKINGS);
  };

  //------------------------------------------------------------------------

  let toDisplay =
    text === "Set Date" ? (
      <Text style={{ fontFamily: Fonts.OPEN_SANS_BOLD }}>
        Please Chose relevant date
      </Text>
    ) : (
      <View>
        <Text style={{ fontSize: 20 }}>Dont Waste Time!</Text>
        <Text style={{ fontSize: 20 }}> Choose Your </Text>
        <Text style={{ fontSize: 20 }}> Activity Hours Now!</Text>
      </View>
    );

  //------------------------------------------------------------------------

  return (
    <Modal visible={props.visible} animationType="fade">
      <View style={styles.container}>
        <ImageBackground
          source={require("../../../assets/images/sportBackgroundImage.png")}
          style={{ width: "100%", height: "100%" }}
          imageStyle={{ opacity: 0.8 }}
        >
          <View>
            {show && (
              <DateTimePicker
                minimumDate={
                  new Date(
                    todayDate.getUTCFullYear(),
                    currDateMonth,
                    currDateDay
                  )
                }
                maximumDate={
                  new Date(
                    nextWeekDate.getUTCFullYear(),
                    nextWeekDateMonth,
                    nextWeekDay
                  )
                }
                testID="dateTimePicker"
                value={date}
                mode={mode}
                is24Hour={true}
                display="calendar"
                onChange={onChange}
              />
            )}
          </View>
          <View style={styles.headerCotainer}>
            <Text style={styles.headerText}>{"Date: " + text}</Text>
            <View style={styles.headerIcon}>
              <Ionicons
                name="calendar-outline"
                size={40}
                color={Colors.accent}
                onPress={() => setShow(true)}
              />
            </View>
          </View>
          <View style={styles.textToDisplay}>{toDisplay}</View>
          <View style={{ marginTop: "7%", height: "35%", padding: 5 }}>
            <ScrollView pagingEnabled={false} bounces={true}>
              {isLoading && (
                <ActivityIndicator size="large" color={Colors.black} />
              )}
              {timeSlots.length > 0 &&
                !isLoading &&
                timeSlots.map((item, index) => (
                  <View key={index} style={styles.buttonsContainer}>
                    <TouchableOpacity
                      onPress={() => manageBooking(timeSlots[index], index)}
                      style={{
                        padding: 4,
                        borderColor: "blue",
                        borderWidth: 1,
                        borderRadius: 10,
                        height: 30,
                        width: 100,
                        backgroundColor:
                          timeSlotsTaken.indexOf(item) >= 0
                            ? Colors.redButton
                            : "#7fffd4",
                        borderColor:
                          timeSlotsTaken.indexOf(item) >= 0
                            ? "lightcyan"
                            : "#7fffd4",
                        elevation: 6,
                      }}
                    >
                      <Text style={styles.buttonsText}>{item}</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              {timeSlots.length == 0 && !isLoading && (
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ ...Fonts.body1 }}>No Hours avilable!</Text>
                </View>
              )}
            </ScrollView>
          </View>
          <View style={styles.modalButtonsContainer}>
            <View style={styles.modalButton}>
              <Button
                color={Colors.redButton}
                onPress={props.onCancel}
                title="Cancel"
              />
            </View>
            <View style={styles.modalButton}>
              <Button
                color={Colors.primary}
                onPress={confirmModalHandler}
                title="Confirm"
                disabled={timeSlotsTaken.length <= 0 ? true : false}
              />
            </View>
          </View>
        </ImageBackground>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerCotainer: {
    backgroundColor: "rgba(52, 52, 52, 0.6)",
    flexDirection: "row",
    color: Colors.primary,
    justifyContent: "space-around",
  },
  headerText: {
    textAlign: "center",
    padding: 10,
    marginTop: "2%",
    fontSize: 25,
    color: "black",
    right: 20,
    color: "white",
  },
  headerIcon: {
    position: "relative",
    left: 30,
    marginTop: "3%",
  },
  modalButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    position: "absolute",
    marginTop: "120%",
    alignSelf: "center",
  },
  modalButton: {
    width: "40%",
    justifyContent: "center",
    alignSelf: "center",
    borderRadius: 10,
  },
  textToDisplay: {
    padding: 15,
    alignSelf: "center",
    marginTop: "15%",
    backgroundColor: "#efefefef",
    borderTopEndRadius: 60,
    borderBottomStartRadius: 60,
  },
  buttonsContainer: {
    alignItems: "center",
    padding: 5,
  },
  buttonsText: {
    textAlign: "center",
    fontFamily: Fonts.OPEN_SANS_BOLD,
    color: "black",
  },
  image: {
    flex: 1,
    justifyContent: "center",
    width: "100%",
    height: "100%",
  },
});

export default React.memo(BookingAssetModal);
