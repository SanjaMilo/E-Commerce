import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Image, ListGroup, Button, Form } from 'react-bootstrap';
import Rating from '../Rating';
// import axios from 'axios';
// import products from '../../products';
import { detailsProductAction, createProductReviewAction } from '../../actions/productActions';
import Loader from '../Loader';
import Message from '../Message';
import { PRODUCT_CREATE_REVIEW_RESET } from '../../actionTypes/productActionTypes';
import Meta from '../Meta';


const ProductScreen = ({ history, match }) => {
    // const product = products.find(p => p._id === match.params.id); // with axios.get we don't need this 

    // const [product, setProduct] = useState({}); // with redux we don't need this

     // component level state: (qty = quantity)
    const [qty, setQty] = useState(1); // initial state for quantity is 1 (0 makes no sense, empty cart)
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');

    const dispatch = useDispatch();

    const productDetails = useSelector((state) => state.productDetails );
    const { loading, error, product } = productDetails;

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    const productCreateReview = useSelector((state) => state.productCreateReview);
    const { success: successProductReview, error: errorProductReview } = productCreateReview;

    useEffect( () => {
        // const fetchProduct = async () => {
        //     // const res = await axios.get('/api/products'); // destructuring res -> (res.data)
        //     const { data } = await axios.get(`/api/products/${match.params.id}`) 
        //     setProduct(data);
        // };
        // // invoke 
        // fetchProduct();

        if(successProductReview) {
            alert('Review Submitted!');
            // set back to the default values
            setRating(0);
            setComment('');
            dispatch({ type: PRODUCT_CREATE_REVIEW_RESET })
        }

        // with redux:
        dispatch(detailsProductAction(match.params.id))

    }, [dispatch, match, successProductReview]); // add [dispatch, match] -> to remove warning for missing dependency

    const addToCartHandler = () => {
        history.push(`/cart/${match.params.id}?qty=${qty}`)
    };

    const submitReviewHandler = (e) => {
        e.preventDefault();
        dispatch(createProductReviewAction(match.params.id, { rating, comment }));
    };

    return(
        <>
            <Link to="/" className="btn btn-secondary my-3">&#8592; Go Back</Link>
            { loading ? (<Loader />) : error ? (<Message variant="danger">{error}</Message>) : 
            ( <>
                {/* For the Meta we want product to load first, and use the product name */}
                <Meta title={product.name} />
                <Row>
                <Col md={6}>
                    <Image src={product.image} alt={product.name} fluid />
                </Col>
                <Col md={3}>
                    <ListGroup variant="flush">
                        <ListGroup.Item>
                            <h3 style={{textAlign: "start"}}>{product.name}</h3>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Rating value={product.rating} text={`${product.numReviews} reviews`} />
                        </ListGroup.Item>
                        <ListGroup.Item style={{textAlign: "center", color: "#1ce783", textShadow: "0.5px 0.5px #39255a"}}>
                            <strong>Price:</strong> ${product.price}
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <strong>Description: </strong>
                            {product.description}
                        </ListGroup.Item>
                    </ListGroup>
                </Col>
                <Col md={3}>
                    <ListGroup variant="flush">
                        <ListGroup.Item>
                           <Row>
                               <Col>Price:</Col>
                               <Col>
                                <strong style={{textShadow: "0.5px 0.5px #39255a"}}>${product.price}</strong>
                               </Col>
                           </Row>
                        </ListGroup.Item>
                        <ListGroup.Item>
                           <Row>
                               <Col>Status:</Col>
                               <Col>
                                {product.countInStock > 0 ? "In Stock" : "Out Of Stock"}
                               </Col>
                           </Row>
                        </ListGroup.Item>
                        {product.countInStock > 0 && (
                            <ListGroup.Item>
                                <Row>
                                    <Col>Qty:</Col>
                                    <Col>
                                        <Form.Control className="select" as="select" value={qty} onChange={(e) => setQty(e.target.value)}>
                                            {/* if the number of countInStock is 5, we want an array of [0,1,2,3,4] */}
                                            {
                                            [...Array(product.countInStock).keys()].map(el => (<option key={el + 1} value={el + 1}>{el + 1}</option>))
                                            }
                                        </Form.Control>
                                    </Col>
                                </Row>
                            </ListGroup.Item>
                        )}
                        <ListGroup.Item>
                           <Button variant="info" onClick={addToCartHandler} style={{width: "100%"}} type="button" disabled={ product.countInStock === 0 }>Add To Cart</Button>
                        </ListGroup.Item>
                    </ListGroup>
                </Col>
            </Row>
            <Row>
                <Col md={6}>
                    <h3 className="h3-title">REVIEWS</h3>
                    {product.reviews.length === 0 && <Message>No Reviews</Message>}
                    <ListGroup variant="flush">
                        {product.reviews.map(review => (
                            <ListGroup.Item key={review._id}>
                                <strong>{review.name}</strong>
                                <Rating value={review.rating} />
                                <p>{review.createdAt.substring(0, 10)}</p>
                                <p>{review.comment}</p>
                            </ListGroup.Item>
                        ))}
                        <ListGroup.Item>
                            <h3>WRITE A CUSTOMER REVIEW</h3>
                            {errorProductReview && <Message variant="warning">{errorProductReview}</Message>}
                            {userInfo ? (
                                <Form onSubmit={submitReviewHandler}>
                                    <Form.Group controlId="rating">
                                        <Form.Label>Rating</Form.Label>
                                        <Form.Control className="select" as="select" value={rating} onChange={(e) => setRating(e.target.value)}>
                                            <option value="">Select...</option>
                                            <option value="1">1 - Poor</option>
                                            <option value="2">2 - Fair</option>
                                            <option value="3">3 - Good</option>
                                            <option value="4">4 - Very Good</option>
                                            <option value="5">5 - Excellent</option>
                                        </Form.Control>
                                    </Form.Group>
                                    <Form.Group controlId="comment">
                                        <Form.Label>Comment</Form.Label>
                                        <Form.Control as="textarea" row="3" value={comment} onChange={(e) => setComment(e.target.value)}></Form.Control>
                                    </Form.Group>
                                    <Button className="submit-btn" type="submit" variant="primary">Submit</Button>
                                </Form>
                            ) : (
                                <Message>Please <Link style={{"textDecoration": "underline"}} to="/login">sign in</Link> to write a review</Message>
                            )}
                        </ListGroup.Item>
                    </ListGroup>
                </Col>
            </Row>
            </>) }   
        </>
    )
};

export default ProductScreen;
