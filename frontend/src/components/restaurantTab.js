import React, { Component } from 'react';
import { Form } from 'react-bootstrap';
import { Row, Col } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import CustomerDishes from './customerDishes';
import axios from "axios";
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
//const axios = require('axios');
class RestaurantTab extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            name: "",
            location: "",
            description: "",
            phoneNo: "",
            email:"",
            address: "",
            timings: "",
            pictures: "",
            cuisine: "",
            deliveryMode: "",
            dietary: "",
            
        }
    }
//todo: get restaurant's email on "visit" click and replace in params
    componentDidMount() {
        const data = {
            params: {
                RestaurantID: localStorage.getItem("r_id")
            }
        };
        
        console.log("data",data);
        axios.get("http://localhost:5000/restaurant/getRestaurantProfile", data)
        .then(response => {
            console.log("status is",response.status);
            if (response.status === 200) {
                console.log(response.data);
                this.setState({
                    name: response.data.name,
                    email: response.data.email,
                    location: response.data.location,
                    cuisine:response.data.cuisine,
                    deliveryMode: response.data.deliveryMode || "Delivery",
                    dietary:response.data.dietary,
                    description: response.data.description,
                    phoneNo: response.data.phoneNo,
                    address: response.data.address,
                    timings: response.data.timings
                });
            }
        });
}   
    



    render() { 
        return (<React.Fragment>
            <div className="row">
                <div className="col">
                    
                <Form>
                            <Form.Group>
                                <Row>
                                    <Col>
                                        <Form.Label htmlFor="name">Restaurant Name:</Form.Label>
                                    </Col>
                                    <Col>
                                        <Form.Control type="text" id="name" className="text-center" placeholder="Name" value={this.state.name} onChange={this.nameChangeHandler}></Form.Control>
                                    </Col>
                                </Row>
                            </Form.Group>
                            <Form.Group>
                                <Row>
                                    <Col>
                                <Form.Label htmlFor="location">Location:</Form.Label>
                                    </Col>
                                    <Col>
                                <Form.Control type="text" id="location" className="text-center" placeholder="Location" value={this.state.location} onChange={this.locationChangeHandler}></Form.Control>
                                    </Col>
                                </Row>
                        </Form.Group>
                        <Form.Group>
                                <Row>
                                    <Col>
                                        <Form.Label htmlFor="deliveryMode" aria-readonly>Cuisine:</Form.Label>
                                    </Col>
                                    <Col>
                                    <DropdownButton id="dropdown-basic-button" placeholder="Cuisine" title={ this.state.cuisine || 'Select cuisine'} value={this.state.cuisine} variant="outline-grey">
                                    <Dropdown.Item as="button" variant="outline-dark"><div onClick={(e) => this.cuisineChangeHandler(e)}>Indian</div></Dropdown.Item>
                                    <Dropdown.Item as="button" variant="outline-dark"><div onClick={(e) => this.cuisineChangeHandler(e)}>Thai</div></Dropdown.Item>
                                    <Dropdown.Item as="button" variant="outline-dark"><div onClick={(e) => this.cuisineChangeHandler(e)}>Chinese</div></Dropdown.Item>
                                    <Dropdown.Item as="button" variant="outline-dark"><div onClick={(e) => this.cuisineChangeHandler(e)}>English</div></Dropdown.Item>
                                    <Dropdown.Item as="button" variant="outline-dark"><div onClick={(e) => this.cuisineChangeHandler(e)}>Greek</div></Dropdown.Item>
                                    <Dropdown.Item as="button" variant="outline-dark"><div onClick={(e) => this.cuisineChangeHandler(e)}>Mexican</div></Dropdown.Item>
                                    <Dropdown.Item as="button" variant="outline-dark"><div onClick={(e) => this.cuisineChangeHandler(e)}>American</div></Dropdown.Item>
                                    <Dropdown.Item as="button" variant="outline-dark"><div onClick={(e) => this.cuisineChangeHandler(e)}>Turkish</div></Dropdown.Item>
                                    <Dropdown.Item as="button" variant="outline-dark"><div onClick={(e) => this.cuisineChangeHandler(e)}>Korean</div></Dropdown.Item>
                                    </DropdownButton>
                                    </Col>
                                </Row>
                            </Form.Group> 
                        <Form.Group>
                                <Row>
                                    <Col>
                                        <Form.Label htmlFor="deliveryMode" aria-readonly>Delivery Mode:</Form.Label>
                                    </Col>
                                    <Col>
                                    <DropdownButton id="dropdown-basic-button" placeholder="Delivery Mode" title={ this.state.deliveryMode} value={this.state.deliveryMode} variant="outline-grey">
                                    <Dropdown.Item as="button" variant="outline-dark"><div onClick={(e) => this.deliveryModeChangeHandler(e)}>Delivery and Pickup</div></Dropdown.Item>
                                    <Dropdown.Item as="button" variant="outline-dark"><div onClick={(e) => this.deliveryModeChangeHandler(e)}>Delivery</div></Dropdown.Item>
                                    <Dropdown.Item as="button" variant="outline-dark"><div onClick={(e) => this.deliveryModeChangeHandler(e)}>Pickup</div></Dropdown.Item>
                                    </DropdownButton>
                                    </Col>
                                </Row>
                        </Form.Group>
                        <Form.Group>
                                <Row>
                                    <Col>
                                        <Form.Label htmlFor="deliveryMode" aria-readonly>Dietary:</Form.Label>
                                    </Col>
                                    <Col>
                                    <DropdownButton id="dropdown-basic-button" placeholder="Dietary" title={ this.state.dietary || "Select dietary option"} value={this.state.dietary} variant="outline-grey">
                                    <Dropdown.Item as="button" variant="outline-dark"><div onClick={(e) => this.dietaryChangeHandler(e)}>Vegan</div></Dropdown.Item>
                                    <Dropdown.Item as="button" variant="outline-dark"><div onClick={(e) => this.dietaryChangeHandler(e)}>Vegetarian</div></Dropdown.Item>
                                    <Dropdown.Item as="button" variant="outline-dark"><div onClick={(e) => this.dietaryChangeHandler(e)}>Non Vegetarian</div></Dropdown.Item>
                                    </DropdownButton>
                                    </Col>
                                </Row>
                            </Form.Group>  
                            <Form.Group>
                                <Row>
                                    <Col>
                                        <Form.Label htmlFor="description">Description:</Form.Label>
                                    </Col>
                                    <Col>
                                        <Form.Control type="text" id="description" className="text-center" placeholder="Description" value={this.state.description} onChange={this.descriptionChangeHandler}></Form.Control>
                                    </Col>
                                </Row>
                            </Form.Group>
                            <Form.Group>
                                <Row>
                                    <Col>
                                        <Form.Label htmlFor="phoneNo">Contact Number:</Form.Label>
                                    </Col>
                                    <Col>
                                        <Form.Control type="text" id="phoneNo" className="text-center" placeholder="Contact Number" value={this.state.phoneNo} onChange={this.phoneNoChangeHandler}></Form.Control>
                                    </Col>
                                </Row>
                            </Form.Group>    
                            <Form.Group>
                                <Row>
                                    <Col>
                                        <Form.Label htmlFor="email">Email Address:</Form.Label>
                                    </Col>
                                    <Col>
                                        <Form.Control type="text" id="email" className="text-center" placeholder="Email Address" value={this.state.email} onChange={this.emailChangeHandler}></Form.Control>
                                    </Col>
                                </Row>
                            </Form.Group>
                            <Form.Group>
                                <Row>
                                    <Col>
                                        <Form.Label htmlFor="address">Address:</Form.Label>
                                    </Col>
                                    <Col>
                                        <Form.Control type="text" id="address" className="text-center" placeholder="Address" value={this.state.address} onChange={this.addressChangeHandler}></Form.Control>
                                    </Col>
                                </Row>
                            </Form.Group>
                            <Form.Group>
                                <Row>
                                    <Col>
                                        <Form.Label htmlFor="timings">Timings:</Form.Label>
                                    </Col>
                                    <Col>
                                        <Form.Control type="text" id="timings" className="text-center" placeholder="Timings" value={this.state.timings} onChange={this.timingsChangeHandler}></Form.Control>
                                    </Col>
                                </Row>
                            </Form.Group>
                            
                        </Form>
                    
                </div>
                <div className="col">
                    <img src={require("../images/photo.jpg").default} height="200" width="200" alt=""></img>
                </div>
            </div>
            {/* <CustomerDishes></CustomerDishes> */}
        </React.Fragment>);
    }
}
 
export default RestaurantTab;
