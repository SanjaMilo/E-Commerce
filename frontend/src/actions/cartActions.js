import axios from 'axios';
import { CART_ADD_ITEM, CART_REMOVE_ITEM, CART_SAVE_PAYMENT_METHOD, CART_SAVE_SHIPPING_ADDRESS } from '../actionTypes/cartActionTypes';

export const addToCartAction = (id, qty) => async (dispatch, getState) => {
    // we are going to save the cart in localStorage, so we pass the second argument getState. getState() allows us to get the entire state tree and we are going to use it to get the whole cart, like so: getState().cart.cartItems
    const { data } = await axios.get(`/api/products/${id}`);

    dispatch({
        type: CART_ADD_ITEM,
        payload: {
            product: data._id,
            name: data.name,
            image: data.image,
            price: data.price,
            countInStock: data.countInStock,
            qty // qty: qty -> qty is from the argument we passed in 
        }
    });

    // Once we dispatch this, we want to save it in localStorage
    localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems));

};


export const removeFromCartAction = (id) => (dispatch, getState) => {
    dispatch({
        type: CART_REMOVE_ITEM,
        payload: id
    });

    localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems));
};


export const saveShippingAddressAction = (data) => (dispatch, getState) => {
    dispatch({
        type: CART_SAVE_SHIPPING_ADDRESS,
        payload: data
    });

    localStorage.setItem('shippingAddress', JSON.stringify(data));
};


export const savePaymentMethodAction = (data) => (dispatch, getState) => {
    dispatch({
        type: CART_SAVE_PAYMENT_METHOD,
        payload: data
    });

    localStorage.setItem('paymentMethod', JSON.stringify(data));
};