import React, { Component } from 'react';
import RestaurantInfo from './restraurantInfo';
import Dishes from './restaurantDishes';
import { Navbar } from 'react-bootstrap';
import { Container } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import Logout from './logout';
//import PopUCart from './trycartpopup';
import { Row, Col } from 'react-bootstrap';
class RestaurantProfile extends React.Component {
    render() { 
        return <div>
                    <Navbar bg="light" expand="lg">
                        <Container>
                    <Navbar.Brand>
                        <Row>
                            <Col>
                            <Link to="/RestaurantOrders" className="btn btn-outline-success">View Orders</Link>
                            </Col>
                            <Col>
                                <Logout></Logout>
                            </Col>
                            </Row>
                            </Navbar.Brand>
                        </Container>
                    </Navbar>
            
                <Col sm={11}>
                <RestaurantInfo></RestaurantInfo>
                </Col>
            
                <Dishes></Dishes>
        </div>;
    }
}
 
export default RestaurantProfile;