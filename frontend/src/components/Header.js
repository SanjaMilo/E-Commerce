import React from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Container, Navbar, Nav } from 'react-bootstrap';

const Header = () => {
	return (
		<header>
			<Navbar bg="secondary" variant="secondary" expand="lg" collapseOnSelect>
            <Container>
				<LinkContainer to="/">
					<Navbar.Brand>MASTER SHOP</Navbar.Brand>
				</LinkContainer>
				<Navbar.Toggle aria-controls="basic-navbar-nav" />
				<Navbar.Collapse id="basic-navbar-nav" style={{flexGrow: "0"}}>
					<Nav className="mr-auto">
						<LinkContainer to="/cart">
							<Nav.Link><i className="fas fa-shopping-cart"></i> CART</Nav.Link>
						</LinkContainer>
						<LinkContainer to="/login">
							<Nav.Link><i className="fas fa-user"></i> SIGN IN</Nav.Link>
						</LinkContainer>
					</Nav>
				</Navbar.Collapse>
                </Container>
			</Navbar>
		</header>
	);
};

export default Header;
