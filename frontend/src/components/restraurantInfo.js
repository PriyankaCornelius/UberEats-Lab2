import React, { Component } from 'react';
import { Form } from 'react-bootstrap';
import { Row, Col } from 'react-bootstrap';
import axios from "axios";
import Button from 'react-bootstrap/Button';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
//const axios = require('axios');
class RestaurantInfo extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            name: "",
            location: "",
            cuisine:"",
            deliveryMode: "Delivery",
            dietary:"",
            description: "",
            phoneNo: "",
            email:"",
            address: "",
            timings: "",
            pictures:""
        }
    }

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

    nameChangeHandler=(e)=>{
        this.setState({
            name: e.target.value
        });
        console.log(e.target.value);
    };

    locationChangeHandler=(e)=>{
        this.setState({
            location: e.target.value
        });
        console.log(e.target.value);
    };

    cuisineChangeHandler = (e) => {
        e.preventDefault();
        this.setState({
            cuisine: e.target.textContent
        });
        console.log(e.target.textContent);
    };

    deliveryModeChangeHandler = (e) => {
        e.preventDefault();
        this.setState({
            deliveryMode: e.target.textContent
        });
        console.log(e.target.textContent);
    };

    dietaryChangeHandler = (e) => {
        e.preventDefault();
        this.setState({
            dietary: e.target.textContent
        });
        console.log(e.target.textContent);
    };

    descriptionChangeHandler=(e)=>{
        this.setState({
            description: e.target.value
        });
        console.log(e.target.value);
    };

    phoneNoChangeHandler=(e)=>{
        this.setState({
            phoneNo: e.target.value
        });
        console.log(e.target.value);
    };

    emailChangeHandler=(e)=>{
        this.setState({
            email: e.target.value
        });
        console.log(e.target.value);
    };
    
    addressChangeHandler=(e)=>{
        this.setState({
            address: e.target.value
        });
        console.log(e.target.value);
    };

    timingsChangeHandler=(e)=>{
        this.setState({
            timings: e.target.value
        });
        console.log(e.target.value);
    };


    updateProfile = e => {
        //prevent page from refresh
        e.preventDefault();
        console.log("update api call");
        const data = {
            RestaurantID: localStorage.getItem("r_id"),
            name: this.state.name,
            location: this.state.location,
            cuisine:this.state.cuisine,
            deliveryMode: this.state.deliveryMode,
            dietary:this.state.dietary,
            description: this.state.description,
            phoneNo: this.state.phoneNo,
            email: this.state.email,
            address: this.state.address,
            timings: this.state.timings
        };
        console.log("data :", data);
        axios
            .post("http://localhost:5000/restaurant/updateRestaurantProfile", data)
            .then((response) => {
                console.log("Status Code : ", response.status);
                //console.log(response.e);
                if (response.status === 200) {
                    //console.log("login r_id:", response.e.idRestaurants);
                    // localStorage.setItem("r_id", response.e.idRestaurants);
                    // localStorage.setItem("persona", this.state.persona);
                    this.setState({
                        authFlag: true,
                    });
                    console.log("done updating");
                    window.location.reload();
                }
            });
    }

    render() { 
        return (<React.Fragment>
            <div className="row">
                <div className="col">
                    
                        <Form onSubmit={this.updateProfile}>
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
                                        <Form.Label htmlFor="Cuisine" aria-readonly>Cuisine:</Form.Label>
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
                                        <Form.Label htmlFor="Dietary" aria-readonly>Dietary:</Form.Label>
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
                            <Form.Group>
                                <Button type="submit" className='btn m-3' variant="outline-success">Update</Button>
                            </Form.Group>
                        </Form>
                    
                </div>
                <div className="col">
                    <img src={require("../images/photo.jpg").default} height="200" width="200" alt=""></img>
                </div>
            </div>
        </React.Fragment>);
    }
}
 
export default RestaurantInfo;
