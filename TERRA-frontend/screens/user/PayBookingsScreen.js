import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Alert,
  TouchableOpacity,
  BackHandler,
} from "react-native";
import { CardField, useConfirmPayment } from "@stripe/stripe-react-native";
import { useSelector, useDispatch } from "react-redux";
import { useIsFocused } from "@react-navigation/native";

import Fonts from "../../constants/Fonts";
import * as paymentActions from "../../store/actions/payment";
import Routes from "../../constants/Routes";

const PayBookingsScreen = (props) => {
  const bookingsTotalAmount = useSelector((state) => state.payment.totalAmount);
  const onCancelPayment = useSelector((state) => state.payment.cancelPayment);
  const userName = useSelector((state) => state.auth.userName);
  const [email, setEmail] = useState();
  const [cardDetails, setCardDetails] = useState();
  const [balance, setBalance] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [paid, setPaid] = useState(0);
  const [totalPaymet, setTotalPayment] = useState(0);
  const { confirmPayment, loading } = useConfirmPayment();
  const userBookings = useSelector((state) => state.bookings.userBookings);
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const pushToken = props.route.params.pushToken;

  useEffect(() => {
    if (!isFocused) {
      dispatch(paymentActions.cancelPayment());
      props.navigation.popToTop();
    }
  }, [isFocused]);

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", function () {
      return true;
    });
  }, []);

  const cancelPaymentHandler = async () => {
    Alert.alert(
      "Are you sure?",
      "This action will cancel all of your bookings!",
      [
        { text: "No", style: "default" },
        {
          text: "Yes",
          style: "destructive",
          onPress: () => {
            dispatch(paymentActions.cancelPayment());
            props.navigation.navigate(Routes.SCREEN_FIND_ASSET);
          },
        },
      ]
    );
  };

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", function () {
      return true;
    });
  }, []);

  const triggerPaymentNotificationHandler = () => {
    fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-Encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: pushToken,
        title: "Asset booked!",
        body: "One of your assets was booked by a user!",
      }),
    });
  };

  const paymentHandler = async () => {
    if (bookingsTotalAmount === 0) {
      Alert.alert("No payment to do!");
      return;
    }

    if (!cardDetails?.complete || !email) {
      Alert.alert("Please Enter Complete card details and Email");
      return;
    }

    Alert.alert(
      "Payment was successful",
      "Receipt was sent to your email box",
      [{ text: "Okay", style: "default" }]
    );
    //------ Initalize Values
    setPaid(
      discount > 0
        ? bookingsTotalAmount - discount * bookingsTotalAmount
        : bookingsTotalAmount
    );
    setBalance(0);
    setTotalPayment(0);
    dispatch(paymentActions.makePayment(paymentActions.UPDATE_PAYMENT));
    //------ Initalize Values
    triggerPaymentNotificationHandler();
    props.navigation.navigate(Routes.SCREEN_MY_RENTALS);
  };

  return (
    <View style={styles.container}>
      <View style={styles.userContainer}>
        <Text style={styles.user}>Hello, {userName}</Text>
        <Text>Your billing information:</Text>
      </View>
      <View style={styles.textContainer}>
        <View
          style={{ backgroundColor: "#efefefef", borderRadius: 8, padding: 5 }}
        >
          <Text style={styles.text}>Balance: {bookingsTotalAmount}</Text>
          <Text style={styles.text}>Discount: {discount}</Text>
          <Text style={styles.text}>
            Total Payment:{" "}
            {discount > 0
              ? bookingsTotalAmount - discount * bookingsTotalAmount
              : bookingsTotalAmount}
          </Text>
          <Text>____________________________________</Text>
          <Text style={styles.text}>Paid: {paid} </Text>
        </View>
      </View>
      <View style={styles.inputContainer} borderRadius={10}>
        <TextInput
          autoCapitalize="none"
          placeholder="E-mail"
          keyboardType="email-address"
          onChange={(value) => setEmail(value.nativeEvent.text)}
          style={styles.input}
        />
        <CardField
          postalCodeEnabled={false}
          placeholder={{
            number: "XXXX XXXX XXXX XXXX",
          }}
          cardStyle={styles.card}
          style={styles.cardContainer}
          onCardChange={(cardDetails) => {
            setCardDetails(cardDetails);
          }}
        />
      </View>

      <View style={styles.buttons}>
        <View style={styles.cancelButton} borderRadius={10}>
          <TouchableOpacity
            onPress={cancelPaymentHandler}
            disabled={bookingsTotalAmount === 0 ? true : false}
          >
            <Text style={styles.buttonText}>Cancel Payment</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.payButton} borderRadius={10}>
          <TouchableOpacity
            onPress={paymentHandler}
            disabled={bookingsTotalAmount === 0 ? true : false}
          >
            <Text style={styles.buttonText}>Confirm Payment</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#6495ed",
  },
  input: {
    backgroundColor: "#efefefef",
    borderRadius: 8,
    fontSize: 20,
    height: 50,
    padding: 10,
  },
  inputContainer: {
    backgroundColor: "rgba(40, 32, 46, 0.4)",
    padding: 20,
    margin: 20,
  },
  card: {
    backgroundColor: "#efefefef",
    borderRadius: 10,
  },
  cardContainer: {
    height: 50,
    marginVertical: 30,
  },
  user: {
    fontSize: 25,
    fontFamily: Fonts.OPEN_SANS_BOLD,
  },
  userContainer: {
    position: "relative",
    top: -40,
    margin: 15,
  },
  textContainer: {
    position: "relative",
    bottom: 40,
    backgroundColor: "rgba(40, 32, 46, 0.4)",
    padding: 20,
    borderRadius: 8,
    margin: 5,
  },
  text: {
    backgroundColor: "#efefefef",
    fontSize: 15,
    fontFamily: Fonts.OPEN_SANS_BOLD,
    borderRadius: 6,
  },
  payButton: {
    backgroundColor: "#b0c4de",
    width: "44%",
    alignSelf: "center",
    padding: 10,
    position: "relative",
    bottom: -30,
    elevation: 3,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
  },
  cancelButton: {
    backgroundColor: "#ffa07a",
    width: "44%",
    alignSelf: "center",
    padding: 10,
    position: "relative",
    bottom: -30,
    elevation: 3,
  },
  buttonText: {
    textAlign: "center",
    fontSize: 18,
  },
});

export default PayBookingsScreen;
