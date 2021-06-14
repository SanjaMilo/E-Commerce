import React, { useEffect } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../Message';
import Loader from '../Loader';
import { listProductsAction, deleteProductAction, createProductAction } from '../../actions/productActions';
import { PRODUCT_CREATE_RESET } from '../../actionTypes/productActionTypes';

const ProductListScreen = ({ history, match }) => {

    const dispatch = useDispatch();

    const productList = useSelector((state) => state.productList);
    const { loading, products, error } = productList;

    const productDelete = useSelector((state) => state.productDelete);
    const { loading: loadingDelete, success: successDelete, error: errorDelete } = productDelete; // renaming

    const productCreate = useSelector((state) => state.productCreate);
    const { loading: loadingCreate, success: successCreate, error: errorCreate, product: createdProduct } = productCreate;

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    useEffect( () => {
        dispatch({
            type: PRODUCT_CREATE_RESET
        });

        if (!userInfo.isAdmin) {
            history.push('/login'); // but, if the user (that is admin)  was already logged in, it redirects to "/"
        };

        if (successCreate) {
            // if it is created, we want to redirect to Product Edit screen
            history.push(`/admin/product/${createdProduct._id}/edit`);
        } else {
            dispatch(listProductsAction())
        }

    }, [dispatch, history, userInfo, successDelete, successCreate, createdProduct]);

    const createProductHandler = () => {
        dispatch(createProductAction());
    };

    const deleteHandler = (id) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
             dispatch(deleteProductAction(id)); // DELETE PRODUCT
        }
    };
 
    
    return(
        <>
            <Row className="align-items-center">
                <Col>
                    <h1 className="h1-title">Products</h1>
                </Col>
                <Col style={{textAlign: "right"}}>
                    <Button variant="info" onClick={createProductHandler} className="my-4"><i className="fas fa-plus"></i> Create Product</Button>
                </Col>
            </Row>
            {errorDelete && <Message variant="warning">{errorDelete}</Message>}
            {(loadingCreate || loadingDelete) && <Loader />}
            {errorCreate && <Message variant="warning">{errorCreate}</Message>}
            {loading ? <Loader /> : error ? <Message variant="warning">{error}</Message> : (
                <Table striped bordered hover responsive className="table-sm">
                    <thead>
                        <tr>
                            <th>No.</th>
                            <th>ID</th>
                            <th>NAME</th>
                            <th>PRICE</th>
                            <th>CATEGORY</th>
                            <th>BRAND</th>
                            <th>edit</th>
                            <th>delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.length > 0 && products.map((product, index) => (
                            <tr key={product._id}>
                                <td>{index + 1}</td>
                                <td>{product._id}</td>
                                <td>{product.name}</td>
                                <td>${product.price}</td>
                                <td>{product.category}</td>
                                <td>{product.brand}</td>
                                <td style={{verticalAlign: "middle", textAlign: "center"}}>
                                    <LinkContainer to={`/admin/product/${product._id}/edit`} >
                                        <Button variant="outline-info" className="btn-sm">
                                            <i className="fas fa-edit"></i>
                                        </Button>
                                    </LinkContainer>  
                                </td>
                                <td style={{verticalAlign: "middle", textAlign: "center"}}>
                                    <Button variant="primary" className="btn-sm" onClick={() => {deleteHandler(product._id)}}>
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

export default ProductListScreen;