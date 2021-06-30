import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../Message';
import Loader from '../Loader';
import { registerAction } from '../../actions/userActions';
import FormContainer from '../FormContainer';

const RegisterScreen = ({ location, history }) => {
    // State for the form input fields: name, email, password and confirm password
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState(null);

    const dispatch = useDispatch();

    const userRegister = useSelector((state) => state.userRegister);
    const { loading, error, userInfo } = userRegister; // destructuring userRegister 

    const redirect = location.search ? location.search.split("=")[1] : '/';

    // Redirect if already registered
    useEffect( () => {
        // if the user is not registered, userInfo is going to be null, not exist, so we will check, if it exists:
        if (userInfo) {
            history.push(redirect);
        };
    }, [history, userInfo, redirect]);

    const submitHandler = (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setMessage("Passwords do not match!")
        } else {
            dispatch(registerAction(name, email, password));
        };  
    };

    return(
        <FormContainer>
            <h1 className="sign-in-title">SIGN UP</h1>
            {message && (<Message variant="danger">{message}</Message>) }
            {error && (<Message variant="danger">{error}</Message>) }
            {loading && <Loader />}
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
                <Button className="submit-btn" type="submit" variant="info">SIGN UP</Button>
            </Form>
            <Row className="py-3 text-center">
                <Col className="enlarged-text">
                    Have an Account?  <Link className="colored-text-link" to={redirect ? `/login?redirect=${redirect}` : '/login' } >Sign In</Link>
                </Col>
            </Row>
        </FormContainer>
    )
};

export default RegisterScreen;

