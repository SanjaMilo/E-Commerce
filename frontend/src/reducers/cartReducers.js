import { CART_ADD_ITEM, CART_REMOVE_ITEM, CART_SAVE_PAYMENT_METHOD, CART_SAVE_SHIPPING_ADDRESS } from '../actionTypes/cartActionTypes';

export const cartReducer = (state = { cartItems: [], shippingAddress: {} }, action) => {
    switch (action.type) {

        case CART_ADD_ITEM:
            // putting the payload in variable item 
            const item = action.payload; 
            // check if it exists in the cart (if we click on a item that is already in the cart). Item's id is called product, so with find() method we will search for the id like so: item.product
            const existItem = state.cartItems.find(el => el.product === item.product);
            if (existItem) {
                return {
                    ...state,
                    cartItems: state.cartItems.map(el => el.product === existItem.product ? item : el)
                }
            } else {
                return {
                    ...state,
                    cartItems: [...state.cartItems, item]
                }
            }

        case CART_REMOVE_ITEM:
            return {
                ...state,
                cartItems:  state.cartItems.filter((el) => el.product !== action.payload)  // we want to filter-out the items that we are removing from the cart (action.payload)
            }
        
        case CART_SAVE_SHIPPING_ADDRESS:
            return {
                ...state,
                shippingAddress: action.payload
            }

        case CART_SAVE_PAYMENT_METHOD:
            return{
                ...state,
                paymentMethod: action.payload
            }

        default: 
        return state
    };;
};