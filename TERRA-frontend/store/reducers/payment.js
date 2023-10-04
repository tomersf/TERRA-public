import {
  ADD_PAYMENT,
  UPDATE_PAYMENT,
  REMOVE_PAYMENT,
  CANCEL_PAYMENT,
  INITIAL_CANCEL,
  INITIAL_PAID,
} from "../actions/payment";
import Payment from "../../models/Payment";
import DUMMY_PAYMENTS from "../../data/dummy-payments";

const initialState = {
  userPayments: DUMMY_PAYMENTS,
  Paid: false,
  totalAmount: 0,
  cancelPayment: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD_PAYMENT:
      const newPaymentItem = new Payment(
        action.paymentData.userId,
        action.paymentData.assetPrice
      );

      return {
        ...state,
        userPayments: state.userPayments.concat(newPaymentItem),
        totalAmount: state.totalAmount + action.paymentData.assetPrice,
      };

    case REMOVE_PAYMENT:
      return {
        ...state,
        items: state.userPayments.filter(
          (payment) => payment.bookingId !== action.paymentData.bookingId
        ),
        totalAmount: state.totalAmount - action.paymentData.price,
      };

    case UPDATE_PAYMENT:
      return {
        ...state,
        userPayments: (state.userPayments = []),
        totalAmount: (state.totalAmount = 0),
        Paid: (state.Paid = true),
      };

    case CANCEL_PAYMENT:
      return {
        ...state,
        cancelPayment: true,
        userPayments: [],
        totalAmount: 0,
      };

    case INITIAL_CANCEL:
      return {
        ...state,
        cancelPayment: false,
      };

    case INITIAL_PAID:
      return {
        ...state,
        Paid: false,
      };
  }
  return state;
};
