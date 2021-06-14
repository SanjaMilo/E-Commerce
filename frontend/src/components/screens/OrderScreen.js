import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PayPalButton } from 'react-paypal-button-v2';
import { Link } from 'react-router-dom';
import { Row, Col, Button, ListGroup, Image } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../Message';
import Loader from '../Loader';
import { getOrderDetailsAction, payOrderAction, deliverOrderAction } from '../../actions/orderActions';
import { ORDER_PAY_RESET, ORDER_DELIVER_RESET } from '../../actionTypes/orderActionTypes';
 

const OrderScreen = ({ match, history }) => {

    const orderId = match.params.id;

    const [sdkReady, setSdkReady] = useState(false);
    
    const dispatch = useDispatch();

    const orderDetails = useSelector((state) => state.orderDetails);
    const { order, loading, error } = orderDetails; // destructuring orderDetails (see getOrderDetailsReducer)

    const orderPay = useSelector((state) => state.orderPay);
    const { loading: loadingPay, success: successPay } = orderPay;

    const orderDeliver = useSelector((state) => state.orderDeliver);
    const { loading: loadingDeliver, success: successDeliver } = orderDeliver;

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    const addDecimals = (num) => {
        return (Math.round(num * 100) / 100).toFixed(2);
    };

    // check if no loading, then:
    if (!loading) {
        // Calculate price:
        order.itemsPrice = addDecimals(order.orderItems.reduce((acc, item) => acc + item.qty * item.price, 0));
    };

    useEffect( () => {
        if(!userInfo) {
            history.push('/login');
        };

        // build PayPal script here, when component loads:
        const addPayPalScript = async () => {
            // fetch the Client ID from backend:
            const { data: clientId } = await axios.get('/api/config/paypal');
            const script = document.createElement('script');
            script.type ='text/javascript';
            script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`;
            script.async =  true;
            script.onload = () => {
                setSdkReady(true); // tells if the script is loaded
            };
            document.body.appendChild(script)
        };

        if (!order || successPay || successDeliver) {
            dispatch({ type: ORDER_PAY_RESET }); // to reset the state not to get in loop, after pay to keep refreshing 
            dispatch({ type: ORDER_DELIVER_RESET })
            // We want to see the order even if we have no success pay. If the order is not there, dispatch 
            dispatch(getOrderDetailsAction(orderId)); 
        } else if (!order.isPaid) {
            if (!window.paypal) {
                addPayPalScript(); // invoke 
            } else {
                setSdkReady(true);
            }
        };
       
    }, [dispatch, orderId, order, successPay, successDeliver]);

    const successPaymentHandler = (paymentResult) => {
        // takes from PayPal the paymentResult 
        console.log(paymentResult);
        dispatch(payOrderAction(orderId, paymentResult))
    };

    const deliverHandler = () => {
        dispatch(deliverOrderAction(order));
    };


    return(
        loading ? (<Loader />) : error ? (<Message variant="warning">{error}</Message>) : (
            <>
                <h3 className="cart-subtitle">Order: <span className="colored-text" style={{textTransform: "lowercase"}}>{order._id}</span> </h3>
                <Row>
                <Col md={8}>
                    <ListGroup valiant="flush">

                        <ListGroup.Item>
                            <h3 className="cart-subtitle">Shipping</h3>
                            <p>
                                <strong>Name: </strong> {order.user.name}
                            </p>
                            <p>
                                <strong>Email: </strong>
                                <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
                            </p>
                            <p>
                                <strong>Address:</strong>&nbsp;
                                {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                            </p>
                            { order.isDelivered ? <Message variant="success">Delivered on {order.deliveredAt}</Message> : <Message variant="warning">Not Delivered!</Message>}
                        </ListGroup.Item>

                        <ListGroup.Item>
                        <h3 className="cart-subtitle">Payment Method</h3>
                        <p>
                            <strong>Method:</strong>&nbsp;
                            {order.paymentMethod}
                        </p>
                        { order.isPaid ? <Message variant="success">Payed on {order.paidAt}</Message> : <Message variant="warning">Not Paid!</Message>}
                        </ListGroup.Item>

                        <ListGroup.Item>
                        <h3 className="cart-subtitle">Order Items</h3>
                        {order.orderItems.length === 0 ? (<Message>Order is empty!</Message>) 
                        : (
                            <ListGroup variant="flush">
                                {order.orderItems.map((item, index) => (
                                    <ListGroup.Item key={index}>
                                        <Row>
                                            <Col md={2}>
                                                <Image src={item.image} alt={item.name} rounded fluid />
                                            </Col>
                                            <Col>
                                                <Link to={`/product/${item.product}`}>
                                                    {item.name}
                                                </Link>
                                            </Col>
                                            <Col md={4}>
                                                {item.qty} x ${item.price} = ${(item.qty * item.price).toFixed(2)}
                                            </Col>
                                        </Row>
                                </ListGroup.Item>))}
                            </ListGroup>
                        )}
                        </ListGroup.Item>

                    </ListGroup>
                </Col>
                <Col md={4}>
                    <ListGroup variant="flush">
                        <ListGroup.Item>
                            <h3 className="cart-subtitle">Order Summary</h3>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Row>
                                <Col>Items</Col>
                                <Col>${order.itemsPrice}</Col>
                            </Row>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Row>
                                <Col>Shipping</Col>
                                <Col>${order.shippingPrice}</Col>
                            </Row>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Row>
                                <Col>Tax</Col>
                                <Col>${order.taxPrice}</Col>
                            </Row>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Row>
                                <Col>Total</Col>
                                <Col>${order.totalPrice}</Col>
                            </Row>
                        </ListGroup.Item>
                        {!order.isPaid && (
                            <ListGroup.Item>
                                {loadingPay && <Loader />}
                                {!sdkReady ? <Loader /> : (
                                    <PayPalButton amount={order.totalPrice} onSuccess={successPaymentHandler} ></PayPalButton>
                                )}
                            </ListGroup.Item>
                        )}
                        {loadingDeliver && <Loader />}
                        {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                            <ListGroup.Item>
                                <Button type="button" style={{'width': '100%'}} variant="warning" class="btn" onClick={deliverHandler}>Mark As Delivered</Button>
                            </ListGroup.Item>
                        )}
                    </ListGroup>
                </Col>
            </Row>
            </>
        )
    )
};

export default OrderScreen;