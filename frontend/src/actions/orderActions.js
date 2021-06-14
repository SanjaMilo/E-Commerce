import axios from 'axios';
import { ORDER_CREATE_REQUEST, ORDER_CREATE_SUCCESS, ORDER_CREATE_FAIL, ORDER_DETAILS_REQUEST, ORDER_DETAILS_SUCCESS, ORDER_DETAILS_FAIL, ORDER_PAY_REQUEST, ORDER_PAY_SUCCESS, ORDER_PAY_FAIL, ORDER_LIST_MY_REQUEST, ORDER_LIST_MY_SUCCESS, ORDER_LIST_MY_FAIL, ORDER_LIST_REQUEST, ORDER_LIST_SUCCESS, ORDER_LIST_FAIL, ORDER_DELIVER_REQUEST, ORDER_DELIVER_SUCCESS, ORDER_DELIVER_FAIL } from '../actionTypes/orderActionTypes';
import { logoutAction } from './userActions';

export const orderCreateAction = (order) => async (dispatch, getState) => {
    // we can get user info from getState() which has the token, that we need to pass in (send)
    try {
        dispatch({
            type: ORDER_CREATE_REQUEST
        });

        const { userLogin: { userInfo }} = getState(); // two levels destructuring getState() -> getState().userLogin.userInfo ... we want userInfo for the token

        // here we want to pass token
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`,
            }
        };

        const { data } = await axios.post(`/api/orders`, order, config); // order is the data (object) we want to update with

        dispatch({
            type: ORDER_CREATE_SUCCESS,
            payload: data // data is the newly created order
        });

    } catch (error) {
        dispatch({
            type: ORDER_CREATE_FAIL,
            payload: 
            error.response && error.response.data.message ? error.response.data.message : error.message
        });
    };
};


export const getOrderDetailsAction = (id) => async (dispatch, getState) => {
    // we can get user info from getState() which has the token, that we need to pass in (send)
    try {
        dispatch({
            type: ORDER_DETAILS_REQUEST
        });

        const { userLogin: { userInfo }} = getState(); // two levels destructuring getState() -> getState().userLogin.userInfo ... we want userInfo for the token

        // here we want to pass token
        const config = {
            headers: {
                // it's a GET req, we don't need to have 'Content-Type'
                Authorization: `Bearer ${userInfo.token}`,
            }
        };

        const { data } = await axios.get(`/api/orders/${id}`, config); 

        dispatch({
            type: ORDER_DETAILS_SUCCESS,
            payload: data // data is the newly created order
        });

    } catch (error) {
        dispatch({
            type: ORDER_DETAILS_FAIL,
            payload: 
            error.response && error.response.data.message ? error.response.data.message : error.message
        });
    };
};


export const payOrderAction = (orderId, paymentResult) => async (dispatch, getState) => {
    // paymentResult is coming from PayPal
    // we can get user info from getState() which has the token, that we need to pass in (send)
    try {
        dispatch({
            type: ORDER_PAY_REQUEST
        });

        const { userLogin: { userInfo }} = getState(); // two levels destructuring getState() -> getState().userLogin.userInfo ... we want userInfo for the token

        // here we want to pass token
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`,
            }
        };

        const { data } = await axios.put(`/api/orders/${orderId}/pay`, paymentResult, config); // we don't pass in the order, it is already there

        dispatch({
            type: ORDER_PAY_SUCCESS,
            payload: data 
        });

    } catch (error) {
        dispatch({
            type: ORDER_PAY_FAIL,
            payload: 
            error.response && error.response.data.message ? error.response.data.message : error.message
        });
    };
};


export const deliverOrderAction = (order) => async (dispatch, getState) => {
    // paymentResult is coming from PayPal
    // we can get user info from getState() which has the token, that we need to pass in (send)
    try {
        dispatch({
            type: ORDER_DELIVER_REQUEST
        });

        const { userLogin: { userInfo }} = getState(); // two levels destructuring getState() -> getState().userLogin.userInfo ... we want userInfo for the token

        // here we want to pass token
        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`,
            }
        };

        const { data } = await axios.put(`/api/orders/${order._id}/deliver`, {}, config); // we are not sending any data, so we are passing empty object

        dispatch({
            type: ORDER_DELIVER_SUCCESS,
            payload: data 
        });

    } catch (error) {
        dispatch({
            type: ORDER_DELIVER_FAIL,
            payload: 
            error.response && error.response.data.message ? error.response.data.message : error.message
        });
    };
};


export const listMyOrdersAction = () => async (dispatch, getState) => {
    // we can get user info from getState() which has the token, that we need to pass in (send)
    try {
        dispatch({
            type: ORDER_LIST_MY_REQUEST
        });

        const { userLogin: { userInfo }} = getState(); // two levels destructuring getState() -> getState().userLogin.userInfo ... we want userInfo for the token

        // here we want to pass token
        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`,
            }
        };

        const { data } = await axios.get(`/api/orders/myorders`, config); 

        dispatch({
            type: ORDER_LIST_MY_SUCCESS,
            payload: data // data is the orders of that particular logged in user
        });

    } catch (error) {
        const message = error.response && error.response.data.message ? error.response.data.message : error.message
        if (message === 'Not authorized, token failed') {
            dispatch(logoutAction());
        }

        dispatch({
            type: ORDER_LIST_MY_FAIL,
            payload: message
        });
    };
};


export const listOrdersAction = () => async (dispatch, getState) => {
    // we can get user info from getState() which has the token, that we need to pass in (send)
    try {
        dispatch({
            type: ORDER_LIST_REQUEST
        });

        const { userLogin: { userInfo }} = getState(); // two levels destructuring getState() -> getState().userLogin.userInfo ... we want userInfo for the token

        // here we want to pass token
        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`,
            }
        };

        const { data } = await axios.get(`/api/orders`, config); 

        dispatch({
            type: ORDER_LIST_SUCCESS,
            payload: data // data is the orders of that particular logged in user
        });

    } catch (error) {
        const message = error.response && error.response.data.message ? error.response.data.message : error.message
        if (message === 'Not authorized, token failed') {
            dispatch(logoutAction());
        }

        dispatch({
            type: ORDER_LIST_FAIL,
            payload: message
        });
    };
};

