import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../Message';
import Loader from '../Loader';
import FormContainer from '../FormContainer';
import { getUserDetailsAction, updateUserAction } from '../../actions/userActions';
import { USER_UPDATE_RESET } from '../../actionTypes/userActionTypes';

const UserEditScreen = ({ match, history }) => {
    const userId = match.params.id; // user id from the URL
    // State for the form input fields: name, email, password and confirm password
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [isAdmin, setIsAdmin] = useState(false); // false by default

    const dispatch = useDispatch();

    const userDetails = useSelector((state) => state.userDetails);
    const { loading, error, user } = userDetails; // destructuring userDetails 

    const userUpdate = useSelector((state) => state.userUpdate);
    const { loading: loadingUpdate, error: errorUpdate, success: successUpdate } = userUpdate; // destructuring userUpdate and renaming loading, error and success

    useEffect( () => {
        if (successUpdate) {
            dispatch({ type: USER_UPDATE_RESET });
            // after resetting input fields (to empty), redirect to:
            history.push('/admin/userlist');
        } else {
            // userId is coming from the URL route
            if (!user.name || user._id !== userId) {
                // fetch the user
                dispatch(getUserDetailsAction(userId));
            } else {
                // if the user is already here, show it in the fields
                setName(user.name);
                setEmail(user.email);
                setIsAdmin(user.isAdmin)
            };
        };
       
    }, [dispatch, history, successUpdate, userId, user]);

    const submitHandler = (e) => {
        e.preventDefault();
        // updateUserAction(user)  -> takes in the user object as an argument, so:
        dispatch(updateUserAction({ _id: userId, name, email, isAdmin }))
    };

    return(
        <>
            <Link to="/admin/userlist" className="btn btn-secondary my-3">&#8592; Go Back</Link>
            <FormContainer>
            <h3 className="cart-subtitle">Edit user</h3>
            {loadingUpdate && <Loader />}
            {errorUpdate && <Message variant="warning">{errorUpdate}</Message>}
            {loading ? <Loader /> : error ? <Message variant="warning">{error}</Message> : (
                <Form onSubmit={submitHandler}>
                <Form.Group className="mb-2" controlId="name">
                    <Form.Label>Name:</Form.Label>
                    <Form.Control type="text" placeholder="Enter Name" value={name} onChange={(e) => {setName(e.target.value)}} />
                </Form.Group>
                <Form.Group className="mb-2" controlId="email">
                    <Form.Label>Email Address:</Form.Label>
                    <Form.Control type="email" placeholder="Enter email" value={email} onChange={(e) => {setEmail(e.target.value)}} />
                </Form.Group>
                <Form.Group className="mb-2" controlId="isadmin">
                    <Form.Check type="checkbox" label="Is Admin" checked={isAdmin} onChange={(e) => {setIsAdmin(e.target.checked)}} />
                </Form.Group>
                <Button className="submit-btn" type="submit" variant="info">UPDATE</Button>
            </Form>
            )} 
        </FormContainer>
        </>
    )
};

export default UserEditScreen;