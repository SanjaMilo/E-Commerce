import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../Message';
import Loader from '../Loader';
import { loginAction } from '../../actions/userActions';
import FormContainer from '../FormContainer';

const LoginScreen = ({ location, history }) => {
    // State for the form input fields: email and password
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const dispatch = useDispatch();

    const userLogin = useSelector((state) => state.userLogin);
    const { loading, error, userInfo } = userLogin; // destructuring userLogin

    const redirect = location.search ? location.search.split("=")[1] : '/';
    // redirect if already logged in
    useEffect( () => {
        // if the user is not logged in, userInfo is going to be null, not exist, so we will check, if it exists:
        if (userInfo) {
            history.push(redirect);
        };
    }, [history, userInfo, redirect]);

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(loginAction(email, password))
    };

    return(
        <FormContainer>
            <h1 className="sign-in-title">SIGN IN</h1>
            {error && (<Message variant="danger">{error}</Message>) }
            {loading && <Loader />}
            <Form onSubmit={submitHandler}>
                <Form.Group className="mb-2" controlId="email">
                    <Form.Label>Email Address:</Form.Label>
                    <Form.Control type="email" placeholder="Enter email" value={email} onChange={(e) => {setEmail(e.target.value)}} />
                </Form.Group>
                <Form.Group className="mb-2" controlId="password">
                    <Form.Label>Password:</Form.Label>
                    <Form.Control type="password" placeholder="Enter password" value={password} onChange={(e) => {setPassword(e.target.value)}} />
                </Form.Group>
                <Button className="submit-btn" type="submit" variant="info">SIGN IN</Button>
            </Form>
            <Row className="py-3 text-center">
                <Col className="enlarged-text">
                    New Customer?  <Link className="colored-text-link" to={redirect ? `/register?redirect=${redirect}` : '/register' } >Register</Link>
                </Col>
            </Row>
        </FormContainer>
    )
};

export default LoginScreen;