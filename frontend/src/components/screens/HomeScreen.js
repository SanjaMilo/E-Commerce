import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Row, Col } from 'react-bootstrap';
//import products from '../../products';
// import axios from 'axios';
import Product from '../../components/Product';
import { listProductsAction } from '../../actions/productActions';
import Message from '../Message';
import Loader from '../Loader';
import Paginate from '../Paginate';
import ProductCarousel from '../ProductCarousel';
import Meta from '../Meta';

const HomeScreen = ({ match }) => {
    // wih redux, this we do not need:
    // const [products, setProducts] = useState([]);

    const keyword = match.params.keyword;
    const pageNumber = match.params.pageNumber || 1; // if it's not there, not specific pageNumber, it will always be 1

    const dispatch = useDispatch();
     // we want to use productList of the state:
    const productList = useSelector( (state) => state.productList ); // to pull out part of the updated state to use it
    const { loading, error, products, page, pages } = productList; // destructuring productList on what we want to pull out from productList part of the state

    useEffect( () => {
        // const fetchProducts = async () => {
        //     // const res = await axios.get('/api/products')
        //     const { data } = await axios.get('/api/products') // destructuring res (res.data)
        //     setProducts(data);
        // };
        // // invoke 
        // fetchProducts();

        // we won't use the above when we have redux, but this: 

        dispatch(listProductsAction(keyword, pageNumber)); // to update the state

    }, [dispatch, keyword, pageNumber]); // pass in dispatch as a dependency, not to get warning in the console

    return(
        <React.Fragment>
            {/* For Meta use default props, no need to pass any */}
            <Meta />
            {!keyword ? <ProductCarousel /> : <Link to="/" className="btn btn-secondary my-3">&#8592; Go Back</Link>}
            <h1 className="h1-title">Latest Products</h1>
            { loading ? 
            (<Loader />) 
            : error ? 
            (<Message variant="danger">{error}</Message>) 
            : ( <>
                    <Row>
                    {products.map(product => 
                        <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                            <Product product={product} />
                        </Col>
                    )}
                    </Row>
                    <Paginate pages={pages} page={page} keyword={keyword ? keyword : ''} />
                </> ) }   
        </React.Fragment>
    )
};

export default HomeScreen;