import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../Message';
import Loader from '../Loader';
import FormContainer from '../FormContainer';
import { detailsProductAction, updateProductAction } from '../../actions/productActions';
import { PRODUCT_UPDATE_RESET } from '../../actionTypes/productActionTypes';
import axios from 'axios';


const ProductEditScreen = ({ match, history }) => {
    const productId = match.params.id; // product id from the URL
    // State for the form input fields: name, email, password and confirm password
    const [name, setName] = useState("");
    const [price, setPrice] = useState(0);
    const [image, setImage] = useState("");
    const [brand, setBrand] = useState("");
    const [category, setCategory] = useState("");
    const [description, setDescription] = useState("");
    const [countInStock, setCountInStock] = useState(0);
    const [uploading, setUploading] = useState(false);

    const dispatch = useDispatch();

    const productDetails = useSelector((state) => state.productDetails);
    const { loading, error, product } = productDetails; // destructuring productDetails

    const productUpdate = useSelector((state) => state.productUpdate);
    const { loading: loadingUpdate, error: errorUpdate, success: successUpdate } = productUpdate; // destructuring productUpdate and renaming loading, error and success

    useEffect( () => {
        if(successUpdate) {
            dispatch({ type: PRODUCT_UPDATE_RESET });
            history.push('/admin/productlist');

        } else {
             // productId is coming from the URL route (match.params.id)
            if (!product.name || product._id !== productId) {
                // if no product or product id not match product id from the URL, then we want to fetch the product
                dispatch(detailsProductAction(productId));
            } else {
                // if the product is already here, we want to show it in the fields
                setName(product.name);
                setPrice(product.price);
                setImage(product.image);
                setBrand(product.brand);
                setCategory(product.category);
                setDescription(product.description);
                setCountInStock(product.countInStock);
            };
        };
       
    }, [dispatch, history, productId, product, successUpdate]);

    // sending http request, so this is async func
    const uploadFileHandler = async (e) => {
        const file = e.target.files[0];
        // initialize formData object
        const formData = new FormData();
        // append 'image' as we call it in the backend, and add the file
        formData.append('image', file);
        setUploading(true); // set the loader (spinner)

        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            };

            const { data } = await axios.post('/api/upload', formData, config);

            setImage(data) // data is the path
            setUploading(false);

        } catch (error) {
            console.error(error);
            setUploading(false);
        }

    };
    

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(updateProductAction({
            _id: productId, // productId is coming from the URL
            name,
            price,
            image,
            brand,
            category,
            description,
            countInStock // all these are from the form fields
        }));
    };

    return(
        <>
            <Link to="/admin/productlist" className="btn btn-secondary my-3">&#8592; Go Back</Link>
            <FormContainer>
            <h3 className="cart-subtitle">Edit Product</h3>
            {loadingUpdate && <Loader />}
            {errorUpdate && <Message variant="warning">{errorUpdate}</Message>}
            {loading ? <Loader /> : error ? <Message variant="warning">{error}</Message> : (
                <Form onSubmit={submitHandler}>

                    <Form.Group className="mb-2" controlId="name">
                        <Form.Label>Name:</Form.Label>
                        <Form.Control type="text" placeholder="Enter Name" value={name} onChange={(e) => {setName(e.target.value)}} />
                    </Form.Group>

                    <Form.Group className="mb-2" controlId="price">
                        <Form.Label>Price:</Form.Label>
                        <Form.Control type="number" placeholder="Enter price" value={price} onChange={(e) => {setPrice(e.target.value)}} />
                    </Form.Group>

                    <Form.Group className="mb-2" controlId="productImage">
                        <Form.Label>Image:</Form.Label>
                        <Form.Control type="text" placeholder="Enter image url" value={image} onChange={(e) => setImage(e.target.value)} />
                        <Form.File id="image-file" label="Choose File" custom onChange={uploadFileHandler} />
                        {uploading && <Loader />}
                    </Form.Group>

                    <Form.Group className="mb-2" controlId="brand">
                        <Form.Label>Brand:</Form.Label>
                        <Form.Control type="text" placeholder="Enter Brand" value={brand} onChange={(e) => {setBrand(e.target.value)}} /> 
                    </Form.Group>

                    <Form.Group className="mb-2" controlId="category">
                        <Form.Label>Category:</Form.Label>
                        <Form.Control type="text" placeholder="Enter Category" value={category} onChange={(e) => {setCategory(e.target.value)}} />
                    </Form.Group>

                    <Form.Group className="mb-2" controlId="description">
                        <Form.Label>Description:</Form.Label>
                        <Form.Control type="text" placeholder="Enter Description" value={description} onChange={(e) => {setDescription(e.target.value)}} />
                    </Form.Group>

                    <Form.Group className="mb-2" controlId="countInStock">
                        <Form.Label>Count in stock:</Form.Label>
                        <Form.Control type="number" placeholder="Enter Count In Stock" value={countInStock} onChange={(e) => {setCountInStock(e.target.value)}} />
                    </Form.Group>

                    <Button className="submit-btn" type="submit" variant="info">UPDATE</Button>
            </Form>
            )} 
        </FormContainer>
        </>
    )
};

export default ProductEditScreen;