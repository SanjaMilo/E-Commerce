import React, { useState } from 'react';
import { Form, Button, Col } from 'react-bootstrap';

const SearchBox = ({ history }) => {
    // since the search form is embedded into the Header and it's not going to have direct access to the props (and props.history), we are going to use render prop

    const [keyword, setKeyword] = useState('');

    const submitSearchHandler = (e) => {
        e.preventDefault();
        if(keyword.trim()) {
            history.push(`/search/${keyword}`)
        } else {
            history.push('/')
        }
    };

    return(
        <Form onSubmit={submitSearchHandler} style={{"display": "flex"}}>
            <Form.Control className="mr-sm-2 ml-sm-5" type="text" name="q" placeholder="Search Products..." onChange={(e) => setKeyword(e.target.value)}></Form.Control>
            <Button style={{"marginLeft": ".5rem"}} type="submit" variant="outline-success">Search</Button>
        </Form>
    )
};

export default SearchBox;