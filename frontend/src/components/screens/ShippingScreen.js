import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import FormContainer from '../FormContainer';
import { saveShippingAddressAction } from '../../actions/cartActions';
import CheckoutSteps from '../CheckoutSteps';

const ShippingScreen = ({ history }) => {
    // Initially, fill out the fields, with data from the local storage (initial state from store), if any data in local storage.
    const cart = useSelector((state) => state.cart);
    const { shippingAddress } = cart; // destructuring cart, and pulling shippingAddress from it.

    const [address, setAddress] = useState(shippingAddress.address);
    const [city, setCity] = useState(shippingAddress.city);
    const [postalCode, setPostalCode] = useState(shippingAddress.postalCode);
    const [country, setCountry] = useState(shippingAddress.country);

    const dispatch = useDispatch();

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(saveShippingAddressAction({ address, city, postalCode, country })); 
        // continue to the next page, payment:
        history.push('/payment');
    }

    return(
        <FormContainer>
        {/* Pass in as props, the step we are on, and the step before. We are on the second step here and it shows the login and shipping screen */}
            <CheckoutSteps step1 step2 />
            <h1 className="h1-title">Shipping</h1>
            <Form onSubmit={submitHandler}>
                <Form.Group className="mb-2" controlId="address">
                    <Form.Label>Address:</Form.Label>
                    <Form.Control type="text" placeholder="Enter address" required value={address} onChange={(e) => {setAddress(e.target.value)}} />
                </Form.Group>
                <Form.Group className="mb-2" controlId="city">
                    <Form.Label>City:</Form.Label>
                    <Form.Control type="text" placeholder="Enter city" required value={city} onChange={(e) => {setCity(e.target.value)}} />
                </Form.Group>
                <Form.Group className="mb-2" controlId="postalCode">
                    <Form.Label>Postal Code:</Form.Label>
                    <Form.Control type="text" placeholder="Enter postal code" required value={postalCode} onChange={(e) => {setPostalCode(e.target.value)}} />
                </Form.Group>
                <Form.Group className="mb-2" controlId="country">
                    <Form.Label>Country:</Form.Label>
                    <Form.Control type="text" placeholder="Enter country" required value={country} onChange={(e) => {setCountry(e.target.value)}} />
                </Form.Group>
                <Button className="submit-btn" type="submit" variant="info">Continue</Button>
            </Form>
        </FormContainer>
    )
};

export default ShippingScreen;

