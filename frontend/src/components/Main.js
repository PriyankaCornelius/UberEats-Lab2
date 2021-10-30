import React, {Component} from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Login from './login';
import Signup from './signup';
import RestaurantProfile from './restaurantProfile';
import RestaurantTab from './restaurantTab';
import CustomerProfile from './customerProfile';
import Dashboard from './Dashboard';
import CustomerDishes from './customerDishes';
// import { Navbar } from 'react-bootstrap';
import NavBar from './NavBar';
import PlaceOrder from './placeOrder';
import CustomerOrders from './CustomerOrders';
import RestaurantOrders from './RestaurantOrders';
//Create a Main Component
class Main extends Component {
        state = {
                cart:[1,2,3]
        }
    render(){
        return(
            <div>
                {/*Render Different Component based on Route*/}
                <Router>
                <Route path="/">
                        <NavBar></NavBar>
                    </Route>
                    <Route path="/login">
                        <Login></Login>
                    </Route>
                    <Route path="/signup">
                        <Signup></Signup>
                    </Route>
                    <Route path="/restaurantProfile">
                        <RestaurantProfile>
                        </RestaurantProfile>
                    </Route>
                   
                    <Route path="/restaurantTab">
                            <RestaurantTab></RestaurantTab>
                    </Route>
                    
                    <Route path="/customerProfile">
                            <CustomerProfile></CustomerProfile>
                    </Route>
                    <Route path="/Dashboard">
                            <Dashboard></Dashboard>
                    </Route>
                    <Route path="/CustomerOrders">
                            <CustomerOrders></CustomerOrders>
                    </Route>
                    <Route path="/RestaurantOrders">
                            <RestaurantOrders></RestaurantOrders>
                    </Route>
                    {/* <Route path="/customerDishes">
                            <CustomerDishes></CustomerDishes>
                    </Route> */}
                    
                    <Route path="/placeOrder" render={(cart) => <PlaceOrder {...cart}/>}>
                    </Route>
                    <Route path="/customerDishes" render={(cart) => <CustomerDishes {...cart}/>}>
                    </Route>
                </Router>

            </div>
        )
    }
}
//Export The Main Component
export default Main;
