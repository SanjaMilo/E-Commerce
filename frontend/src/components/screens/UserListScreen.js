import React, { useEffect } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../Message';
import Loader from '../Loader';
import { listUsersAction, deleteUserAction } from '../../actions/userActions';

const UserListScreen = ({ history }) => {

    const dispatch = useDispatch();

    const userList = useSelector((state) => state.userList);
    const { loading, users, error } = userList;

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    const userDelete = useSelector((state) => state.userDelete);
    const { success: successDelete } = userDelete;

    useEffect( () => {
        if (userInfo && userInfo.isAdmin) {
            dispatch(listUsersAction());
        } else {
            history.push('/login'); // if the user was already logged in, it redirects to "/"
        } 
        // success delete (true) we pass in as a dependency
    }, [dispatch, history, userInfo, successDelete]);

    const deleteHandler = (id) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            dispatch(deleteUserAction(id));
        }
    };
 
    
    return(
        <>
            <h1 className="h1-title">Users</h1>
            {loading ? <Loader /> : error ? <Message variant="warning">{error}</Message> : (
                <Table striped bordered hover responsive className="table-sm">
                    <thead>
                        <tr>
                            <th></th>
                            <th>ID</th>
                            <th>NAME</th>
                            <th>EMAIL</th>
                            <th>ADMIN</th>
                            <th>edit/delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length > 0 && users.map((user, index) => (
                            <tr key={user._id}>
                                <td>{index + 1}</td>
                                <td>{user._id}</td>
                                <td>{user.name}</td>
                                <td><a href={`mailto: ${user.email}`}>{user.email}</a></td>
                                <td>
                                    {user.isAdmin ? (<i className="fas fa-check" style={{color: "#41d7a7"}}></i>) : ( <i className="fas fa-times" style={{color: "#e51b75"}}></i>)}
                                </td>
                                <td style={{verticalAlign: "middle", textAlign: "center"}}>
                                    <LinkContainer to={`/admin/user/${user._id}/edit`} >
                                        <Button variant="outline-info" className="btn-sm">
                                            <i className="fas fa-edit"></i>
                                        </Button>
                                    </LinkContainer>
                                    <Button variant="primary" className="btn-sm" style={{marginLeft: "15px"}} onClick={() => {deleteHandler(user._id)}}>
                                        <i className="fas fa-trash"></i>
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </>
    )
};

export default UserListScreen;