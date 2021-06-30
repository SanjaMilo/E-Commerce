import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Row, Col } from 'react-bootstrap';
import Product from '../../components/Product';
import { listProductsAction } from '../../actions/productActions';
import Message from '../Message';
import Loader from '../Loader';
import Paginate from '../Paginate';
import ProductCarousel from '../ProductCarousel';
import Meta from '../Meta';

const HomeScreen = ({ match }) => {
   
    const keyword = match.params.keyword;
    const pageNumber = match.params.pageNumber || 1; // if it's not there, not specific pageNumber, it will always be 1

    const dispatch = useDispatch();
     // use productList of the state:
    const productList = useSelector( (state) => state.productList ); // to pull out part of the updated state to use it
    const { loading, error, products, page, pages } = productList; // destructuring productList 

    useEffect( () => {

        dispatch(listProductsAction(keyword, pageNumber)); // to update the state

    }, [dispatch, keyword, pageNumber]); 

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