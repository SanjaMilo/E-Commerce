import React, { useState } from 'react';
import { Form, Button, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import FormContainer from '../FormContainer';
import { savePaymentMethodAction } from '../../actions/cartActions';
import CheckoutSteps from '../CheckoutSteps';

const PaymentScreen = ({ history }) => {
    // redirect if there is no shipping address
    const cart = useSelector((state) => state.cart);
    const { shippingAddress } = cart; // destructuring cart, and pulling shippingAddress from it.

    if (!shippingAddress) {
        history.push('/shipping');
    };

    const [paymentMethod, setPaymentMethod] = useState('PayPal');

    const dispatch = useDispatch();

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(savePaymentMethodAction(paymentMethod));  
        history.push('/placeorder');
    };


    return(
        <FormContainer>
        {/* Pass in as props, the step we are on, and the steps before. We are on the third step here and it shows the login,  shipping and payment screen */}
            <CheckoutSteps step1 step2 step3 />
            <h1 className="h1-title">Payment</h1>
            <Form onSubmit={submitHandler}>
                <Form.Group>
                    <Form.Label as="legend">Select Payment Method</Form.Label>
                    <Col>
                    <Form.Check id="PayPal" name="paymentMethod" type="radio" value="PayPal" label="PayPal or Credit Card" checked onChange={(e) => setPaymentMethod(e.target.value)}></Form.Check>
                    {/* <Form.Check id="Stripe" name="paymentMethod" type="radio" value="Stripe" label="Stripe"  onChange={(e) => setPaymentMethod(e.target.value)}></Form.Check> */}
                    </Col>
                </Form.Group>
                <Button className="submit-btn" type="submit" variant="info">Continue</Button>
            </Form>
        </FormContainer>
    )
};

export default PaymentScreen;