import React from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Container, Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { logoutAction } from '../actions/userActions';

const Header = () => {

	const dispatch = useDispatch();

	const userLogin = useSelector((state) => state.userLogin);
	const { userInfo } = userLogin; // destructuring userLogin (see in the userReducer)

	const logoutHandler = () => {
		dispatch(logoutAction());
	};

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
						{userInfo ? (
							<NavDropdown style={{textTransform: "uppercase"}} title={userInfo.name} id="username">
								<LinkContainer to="/profile">
									<NavDropdown.Item>Profile</NavDropdown.Item>
								</LinkContainer>
								<NavDropdown.Item onClick={logoutHandler}>Sign Out</NavDropdown.Item>
							</NavDropdown>
						) : (
							<LinkContainer to="/login">
								<Nav.Link><i className="fas fa-user"></i> SIGN IN</Nav.Link>
							</LinkContainer>
						)}
						{userInfo && userInfo.isAdmin && (
							<NavDropdown style={{textTransform: "uppercase"}} title="Admin" id="adminmenu">
								<LinkContainer to="/admin/userlist">
									<NavDropdown.Item>Users</NavDropdown.Item>
								</LinkContainer>
								<LinkContainer to="/admin/productlist">
									<NavDropdown.Item>Products</NavDropdown.Item>
								</LinkContainer>
								<LinkContainer to="/admin/orderlist">
									<NavDropdown.Item>Orders</NavDropdown.Item>
								</LinkContainer>
							</NavDropdown>
						)}	
					</Nav>
				</Navbar.Collapse>
                </Container>
			</Navbar>
		</header>
	);
};

export default Header;
