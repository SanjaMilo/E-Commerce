import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Button, ListGroup, Image, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../Message';
import CheckoutSteps from '../CheckoutSteps';
import { orderCreateAction } from '../../actions/orderActions';

const PlaceOrderScreen = ({ history }) => {
    
    const dispatch = useDispatch();

    const cart = useSelector((state) => state.cart);

    const addDecimals = (num) => {
        return (Math.round(num * 100) / 100).toFixed(2);
    };

    // Calculate prices:
    cart.itemsPrice = addDecimals(cart.cartItems.reduce((acc, item) => acc + item.qty * item.price, 0));
    cart.shippingPrice = addDecimals(cart.itemsPrice > 100 ? 0 : 100);
    cart.taxPrice = addDecimals(Number((0.18 * cart.itemsPrice).toFixed(2)));
    cart.totalPrice = (Number(cart.itemsPrice) + Number(cart.shippingPrice) + Number(cart.taxPrice)).toFixed(2);

    const orderCreate = useSelector((state) => state.orderCreate);
    const { order, success, error } = orderCreate; // destructuring orderCreate 

    useEffect( () => {
        if (success) {
           history.push(`/order/${order._id}`) 
        };
        // eslint-disable-next-line
    }, [history, success])

    const placeOrderHandler = () => {
        dispatch(orderCreateAction({
            orderItems: cart.cartItems,
            shippingAddress: cart.shippingAddress,
            paymentMethod: cart.paymentMethod,
            itemsPrice: cart.itemsPrice,
            shippingPrice: cart.shippingPrice,
            taxPrice: cart.taxPrice,
            totalPrice: cart.totalPrice
        }))
    };


    return(
        <>
            <CheckoutSteps step1 step2 step3 step4 />
            <Row>
                <Col md={8}>
                    <ListGroup valiant="flush">

                        <ListGroup.Item>
                            <h3 className="cart-subtitle">Shipping</h3>
                            <p>
                                <strong>Address:</strong>&nbsp;
                                {cart.shippingAddress.address}, {cart.shippingAddress.city}, {cart.shippingAddress.postalCode}, {cart.shippingAddress.country}
                            </p>
                        </ListGroup.Item>

                        <ListGroup.Item>
                        <h3 className="cart-subtitle">Payment Method</h3>
                        <p>
                            <strong>Method:</strong>&nbsp;
                            {cart.paymentMethod}
                        </p>
                        </ListGroup.Item>

                        <ListGroup.Item>
                        <h3 className="cart-subtitle">Order Items</h3>
                        {cart.cartItems.length === 0 ? (<Message>Your cart is empty!</Message>) 
                        : (
                            <ListGroup variant="flush">
                                {cart.cartItems.map((item, index) => (
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
                                <Col>${cart.itemsPrice}</Col>
                            </Row>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Row>
                                <Col>Shipping</Col>
                                <Col>${cart.shippingPrice}</Col>
                            </Row>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Row>
                                <Col>Tax</Col>
                                <Col>${cart.taxPrice}</Col>
                            </Row>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Row>
                                <Col>Total</Col>
                                <Col>${cart.totalPrice}</Col>
                            </Row>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            {error && <Message variant="warning">{error}</Message>}
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Button className="btn-block" style={{width: "100%"}} variant="success" onClick={placeOrderHandler}  type="button" disabled={cart.cartItems === 0 }>Place Order</Button>
                        </ListGroup.Item>
                    </ListGroup>
                </Col>
            </Row>
        </>
    )
};

export default PlaceOrderScreen;
