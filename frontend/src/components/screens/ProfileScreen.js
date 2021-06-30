import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Table } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../Message';
import Loader from '../Loader';
import { getUserDetailsAction, updateUserProfileAction } from '../../actions/userActions';
import { listMyOrdersAction } from '../../actions/orderActions';

const ProfileScreen = ({ location, history }) => {
    // State for the form input fields: name, email, password and confirm password
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState(null);

    const dispatch = useDispatch();

    const userDetails = useSelector((state) => state.userDetails);
    const { loading, error, user } = userDetails; // destructuring userDetails

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin; // destructuring userLogin 

    const userUpdateProfile = useSelector((state) => state.userUpdateProfile);
    const { success } = userUpdateProfile; // destructuring userUpdateProfile 

    const orderListMy = useSelector((state) => state.orderListMy);
    const { loading: loadingOrders, error: errorOrders, orders } = orderListMy; 

    // Redirect if already registered
    useEffect( () => {
        //check if no userInfo 
        if (!userInfo) {
            history.push('/login');
        } else {
            if (!user.name) {
                dispatch(getUserDetailsAction('profile'));
                dispatch(listMyOrdersAction())
            } else {
                setName(user.name);
                setEmail(user.email);
                // don't fill the password fields
            }
        }
    }, [dispatch, history, userInfo, user]); 

    const submitHandler = (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setMessage("Passwords do not match!")
        } else {
            // Dispatch updated profile
            dispatch(updateUserProfileAction({ id: user._id, name, email, password }))
        };  
    };

    return(
        <Row>
            <Col md={3}>
            <h3 className="h3-title">USER PROFILE</h3>
            { message && (<Message variant="danger">{message}</Message>) }
            { error && (<Message variant="danger">{error}</Message>) }
            { success && (<Message variant="success">Profile Updated</Message>) }
            { loading && <Loader /> }
            <Form onSubmit={submitHandler}>
                <Form.Group className="mb-2" controlId="name">
                    <Form.Label>Name:</Form.Label>
                    <Form.Control type="text" placeholder="Enter Name" value={name} onChange={(e) => {setName(e.target.value)}} />
        </Form.Group>
                <Form.Group className="mb-2" controlId="email">
                    <Form.Label>Email Address:</Form.Label>
                    <Form.Control type="email" placeholder="Enter email" value={email} onChange={(e) => {setEmail(e.target.value)}} />
        </Form.Group>
                <Form.Group className="mb-2" controlId="password">
                    <Form.Label>Password:</Form.Label>
                    <Form.Control type="password" placeholder="Enter password" value={password} onChange={(e) => {setPassword(e.target.value)}} />
        </Form.Group>
                <Form.Group className="mb-2" controlId="confirmPassword">
                    <Form.Label>Confirm Password:</Form.Label>
                    <Form.Control type="password" placeholder="Confirm password" value={confirmPassword} onChange={(e) => {setConfirmPassword(e.target.value)}} />
        </Form.Group>
                <Button className="submit-btn" type="submit" variant="success">UPDATE</Button>
            </Form>
            </Col>
            <Col md={9}>
                <h3 className="h3-title">MY ORDERS</h3>
                {loadingOrders ? <loader /> : errorOrders ? <Message variant="warning">{errorOrders}</Message> : (
                    <Table striped bordered hover responsive className="table-sm">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>DATE</th>
                                <th>TOTAL</th>
                                <th>PAID</th>
                                <th>DELIVERED</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => (
                                <tr key={order._id}>
                                    <td>{order._id}</td>
                                    <td>{order.createdAt.substring(0, 10)}</td>
                                    <td>{order.totalPrice}</td>
                                    <td>{order.isPaid ? order.paidAt.substring(0, 10) : (<i className="fas fa-times" style={{color: '#e51b75'}}></i>)}</td>
                                    <td>{order.isDelivered ? order.deliveredAt.substring(0, 10) : (<i className="fas fa-times" style={{color: '#e51b75'}}></i>)}</td>
                                    <td>
                                        <LinkContainer to={`/order/${order._id}`}>
                                            <Button className="btn-sm" variant="secondary">Details</Button>
                                        </LinkContainer>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}
            </Col>
        </Row>
    )
};

export default ProfileScreen;