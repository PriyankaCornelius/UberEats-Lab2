import React, { Component } from 'react';
import Card from 'react-bootstrap/Card';
import { Row, Col, NavbarBrand } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import { Redirect } from 'react-router-dom';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import { InputGroup } from 'react-bootstrap';
import { Navbar } from 'react-bootstrap';
import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';


import axios from "axios";
import Logout from './logout';

class RestaurantOrders extends React.Component {

    //call the constructor method
    constructor(props) {
        //Call the constructor of Super class i.e The Component
        super(props);
        //maintain the state required for this component
        this.state = {
            orders: "",
            filteredorders:"",
            idOrders:"",
            orderStatusEdited:"",
            deliveryMode:"",
            status:"",
            orderDetails:"",
            orderItemListModal: "",
            redirectVar: "",
            displayDropdown: "",
            orderID: "",
            orderStatus: "",
            index: "",
            allOrders: "",
            orderFilter:""
        };
        // this.onChange=this.onChange.bind(this);
        // this.cancelOrder=this.cancelOrder.bind(this);
        //this.fetchOrderDetails=this.fetchOrderDetails.bind(this);
    }

    componentDidMount() {
        var data = { params: { RestaurantID: localStorage.getItem("r_id") } };
        axios.get("http://localhost:5000/restaurant/getRestaurantOrders", data).then((response) => {
            //update the state with the response data
            console.log(response.data);
            this.setState({
                allOrders: response.data.restaurantOrders,
                orders:response.data.restaurantOrders,
                filteredorders: response.data.restaurantOrders,
                orderStatusEdited: "",
                deliveryMode: "",
                status: "",
                orderDetails: "",
                orderItemListModal: ""
            });
        });
    }

    redirectToCustomerProfile = e => {
        e.preventDefault();
        console.log("view cust profilee", this.state.orders[e.target.value].customerEmail);
        localStorage.setItem("customerEmail", this.state.orders[e.target.value].customerEmail);
        this.setState({
            redirectVar: ( 
                <Redirect to="/customerProfile"></Redirect>
            )
        })
    }

    dropdownDisplayHandler = e => {
        e.preventDefault();
        console.log("view cust delivery mode", e.target.value);
        if (e.target.value === 'Delivery') {
            this.setState({
                displayDropdown: (
                    <>
                    <Dropdown.Item as="button" variant="outline-dark"><div onClick={(e) => this.orderStatusChangeHandler(e)}>On the way</div></Dropdown.Item>
                    <Dropdown.Item as="button" variant="outline-dark"><div onClick={(e) => this.orderStatusChangeHandler(e)}>Order Delivered</div></Dropdown.Item>
                    </>
                )
            })
        }
        if (e.target.value === 'Pickup') {
            this.setState({
                displayDropdown: (
                    <>
                    <Dropdown.Item as="button" variant="outline-dark"><div onClick={(e) => this.orderStatusChangeHandler(e)}>Pick up ready</div></Dropdown.Item>
                    <Dropdown.Item as="button" variant="outline-dark"><div onClick={(e) => this.orderStatusChangeHandler(e)}>Picked up</div></Dropdown.Item>
                    <Dropdown.Item as="button" variant="outline-dark"><div onClick={(e) => this.orderStatusChangeHandler(e)}>Order Cancelled</div></Dropdown.Item>
                    </>
                )
            })
        }
    }

    indexHandler = (orderID,index,CustomerID) => {
        console.log("order status changing orderID", orderID);
        console.log("order status changing index", index);
        console.log("order status changing CustomerID", CustomerID);
        this.setState({
            orderID: orderID,
            index:index
        })
        localStorage.setItem("c_id",CustomerID);
    }

    orderStatusChangeHandler = (e) => {
        //e.preventDefault();
        console.log("order status changing", e.target.textContent);
        
        // this.setState({
        //     orderStatus: e.target.textContent
        // }) 
        var data = {
            RestaurantID: localStorage.getItem('r_id'),
            CustomerID: localStorage.getItem('c_id'),
                orderStatus: e.target.textContent,
                orderID:this.state.orderID
              };
        
          console.log("data",data);
        axios
            .post("http://localhost:5000/restaurant/updateOrderStatus", data)
            .then((response) => {
                console.log("Status Code : ", response.status);
                console.log(response.data);
                if (response.status === 200) {
                    console.log("updateOrderStatus successful");
                    axios
                        .post("http://localhost:5000/customer/updateOrderStatus", data)
                        .then((response) => {
                            console.log("Status Code : ", response.status);
                            console.log(response.data);
                            if (response.status === 200) {
                                console.log("updateOrderStatus successful");
                            }
                            else {
                                console.log("updateOrderStatus failed for customer's end");
                            }
                        })

                }
                else {
                    console.log("updateOrderStatus failed for restaurant's end");
                }
            })
        let newOrders = [...this.state.orders];
        newOrders[this.state.index].orderStatus = e.target.textContent;
        this.setState({
                orders: newOrders
            }) 
        
    }

    orderFilterHandler = e => {
        e.preventDefault();
        console.log("printing", e.target.textContent);
        this.setState({
            orderFilter: e.target.textContent
        }, () => {
            console.log("printing2", this.state.orderFilter);
            console.log("printing2", this.state.allOrders);
            if (this.state.orderFilter !== null) {
                let filteredValues = this.state.allOrders.filter(order => {
                    //return all restaurants where selected delivery mode is available
                    //return order.orderStatus === this.state.orderFilter
                    if (this.state.orderFilter === "New Orders") {
                        return (order.orderStatus === "Order Received"|| order.orderStatus === "order recieved"||order.orderStatus === "Preparing"||order.orderStatus === "Pick up ready"||order.orderStatus === "On the way")
                    }
                    else if (this.state.orderFilter === "Delivered Orders") {
                        return (order.orderStatus === "Order Delivered"|| order.orderStatus === "Picked up")
                    }
                    else if (this.state.orderFilter === "Cancelled Orders") {
                        return (order.orderStatus === "Order Cancelled")
                    }
                });
                this.setState({
                    orders: filteredValues
                });

                if (this.state.orderFilter === "All Orders") {
                    this.setState({
                        orders: this.state.allOrders
                    });     
                }
                console.log("printfinal", filteredValues);
            }
        });
        console.log("print", this.state.orderFilter);
    }

    render() {
        
        // if((order.orderStatus)==="Delivery"){
                
        // }

        return <div>
            
            {console.log("this.state.orders", this.state.orders)}
            <div>
            <Navbar bg="light" expand="lg">
                        <Container>
                            <Navbar.Brand>
                                <Row>
                                <Col>
                                    <InputGroup className="mb-3">
                                        <DropdownButton id="dropdown-basic-button" placeholder="Filter Orders" title={this.state.orderFilter || "Filter Orders"} value={this.state.orderFilter} variant="outline-success">
                                            <Dropdown.Item as="button" variant="outline-dark"><div onClick={(e) => this.orderFilterHandler(e)}>New Orders</div></Dropdown.Item>
                                            <Dropdown.Item as="button" variant="outline-dark"><div onClick={(e) => this.orderFilterHandler(e)}>Delivered Orders</div></Dropdown.Item>
                                            <Dropdown.Item as="button" variant="outline-dark"><div onClick={(e) => this.orderFilterHandler(e)}>Cancelled Orders</div></Dropdown.Item>
                                            <Dropdown.Item as="button" variant="outline-dark"><div onClick={(e) => this.orderFilterHandler(e)}>All Orders</div></Dropdown.Item>
                                        </DropdownButton>
                                    </InputGroup>
                                </Col>
                                </Row>
                            </Navbar.Brand>
                    </Container>
                    <Container>
                        <Link to="/restaurantProfile" className="btn btn-outline-success">Go to profile</Link>
                    </Container>
                    <Container>
                        <Logout></Logout>
                    </Container>
            </Navbar>
            </div>
            <h1>Past Orders</h1>
            {this.state.redirectVar}
            <div>
            <div className="container shadow" style={{textAlign: "center", width:1200}}>
                    {this.state.orders.length !== 0 ? this.state.orders.map((order, index) => {
                        return (
                            <div className="mb-3">
                            <Card>
                                <Row className="mt-3">
                                    <Col>
                                        <small style={{color:"grey"}}>Order ID : </small>
                                        {order._id}
                                        <small style={{color:"grey"}}> ~ </small>
                                        {order.deliveryAddress}
                                    </Col>
                                    
                                    <Col>
                                    <Button variant="outline-light" onClick={(e) => { this.indexHandler(order._id,index,order.CustomerID); this.dropdownDisplayHandler(e) }} value={order.deliveryMode}>
                                    <InputGroup>
                                        <DropdownButton id="dropdown-basic-button" placeholder="Cuisine" title={order.orderStatus || "Change order status"} value={order.orderStatus} variant="outline-success">
                                            <Dropdown.Item as="button" variant="outline-dark"><div onClick={(e) => this.orderStatusChangeHandler(e)}>Order Received</div></Dropdown.Item>
                                            <Dropdown.Item as="button" variant="outline-dark"><div onClick={(e) => this.orderStatusChangeHandler(e)}>Preparing</div></Dropdown.Item>
                                            {this.state.displayDropdown}
                                        </DropdownButton>
                                    </InputGroup>
                                    </Button>
                                    </Col>
                                    
                                    <Col>
                                        <Button variant="outline-success" onClick={index=>this.redirectToCustomerProfile(index)} value={index}>View Customer Profile</Button>
                                    </Col>
                                </Row>
                                
                                <Row className="mt-3">
                                    <div style={{textAlign: "left"}}>
                                    <small style={{color:"grey"}}>Order Total : </small>
                                    <small>
                                        ${order.orderTotal}
                                    </small>
                                    <small style={{color:"grey"}}> ~ </small>
                                    <small style={{color:"grey"}}>Order Date : </small>
                                    <small>
                                        {order.date}
                                    </small>
                                    <small style={{color:"grey"}}> ~ </small>
                                    <small style={{color:"grey"}}>Customer Email ID : </small>
                                    <small>
                                        {order.customerEmail}
                                    </small>
                                    <small style={{color:"grey"}}> ~ </small>
                                    <small style={{color:"grey"}}>Delivery Mode Selected : </small>
                                    <small>
                                        {order.deliveryMode}
                                    </small>
                                    
                                    </div>
                                </Row>
                            </Card>
                          </div>
                    )
                    }): <Card>No previous orders found</Card>}
            </div>
            </div>

        </div>;
    }
}
 
export default RestaurantOrders;