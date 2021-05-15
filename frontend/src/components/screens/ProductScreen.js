import React from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Image, ListGroup, Card, Button } from 'react-bootstrap';
import Rating from '../Rating';
import products from '../../products';

const ProductScreen = ({ match }) => {
    const product = products.find(p => p._id === match.params.id);

    return(
        <>
            <Link to="/" className="btn btn-secondary my-3">&#8592; Go Back</Link>
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
                        <ListGroup.Item>
                           <Button style={{width: "100%"}} type="button" disabled={ product.countInStock === 0 }>Add To Cart</Button>
                        </ListGroup.Item>
                    </ListGroup>
                </Col>
            </Row>
        </>
    )
};

export default ProductScreen;
