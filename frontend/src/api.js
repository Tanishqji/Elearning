import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const registerUser = (data) => axios.post(`${API_URL}/auth/register`, data);
export const loginUser = (data) => axios.post(`${API_URL}/auth/login`, data);

export const checkAccess = (token) => axios.get(`${API_URL}/books/access`, {
    headers: { Authorization: `Bearer ${token}` }
});

export const createOrder = (token) => axios.post(`${API_URL}/payment/create-order`, {}, {
    headers: { Authorization: `Bearer ${token}` }
});

export const verifyPayment = (token, data) => axios.post(`${API_URL}/payment/verify-payment`, data, {
    headers: { Authorization: `Bearer ${token}` }
});
