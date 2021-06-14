import { PRODUCT_LIST_REQUEST, PRODUCT_LIST_SUCCESS, PRODUCT_LIST_FAIL, PRODUCT_DETAILS_REQUEST, PRODUCT_DETAILS_SUCCESS, PRODUCT_DETAILS_FAIL, PRODUCT_DELETE_REQUEST, PRODUCT_DELETE_SUCCESS, PRODUCT_DELETE_FAIL, PRODUCT_CREATE_REQUEST, PRODUCT_CREATE_SUCCESS, PRODUCT_CREATE_FAIL, PRODUCT_UPDATE_REQUEST, PRODUCT_UPDATE_SUCCESS, PRODUCT_UPDATE_FAIL, PRODUCT_UPDATE_RESET } from '../actionTypes/productActionTypes';
import axios from 'axios';

export const listProductsAction = () => async (dispatch) => {
    try {
        dispatch({ type: PRODUCT_LIST_REQUEST });
        // destructuring axios response like this: { data } which equals to res.data
        const { data } = await axios.get('/api/products');

        dispatch({
            type: PRODUCT_LIST_SUCCESS,
            payload: data
        });
    } catch (error) {
        dispatch({
            type: PRODUCT_LIST_FAIL,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message
        });
    };
};

// error.response is the generic error message
// error.response.data.message (if there is our custom error message)

export const detailsProductAction = (id) => async (dispatch) => {
    try {
        dispatch({ type: PRODUCT_DETAILS_REQUEST });
        // destructuring axios response like this: { data } which equals to res.data
        const { data } = await axios.get(`/api/products/${id}`);

        dispatch({
            type: PRODUCT_DETAILS_SUCCESS,
            payload: data
        });
    } catch (error) {
        dispatch({
            type: PRODUCT_DETAILS_FAIL,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message
        });
    };
};

export const deleteProductAction = (id) => async (dispatch, getState) => {
    // we can get user info from getState() which has the token, that we need to pass in (send)
    try {
        dispatch({ type: PRODUCT_DELETE_REQUEST });

        const { userLogin: { userInfo }} = getState();  // two levels destructuring getState() -> getState().userLogin.userInfo ... we want userInfo for the token

         // here we want to pass token
        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`,
            }
        };

        await axios.delete(`/api/products/${id}`, config);
        
        dispatch({
            type: PRODUCT_DELETE_SUCCESS
        });
    } catch (error) {
        dispatch({
            type: PRODUCT_DELETE_FAIL,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message
        });
    };
};


export const createProductAction = () => async (dispatch, getState) => {
    // we can get user info from getState() which has the token, that we need to pass in (send)
    try {
        dispatch({ type: PRODUCT_CREATE_REQUEST });

        const { userLogin: { userInfo }} = getState(); // two levels destructuring getState() -> getState().userLogin.userInfo ... we want userInfo for the token

         // here we want to pass token
        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`,
            }
        };

        const { data } = await axios.post(`/api/products`, {}, config); // passing an empty object , we are making a post request, but not sending any data
        
        dispatch({
            type: PRODUCT_CREATE_SUCCESS,
            payload: data // newly created data
        });
    } catch (error) {
        dispatch({
            type: PRODUCT_CREATE_FAIL,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message
        });
    };
};

export const updateProductAction = (product) => async (dispatch, getState) => {
    // we can get user info from getState() which has the token, that we need to pass in (send)
    try {
        dispatch({ type: PRODUCT_UPDATE_REQUEST });

        const { userLogin: { userInfo }} = getState(); // two levels destructuring getState() -> getState().userLogin.userInfo ... we want userInfo for the token

         // here we want to pass token
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`,
            }
        };

        const { data } = await axios.put(`/api/products/${product._id}`, product, config); // passing an empty object , we are making a post request, but not sending any data
        
        dispatch({
            type: PRODUCT_UPDATE_SUCCESS,
            payload: data // newly created data
        });
    } catch (error) {
        dispatch({
            type: PRODUCT_UPDATE_FAIL,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message
        });
    };
};