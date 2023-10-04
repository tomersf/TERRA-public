import {
  ADD_BOOKING,
  DELETE_BOOKING,
  UPDATE_BOOKING,
  GET_AVAILABLE_BOOKINGS,
  GET_ALL_BOOKINGS,
} from "../actions/bookings";

const initialState = {
  userBookings: [],
  availableBookings: [],
  datesArr: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD_BOOKING:
      return {
        ...state,
      };

    case DELETE_BOOKING:
      return {
        ...state,
        userBookings: state.userBookings.filter(
          (booking) => booking.bookingId !== action.bookingData
        ),
      };

    case UPDATE_BOOKING:
      const bookingIndex = state.userBookings.findIndex(
        (booking) => (booking.bookingId = action.paymentData.bookingId)
      );
      const updatedBooking = state.userBookings[bookingIndex];
      const updatedUserBookings = [...state.userBookings];
      updatedUserBookings[bookingIndex] = updatedBooking;
      return {
        ...state,
        userBookings: updatedUserBookings,
      };

    case GET_AVAILABLE_BOOKINGS:
      return {
        ...state,
        availableBookings: action.timeSlots,
      };

    case GET_ALL_BOOKINGS:
      //------------------Dates formatting------------------
      let newDatesArray = [];
      let formattedDate;
      action.bookingsArr.forEach((element) => {
        formattedDate = element.date.split("T")[0];
        formattedDate = formattedDate.split("-");
        formattedDate =
          formattedDate[2] + "/" + formattedDate[1] + "/" + formattedDate[0];
        newDatesArray[element.date] = formattedDate;
        //------------------Dates formatting------------------
      });
      return {
        ...state,
        userBookings: action.bookingsArr,
        datesArr: newDatesArray,
      };
  }
  return state;
};
