import React, { Component } from 'react';
import { Row, Col, Container } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import { InputGroup } from 'react-bootstrap';
import Dropdown from '@restart/ui/esm/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { Navbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Logout from './logout';
import { Form } from 'react-bootstrap';
import axios from "axios";

class PlaceOrder extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            deliveryMode: "",
            deliveryAddress: "",
            instruction:""
        }
    }

    deliveryModeChangeHandler = e => {
        e.preventDefault();
        this.setState({
            deliveryMode: e.target.textContent
        }, () => {
            console.log("print", this.state.deliveryMode);
            
        });
    }

    deliveryAddressChangeHandler = e => {
        e.preventDefault();
        this.setState({
            deliveryAddress: e.target.value
        }, () => {
            console.log("print", this.state.deliveryAddress);
            
        });
    }

    // #EFEADD
    submitOrder = (finalOrder) => {
        console.log("final order",finalOrder[0],"delmode",this.state.deliveryMode);
        var headers = new Headers();
        //prevent page from refresh
        const data = {
            CustomerID: localStorage.getItem("c_id"),
            RestaurantID: localStorage.getItem("r_id"),
            customerEmail:localStorage.getItem("customerEmail"),
            deliveryMode: this.state.deliveryMode,
            deliveryAddress: this.state.deliveryAddress,
            orderTotal:this.props.location.state.orderTotal,
            finalorder: finalOrder,
            instruction:this.state.instruction
        };
        
        axios.defaults.withCredentials = true;
        axios.post("http://localhost:5000/customer/submitOrder", data)
        .then((response) => {
            console.log("Status Code : ", response.status);
            if (response.status === 200) {
                window.alert("Order Placed");
                console.log("order placed is", response.data.customerOrders);
                var latestOrderId = response.data.customerOrders.at(-1)._id;
                
                console.log("***********order placed ID", latestOrderId);
                data['_id'] = latestOrderId;
                axios.post("http://localhost:5000/restaurant/submitOrder", data)
                    .then((response) => {
                        console.log("Status Code : ", response.status);
                        if (response.status === 200) {
                            console.log("order added in restaurant's list")
                        }
                        else {
                            window.alert("Order Failed to be added at the restaurant's end");
                        }
                    })
    
            } else {
                window.alert("Order Failed to be placed");
            }
        })
        .catch((e) => {
            debugger;
            console.log("FAIL!!!");
        });
    };
    setInstructionHandler = e => {
        e.preventDefault();
        this.setState({
            instruction:e.target.value
        })
        console.log(e.target.value);
    }

    
    
    render() {
        return <div>
            <div className="mb-6">
             
                {console.log("log it", this.props.location.state)}
                {/* <Navbar bg="light" expand="lg"> */}
                <Container bg="light" expand="lg">
                {/* <Navbar.Brand href="#home"> */}
                     
                        <Row>
                        <Col>
                        <InputGroup>
                        <DropdownButton id="dropdown-basic-button" placeholder="Delivery Mode" title={this.state.deliveryMode || "Select Delivery Mode"} value={this.state.deliveryMode} variant="outline-success">
                        <Dropdown.Item as="button" variant="outline-dark"><div onClick={(e) => this.deliveryModeChangeHandler(e)}>Delivery</div></Dropdown.Item>
                        <Dropdown.Item as="button" variant="outline-dark"><div onClick={(e) => this.deliveryModeChangeHandler(e)}>Pickup</div></Dropdown.Item>
                        </DropdownButton>
                        </InputGroup>
                        </Col>

                        <Col>
                        <Link to="/CustomerOrders" className="btn btn-outline-success">Your Orders</Link>
                        </Col>

                        <Col>
                            <Logout></Logout>
                        </Col>
                        </Row>
                {/* </Navbar.Brand> */}
                </Container>
                {/* </Navbar> */}

                <Row style={{ margin: 50}}>
                
                <Col>
                <InputGroup>
                    <input type="text" className="border border-success" style={{ fontSize: 14, padding: 6, width: 400 }} placeholder="Add special instructions for the store" onChange={this.setInstructionHandler}></input>
                    <InputGroup.Text className="border border-success" style={{ backgroundColor: "green", color:"white"}}>Add</InputGroup.Text>
                </InputGroup>
                <Col>
                 <br></br>   
                </Col>
                <InputGroup>
                    <input type="text" className="border border-success" style={{ fontSize: 14, padding: 6, width: 400 }} placeholder="Add Delivery Address" onChange={this.deliveryAddressChangeHandler}></input>
                    <InputGroup.Text className="border border-success" style={{ backgroundColor: "green", color:"white"}}>Add</InputGroup.Text>
                </InputGroup>
                </Col>
                
                
                <Col>
                    <Container style={{ backgroundColor: "#ECEBE9", borderStyle:"outset" }}>
                    <div>
                        {this.props.location.state.cart !== "" ? <div className="mb-4">
                            <Row>
                                <Col><h4>Item</h4></Col>
                                <Col><h4>Quantity</h4></Col>
                                <Col><h4>Price</h4></Col>
                            </Row>
                            </div>
                        : <p></p>}
                    </div>

                    <hr></hr>

            {this.props.location.state.cart !== "" ? this.props.location.state.cart.map((item, index) => {
                        return (
                            <div>
                                <Container>
                                <div className="mb-4">
                                <Row>
                                    <Col>
                                        {item.dishName}
                                    </Col>
                                    <Col>
                                        {item.qty}
                                    </Col>
                                    <Col>
                                        ${item.price}
                                    </Col>
                                </Row>
                                </div>
                            </Container>
                          </div>
                    )
            }) : <p>Your cart is empty</p>}
                        <hr></hr>

                        <div className="mb-4">
                        <Row>
                            <Col>Total Amount</Col>
                            <Col>${ this.props.location.state.orderTotal}</Col>
                        </Row>
                        </div>
                        
                        <div>
                        <Row>
                            <Button className="mb-2" type="submit" style={{ backgroundColor: "green", color:"white"}} onClick={()=>this.submitOrder(this.props.location.state.cart)}>Place Order</Button>
                        </Row>
                        </div>

                    </Container>
                    
                </Col>
                
                </Row>
                </div>
        </div>;
    }
}
 
export default PlaceOrder;
