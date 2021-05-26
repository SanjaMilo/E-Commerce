import { Container } from 'react-bootstrap';
import './App.css';
import { BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomeScreen from './components/screens/HomeScreen';
import ProductScreen from './components/screens/ProductScreen';
import CartScreen from './components/screens/CartScreen';
import LoginScreen from './components/screens/LoginScreen';
import RegisterScreen from './components/screens/RegisterScreen';
import ProfileScreen from './components/screens/ProfileScreen';
import ShippingScreen from './components/screens/ShippingScreen';
import PaymentScreen from './components/screens/PaymentScreen';
import PlaceOrderScreen from './components/screens/PlaceOrderScreen';
import OrderScreen from './components/screens/OrderScreen';
import UserListScreen from './components/screens/UserListScreen';

function App() {
  return (
    <Router>
      <Header />
      <main className="py-3">
        <Container>
          <Switch>
            <Route path="/order/:id" component={OrderScreen} />
            <Route path="/placeorder" component={PlaceOrderScreen} />
            <Route path="/payment" component={PaymentScreen} />
            <Route path="/shipping" component={ShippingScreen} />
            <Route path="/login" component={LoginScreen} />
            <Route path="/register" component={RegisterScreen} />
            <Route path="/profile" component={ProfileScreen} />
            <Route path="/product/:id" component={ProductScreen} />
            <Route path="/cart/:id?" component={CartScreen} />
            <Route path="/admin/userlist" component={UserListScreen} />
            <Route exact path="/" component={HomeScreen} />
          </Switch>
        </Container>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
