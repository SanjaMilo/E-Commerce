import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col } from 'react-bootstrap';
//import products from '../../products';
// import axios from 'axios';
import Product from '../../components/Product';
import { listProductsAction } from '../../actions/productActions';
import Message from '../Message';
import Loader from '../Loader';

const HomeScreen = () => {
    // wih redux, this we do not need:
    // const [products, setProducts] = useState([]);

    const dispatch = useDispatch();
     // we want to use productList of the state:
    const productList = useSelector( (state) => state.productList ); // to pull out part of the updated state to use it
    const { loading, error, products } = productList; // destructuring productList on what we want to pull out from productList part of the state

    useEffect( () => {
        // const fetchProducts = async () => {
        //     // const res = await axios.get('/api/products')
        //     const { data } = await axios.get('/api/products') // destructuring res (res.data)
        //     setProducts(data);
        // };
        // // invoke 
        // fetchProducts();

        // we won't use the above when we have redux, but this: 

        dispatch(listProductsAction()); // to update the state

    }, [dispatch]); // pass in dispatch as a dependency, not to get warning in the console

    return(
        <React.Fragment>
            <h1 className="h1-title">Latest Products</h1>
            { loading ? 
            (<Loader />) 
            : error ? 
            (<Message variant="danger">{error}</Message>) 
            : ( <Row>
                {products.map(product => 
                    <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                        <Product product={product} />
                    </Col>
                )}
                </Row> ) }   
        </React.Fragment>
    )
};

export default HomeScreen;