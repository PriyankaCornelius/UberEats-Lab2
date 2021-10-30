import React, { Component } from 'react';
import Card from 'react-bootstrap/Card';
import { Row, Col } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import { Navbar } from 'react-bootstrap';
import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import { InputGroup } from 'react-bootstrap';
import axios from "axios";
import OrderReceipt from './orderReceipt';
import Logout from './logout';
class CustomerOrders extends React.Component {

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
            orderDetails:[],
            orderItemListModal: "",
            orderFilter: "",
            allOrders: "",
            orderReceipt: "",
            
            dishNames: [],
            dishPrice: [],
            
        };
        // this.onChange=this.onChange.bind(this);
        // this.cancelOrder=this.cancelOrder.bind(this);
        //this.fetchOrderDetails=this.fetchOrderDetails.bind(this);
    }

    componentDidMount() {
        var data = { params: { CustomerID: localStorage.getItem("c_id") } };
        axios.get("http://localhost:5000/customer/getCustomerOrders", data).then((response) => {
            //update the state with the response data
            console.log("orders response", response.data);
            this.setState({
                allOrders:response.data.customerOrders,
                orders: response.data.customerOrders,
                filteredorders: response.data.customerOrders,
                orderStatusEdited: "",
                deliveryMode: "",
                status: "",
                orderDetails: "",
                orderItemListModal: "",
                
            });
        });
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
                    if (this.state.orderFilter === "Order Received") {
                        return (order.orderStatus === "Order Received"|| order.orderStatus === "order received")
                    }
                    else 
                        return (this.state.orderFilter === order.orderStatus)
                    
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


    orderDetailsHandler = (order) => {
        console.log("order", order);
                
        this.setState({
            orderReceipt: (
                <OrderReceipt
                    order={order}
                    orderDetails={order.items}
                ></OrderReceipt>
            )
        })
    }

    orderCancelHandler = (order, orderID, RestaurantID) => {
        console.log("order", order);
        var data = {
            RestaurantID: RestaurantID,
            CustomerID: localStorage.getItem('c_id'),
            orderStatus: "Order Cancelled",
            orderID:orderID
        };
        console.log("order cancelling data", data);

        axios
            .post("http://localhost:5000/customer/updateOrderStatus", data)
            .then((response) => {
                console.log("Status Code : ", response.status);
                console.log(response.data);
                if (response.status === 200) {
                    console.log("updateOrderStatus successful at customer's end");
                    axios
                        .post("http://localhost:5000/restaurant/updateOrderStatus", data)
                        .then((response) => {
                            console.log("Status Code : ", response.status);
                            console.log(response.data);
                            if (response.status === 200) {
                                console.log("updateOrderStatus successful");
                                window.location.reload();
                            }
                            else {
                                console.log("updateOrderStatus failed for restaurant's end");
                            }
                        })

                }
                else {
                    console.log("updateOrderStatus failed for restaurant's end");
                }
            })
        //window.location.reload();
    }
        
    render() {
        
        return <div>
            {this.state.orderReceipt}
            {console.log("this.state.orders",this.state.orders)}
            <div>
            <Navbar bg="light" expand="lg">
                        <Container>
                            <Navbar.Brand>
                                <Row>
                                <Col>
                                    <InputGroup className="mb-3">
                                        <DropdownButton id="dropdown-basic-button" placeholder="Filter Orders" title={this.state.orderFilter || "Filter Orders"} value={this.state.orderFilter} variant="outline-success">
                                            <Dropdown.Item as="button" variant="outline-dark"><div onClick={(e) => this.orderFilterHandler(e)}>Order Received</div></Dropdown.Item>
                                            <Dropdown.Item as="button" variant="outline-dark"><div onClick={(e) => this.orderFilterHandler(e)}>Preparing</div></Dropdown.Item>
                                            <Dropdown.Item as="button" variant="outline-dark"><div onClick={(e) => this.orderFilterHandler(e)}>On the way</div></Dropdown.Item>
                                            <Dropdown.Item as="button" variant="outline-dark"><div onClick={(e) => this.orderFilterHandler(e)}>Pick up ready</div></Dropdown.Item>
                                            <Dropdown.Item as="button" variant="outline-dark"><div onClick={(e) => this.orderFilterHandler(e)}>Order Delivered</div></Dropdown.Item>
                                            <Dropdown.Item as="button" variant="outline-dark"><div onClick={(e) => this.orderFilterHandler(e)}>Picked up</div></Dropdown.Item>
                                            <Dropdown.Item as="button" variant="outline-dark"><div onClick={(e) => this.orderFilterHandler(e)}>Order Cancelled</div></Dropdown.Item>
                                            <Dropdown.Item as="button" variant="outline-dark"><div onClick={(e) => this.orderFilterHandler(e)}>All Orders</div></Dropdown.Item>
                                        </DropdownButton>
                                    </InputGroup>
                                </Col>
                                <Col>
                                <Link to="/Dashboard" className="btn btn-outline-success">Dashboard</Link>
                                </Col>
                                <Col>
                                <Link to="/customerProfile" className="btn btn-outline-success">Go to profile</Link>
                                </Col>
                                <Col>
                                <Logout></Logout>
                                </Col>
                                </Row>
                            </Navbar.Brand>
                    </Container>
                    {/* <Container>
                        <Link to="/customerProfile" className="btn btn-outline-success">Go to profile</Link>
                    </Container> */}
            </Navbar>
            </div>
            <h1>Past Orders</h1>
            <div>
            <div className="container shadow" style={{textAlign: "center", width:1200}}>
                    {this.state.orders.length !== 0 ? this.state.orders.map((order, index) => {
                        if (order.orderStatus === "Order Received") {
                            var showCancelButton=(<Button variant="outline-success" onClick={()=>this.orderCancelHandler(order, order._id, order.RestaurantID)}>Cancel Order</Button>)
                        }
                        return (
                            <div className="mb-3">
                            <Card>
                                <Row>
                                    <Col>
                                        {order.restaurantName}
                                    </Col>
                                    <Col>
                                    <small style={{color:"grey"}}>Status : </small>
                                        {order.orderStatus}
                                    </Col>
                                    <Col>
                                            <Button variant="outline-success" onClick={()=>this.orderDetailsHandler(order)}>View Receipt</Button>
                                            {showCancelButton}
                                    </Col>
                                </Row>
                                <Row>
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
                                    <small style={{color:"grey"}}>Delivery Address : </small>
                                    <small>
                                        {order.deliveryAddress}
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
 
export default CustomerOrders;