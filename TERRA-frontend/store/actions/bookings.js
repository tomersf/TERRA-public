import ENV from "../../env";
import Booking from "../../models/Booking";
import Asset from "../../models/Asset";
import { Alert } from "react-native";

export const DELETE_BOOKING = "DELETE_BOOKING";
export const ADD_BOOKING = "ADD_BOOKING";
export const GET_ALL_BOOKINGS = "GET_ALL_BOOKINGS";
export const UPDATE_BOOKING = "UPDATE_BOOKING";
export const GET_AVAILABLE_BOOKINGS = "GET_AVAILABLE_BOOKINGS";

export const deleteBooking = (bookingId) => {
  return { type: DELETE_BOOKING, bookingData: bookingId };
};

export const addBooking = (
  userId,
  bookingId,
  bookingDate,
  bookingHours,
  available,
  assetId,
  ownerId,
  assetType,
  imageUrl,
  description,
  address,
  price,
  location,
  city
) => {
  return async (dispatch) => {
    console.log("inside action");
    console.log(userId);
    console.log(assetId);
    console.log(bookingHours);
    console.log(bookingDate);

    try {
      const response = await fetch(`${ENV.serverURL}/bookings/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          booker: userId,
          assetId: assetId,
          hours: bookingHours,
          date: bookingDate,
        }),
      });

      if (!response.ok) {
        console.log(response);
        Alert.alert(
          "Error occured!",
          "Booking did not work, please try again later!"
        );
        return;
      }

      dispatch({
        type: ADD_BOOKING,
        bookingData: {
          userId,
          bookingId,
          bookingDate,
          bookingHours,
          available,
          assetId,
          ownerId,
          assetType,
          imageUrl,
          description,
          address,
          price,
          location,
          city,
        },
      });
    } catch (err) {
      console.log(err);
    }
  };
};

export const updateBooking = (userId, bookingId, available, wasPaid) => {
  return {
    type: UPDATE_BOOKING,
    paymentData: {
      userId,
      bookingId,
      available,
      wasPaid,
    },
  };
};

export const getAvailableTimeBookings = (assetId, date) => {
  return async (dispatch) => {
    // fetch from backend all available time slots
    try {
      const response = await fetch(
        `${ENV.serverURL}/assets/${assetId}/${date}`
      );

      if (!response.ok) {
        throw new Error("Somthing went wrong!");
      }

      const resData = await response.json();
      const availableTimeSlots = [];

      for (const item in resData) {
        let index = 0;
        loadedAssets.push(resData[item][index]);
        index = index + 1;
      }

      dispatch({ type: GET_AVAILABLE_BOOKINGS, timeSlots: availableTimeSlots });
    } catch (err) {
      //send to analytic server
      throw err;
    }
  };
};

export const getAllBookings = (userId) => {
  return async (dispatch) => {
    // fetch from backend all bookings
    try {
      console.log(userId);
      const response = await fetch(`${ENV.serverURL}/bookings/${userId}`);

      if (!response.ok) {
        throw new Error("Somthing went wrong!");
      }

      const resData = await response.json();
      console.log(resData.bookings);
      const loadedBookings = resData.bookings;

      dispatch({ type: GET_ALL_BOOKINGS, bookingsArr: resData.bookings });
    } catch (err) {
      //send to analytic server
      throw err;
    }
  };
};
