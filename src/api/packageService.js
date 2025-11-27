import { ENDPOINTS } from './endpoints';
import api from './api';

export const getPackages = async () => {
    const response = await api.get(ENDPOINTS.GET_PACKAGES);
    return response.data;
};


export const fetchPaymentIntent = async () => {
    const response = await api.post(ENDPOINTS.SETUP_INTENT);
    console.log("intent: ", response);

    return response;
};

export const handlePaymentSuccess = async payment_intent_id => {
    const res = await api.post(ENDPOINTS.PAYMENT, {
        payment_intent_id,
    });
    return res;
};