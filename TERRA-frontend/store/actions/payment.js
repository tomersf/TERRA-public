
export const ADD_PAYMENT = 'ADD_PAYMENT';
export const REMOVE_PAYMENT = 'REMOVE_PAYMENT';
export const UPDATE_PAYMENT = 'UPDATE_PAYMENT';
export const CANCEL_PAYMENT = 'CANCEL_PAYMENT';
export const INITIAL_CANCEL = 'INITIAL_CANCEL';
export const INITIAL_PAID = 'INITIAL_PAID';

export const addToPayment = ( 
    userId, 
    assetPrice
    ) => {
    return {type: ADD_PAYMENT, paymentData: {
        userId, 
        assetPrice, 
    }};
}

export const removePayment = (bookingId, price) => {
    return {type: REMOVE_PAYMENT, paymentData: { bookingId, price }};
};

export const makePayment = () => {
    return {type: UPDATE_PAYMENT}
}

export const cancelPayment = () => {
    return {type : CANCEL_PAYMENT}
}

export const initialCancelParam = () => {
    return {type: INITIAL_CANCEL}
}

export const initialWasPaidParam = () => {
    return {type: INITIAL_PAID}
}