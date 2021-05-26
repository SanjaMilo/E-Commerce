import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Image, Form, Button, ListGroup } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../Message';
import { addToCartAction, removeFromCartAction } from '../../actions/cartActions';

 
const CartScreen = ({ match, location, history }) => {
    const productId = match.params.id;

    const qty = location.search ? Number(location.search.split('=')[1]) : 1; // split by the sigh =  and get the second array element with index [1] -> ?qty=1 ["?gty", "1"]
    console.log(qty); // const qty = location.search; it outputs: ?qty=1 -> and we want the number after the " = " sign

    const dispatch = useDispatch();

    const cart = useSelector((state) => state.cart);
    const { cartItems } = cart // destructuring cart -> cart.cartItems

    useEffect( () => {
        // we want to dispatch at the cart only if there is a productId, and if we go to the regular cart page, we don't want to dispatch, so we check:
        if (productId) {
            dispatch(addToCartAction(productId, qty));
        };

    }, [dispatch, productId, qty]);

    const removeFromCartHandler = (id) => {
        dispatch(removeFromCartAction(id));
    };

    const checkoutHandler = () => {
        // if the user is not logged in, will go to login page, and if the user is logged in, will go to the shipping page
        history.push(`/login?redirect=shipping`); 
    };

    return(
        <Row>
            <Col md={8}>
                <h1 className="h1-title">Shopping Cart</h1>
                {cartItems.length === 0 ? 
                (<Message>Your Cart Is Empty <Link className="go-back" to='/'>Go Back</Link></Message>)
                : 
                (<ListGroup variant="flush">
                    {cartItems.map(item => (
                        <ListGroup.Item key={item.product}>
                            <Row>
                                <Col md={2}>
                                    <Image src={item.image} alt={item.name} rounded fluid />
                                </Col>
                                <Col md={3}>
                                    <Link to={`/product/${item.product}`}>{item.name}</Link>
                                </Col>
                                <Col md={2}> ${item.price}</Col>
                                <Col md={2}>
                                    <Form.Control className="select" as="select" value={item.qty} onChange={(e) => dispatch(addToCartAction(item.product, Number(e.target.value)))}>
                                                {/* if the number of countInStock is 5, we want an array of [0,1,2,3,4] */}
                                                {
                                                [...Array(item.countInStock).keys()].map(el => (<option key={el + 1} value={el + 1}>{el + 1}</option>))
                                                }
                                    </Form.Control>
                                </Col>
                                <Col md={2}>
                                    <Button onClick={() => removeFromCartHandler(item.product)} type="button" variant="primary"><i className="fas fa-trash"></i></Button>
                                </Col>
                            </Row>
                        </ListGroup.Item>
                    ))}
                </ListGroup>) }
            </Col>
            <Col md={4}>
                 <ListGroup variant="flush">
                    <ListGroup.Item>
                        <h3 className="cart-subtitle">
                            Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)}) items
                        </h3>
                        ${cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2)}
                    </ListGroup.Item>
                    <ListGroup.Item>
                    <Button variant="info" onClick={checkoutHandler} style={{width: "100%"}} type="button" disabled={ cartItems.length === 0 }>Proceed To Checkout</Button>
                </ListGroup.Item>
                </ListGroup>
            </Col>
        </Row>
    )
};

export default CartScreen;