import React, { useEffect } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../Message';
import Loader from '../Loader';
import { listOrdersAction } from '../../actions/orderActions';

const OrderListScreen = ({ history }) => {

    const dispatch = useDispatch();

    const orderList = useSelector((state) => state.orderList);
    const { loading, orders, error } = orderList;

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    useEffect( () => {
        if (userInfo && userInfo.isAdmin) {
            dispatch(listOrdersAction());
        } else {
            history.push('/login'); // if the user was already logged in, it redirects to "/"
        } 
    }, [dispatch, history, userInfo]);

    
    return(
        <>
            <h1 className="h1-title">Orders</h1>
            {loading ? <Loader /> : error ? <Message variant="warning">{error}</Message> : (
                <Table striped bordered hover responsive className="table-sm">
                    <thead>
                        <tr>
                            <th></th>
                            <th>ID</th>
                            <th>USER</th>
                            <th>DATE</th>
                            <th>TOTAL</th>
                            <th>PAID</th>
                            <th>DELIVERED</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.length > 0 && orders.map((order, index) => (
                            <tr key={order._id}>
                                <td>{index + 1}</td>
                                <td>{order._id}</td>
                                <td>{order.user && order.user.name}</td>
                                <td>{order.createdAt.substring(0, 10)}</td>
                                <td>${order.totalPrice}</td>
                                <td>
                                    {order.isPaid ? (order.paidAt.substring(0, 10)) : ( <i className="fas fa-times" style={{color: "#e51b75"}}></i>)}
                                </td>
                                <td>
                                    {order.isDelivered ? (order.deliveredAt.substring(0, 10)) : ( <i className="fas fa-times" style={{color: "#e51b75"}}></i>)}
                                </td>
                                <td style={{verticalAlign: "middle", textAlign: "center"}}>
                                    <LinkContainer to={`/order/${order._id}`} >
                                        <Button variant="outline-info" className="btn-sm">
                                           Details
                                        </Button>
                                    </LinkContainer>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </>
    )
};

export default OrderListScreen;