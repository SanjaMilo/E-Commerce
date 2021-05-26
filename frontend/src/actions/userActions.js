import { USER_DETAILS_FAIL, USER_DETAILS_REQUEST, USER_DETAILS_SUCCESS, USER_LOGIN_FAIL, USER_LOGIN_REQUEST, USER_LOGIN_SUCCESS, USER_LOGOUT, USER_REGISTER_FAIL, USER_REGISTER_REQUEST, USER_REGISTER_SUCCESS, USER_UPDATE_PROFILE_FAIL, USER_UPDATE_PROFILE_REQUEST, USER_UPDATE_PROFILE_SUCCESS, USER_DETAILS_RESET, USER_LIST_REQUEST, USER_LIST_SUCCESS, USER_LIST_FAIL } from "../actionTypes/userActionTypes";
import { ORDER_LIST_MY_RESET } from '../actionTypes/orderActionTypes';
import axios from 'axios';

export const login = (email, password) => async (dispatch) => {
    try {
        dispatch({
            type: USER_LOGIN_REQUEST
        });
        // when we are sending data, we want to send in the headers, a content type of application/json, and pass in the token for protected routes authorization
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const { data } = await axios.post('/api/users/login', { email, password }, config);

        dispatch({
            type: USER_LOGIN_SUCCESS,
            payload: data
        });

        localStorage.setItem('userInfo', JSON.stringify(data));

    } catch (error) {
        dispatch({
            type: USER_LOGIN_FAIL,
            payload: 
            error.response && error.response.data.message ? error.response.data.message : error.message
        });
    };
}; 


export const logout = () => (dispatch) => {

    localStorage.removeItem('userInfo');
    localStorage.removeItem('cartItems');
    localStorage.removeItem('shippingAddress');
    localStorage.removeItem('paymentMethod');

    dispatch({
        type: USER_LOGOUT
    });
    dispatch({
        type: USER_DETAILS_RESET
    });
    dispatch({
        type: ORDER_LIST_MY_RESET
    });

    document.location.href = '/login';
    
};


export const register = (name, email, password) => async (dispatch) => {
    try {
        dispatch({
            type: USER_REGISTER_REQUEST
        });
        // when we are sending data, we want to send in the headers, a content type of application/json, and pass in the token for protected routes authorization
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const { data } = await axios.post('/api/users', { name, email, password }, config);

        dispatch({
            type: USER_REGISTER_SUCCESS,
            payload: data
        });
        // Also we want to login the user, right away they register:
        dispatch({
            type: USER_LOGIN_SUCCESS,
            payload: data
        });

        localStorage.setItem('userInfo', JSON.stringify(data));

    } catch (error) {
        dispatch({
            type: USER_REGISTER_FAIL,
            payload: 
            error.response && error.response.data.message ? error.response.data.message : error.message
        });
    };
};


export const getUserDetails = (id) => async (dispatch, getState) => {
    // we can get user info from getState() which has the token, that we need to pass in (send)
    try {
        dispatch({
            type: USER_DETAILS_REQUEST
        });

        const { userLogin: { userInfo }} = getState(); // two levels destructuring getState() -> getState().userLogin.userInfo ... we want userInfo for the token

        // here we want to pass token
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`,
            }
        };

        const { data } = await axios.get(`/api/users/${id}`, config); // the id might be profile

        dispatch({
            type: USER_DETAILS_SUCCESS,
            payload: data
        });

    } catch (error) {
        dispatch({
            type: USER_DETAILS_FAIL,
            payload: 
            error.response && error.response.data.message ? error.response.data.message : error.message
        });
    };
};


export const updateUserProfile = (user) => async (dispatch, getState) => {
    // we can get user info from getState() which has the token, that we need to pass in (send)
    try {
        dispatch({
            type: USER_UPDATE_PROFILE_REQUEST
        });

        const { userLogin: { userInfo }} = getState(); // two levels destructuring getState() -> getState().userLogin.userInfo ... we want userInfo for the token

        // here we want to pass token
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`,
            }
        };

        const { data } = await axios.put(`/api/users/profile`, user, config); // user is the data we want to update with

        dispatch({
            type: USER_UPDATE_PROFILE_SUCCESS,
            payload: data
        });

    } catch (error) {
        dispatch({
            type: USER_UPDATE_PROFILE_FAIL,
            payload: 
            error.response && error.response.data.message ? error.response.data.message : error.message
        });
    };
};


export const listUsersAction = () => async (dispatch, getState) => {
    // we can get user info from getState() which has the token, that we need to pass in (send)
    try {
        dispatch({
            type: USER_LIST_REQUEST
        });

        const { userLogin: { userInfo }} = getState(); // two levels destructuring getState() -> getState().userLogin.userInfo ... we want userInfo for the token

        // here we want to pass token
        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`,
            }
        };

        const { data } = await axios.get(`/api/users`, config);

        dispatch({
            type: USER_LIST_SUCCESS,
            payload: data
        });

    } catch (error) {
        dispatch({
            type: USER_LIST_FAIL,
            payload: 
            error.response && error.response.data.message ? error.response.data.message : error.message
        });
    };
};

