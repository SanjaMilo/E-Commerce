import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
    return(
        <footer>
            <Container>
                <Row>
                    <Col className="text-center py-3">
                    <span style={{color: "#08ffff"}}>MERN e-commerce, developed by Sanja M. &copy; MASTER SHOP 2021</span> 
                    </Col>
                </Row>
            </Container>
        </footer>
    )
}

export default Footer;