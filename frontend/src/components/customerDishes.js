import React, { Component } from "react";
//import "../../App.css";
import axios from "axios";
//import cookie from "react-cookies";
import { Redirect } from "react-router";
import Card from 'react-bootstrap/Card';
import { Row, Col, Navbar } from 'react-bootstrap';
import { Container } from "react-bootstrap";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Cart from "./customerCart";
import RestaurantTab from './restaurantTab';
// import Dashboard from "./Dashboard";
import CreateNewOrder from "./createNewOrder";
import { Link } from "react-router-dom";
import PlaceOrder from "./placeOrder";
import { Route } from "react-router";
//Define a Login Component
class CustomerDishes extends Component {
        state = {
            dishes: "",
            addDishModal: false,
            editDishModal: false,
            dishName: "",
            price: "",
            description:"",
            ingredients: "",
            category: "",
            imageURL: "",
            idDishes: "",
            seen : false,
            cart : JSON.parse(localStorage.getItem("cart"))||[],
            orderTotal: "",
            checkingOut: false,
            cartCount: "",
            showDashboard: false,
            showNewOrderModal:false
        };
        // addDishHandler = addDishHandler.bind(this);
        // editDishHandler = editDishHandler.bind(this);
        // dishNameChangeHandler = dishNameChangeHandler.bind(this);
        // priceChangeHandler = priceChangeHandler.bind(this);
        // categoryChangeHandler = categoryChangeHandler.bind(this);
        // descriptionChangeHandler = descriptionChangeHandler.bind(this);
        // ingredientsChangeHandler = ingredientsChangeHandler.bind(this);
        // imageUrlChangeHandler = imageUrlChangeHandler.bind(this);
        // submitAddDish = submitAddDish.bind(this);
        // submitEditDish= submitEditDish.bind(this);
    
    componentDidMount() {
        var data = { params: { RestaurantID: localStorage.getItem("r_id") } };
        console.log("restaurant id ", data);
        axios.get("http://localhost:5000/restaurant/getRestaurantDishes", data).then((response) => {
            //update the state with the response data
            this.setState({
                dishes: response.data.Dishes,
                addDishModal: false,
                editDishModal: false,
                dishName: "",
                price: "",
                description: "",
                ingredients: "",
                category: "",
                idDishes: "",
                seen: false,
                orderTotal: "",
                //cart : [{dish: "chicken", price : 200, qty:1},{dish : "pork", price : 100, qty:1},{dish : "beef" , price: 400, qty:1}],
            });
        });
    }

    qtyIncrementHandler = index => {
        let newCart = [...this.state.cart];
        let i=index.index;
        console.log("cart", this.state.cart[i].qty);
        console.log("newcart",newCart[i]);
        newCart[i].qty = newCart[i].qty+1;
        console.log(newCart[i].qty);
        this.setState(
                {
                    cart : newCart
                },() => {
                    localStorage.setItem("cart",JSON.stringify(this.state.cart))
                });
    }

    qtyDecrementHandler = index => {
        let newCart = [...this.state.cart];
        let i = index.index;
        console.log(i);
        if (newCart[i].qty === 1) {
            newCart.splice(i, 1);
        }
        else {
            newCart[i].qty = newCart[i].qty-1;
        }
        //console.log(newCart[index.target.value].qty);
        this.setState(
                {
                    cart : newCart
                },() => {
                    localStorage.setItem("cart",JSON.stringify(this.state.cart))
                });
    }

    removeItemHandler = index => {
        let newCart = [...this.state.cart];
        let i = index.index;
        console.log(i);
        newCart.splice(i, 1);
        this.setState(
            {
                cart: newCart,
                cartCount:this.state.cart.length
            },() => {
                localStorage.setItem("cart",JSON.stringify(this.state.cart))
            }); 
    }

    getTotalHandler = () => {
        this.setState({
            orderTotal : this.state.cart.reduce(
                (sum, { price, qty }) => sum + price * qty,
                0
              )
        });
    };

    addToCartHandler = d => {
        let cartRestaurantID = localStorage.getItem("cart_restaurant");
        let currentRestaurantID = localStorage.getItem("r_id");
        if (cartRestaurantID !== currentRestaurantID) {
            this.setState({ showNewOrderModal: true })
        }
        else {
            let newCart = [...this.state.cart];
            d['qty'] = 1;
            newCart.push(d);
            this.setState({
                cart: newCart,
                cartCount: this.state.cart.length
            }, () => {
                localStorage.setItem("cart", JSON.stringify(this.state.cart))
            });
            console.log(this.state.cart);
        }
    }

    checkoutHandler = e => {
        e.preventDefault();
        console.log("eeeeeeeeeewwwwwww", this.state.cart);
        const data = {
            customerEmail: localStorage.getItem("customerEmail"),
            restaurantEmail: localStorage.getItem("restaurantEmail"),
            // deliveryMode: this.state.deliveryMode,
            orderTime: Date().toLocaleString(),
            //orderStatus: this.state.orderStatus,
        };
        if (this.state.cart !== null) {
            this.setState({
                checkingOut: true
            }, () => console.log("setstated", this.state.checkingOut))
        }
        localStorage.removeItem('cart');
        localStorage.removeItem('cart_restaurant');
    
     }

    // handleDashboardShow = e => {
    //     e.preventDefault();
    //     this.setState({ showDashboard: true })
    // }
    render() {
        let placeOrderRender = null;
        if (this.state.checkingOut === true) {
            placeOrderRender = <div>
                <Redirect to={{
                    pathname: "placeOrder",
                    state:{cart:this.state.cart, orderTotal:this.state.orderTotal}
                }}>
                </Redirect>
            </div>
        }
        let renderNewOrderModal=null
        if (this.state.showNewOrderModal === true) {
            renderNewOrderModal = <div>(<CreateNewOrder
                cartRestaurantID={localStorage.getItem("cart_restaurant")}
                currentRestaurantID = {localStorage.getItem("r_id")}
            ></CreateNewOrder>)</div>
        }
        // let renderDashboard=null;
        // if (this.state.showDashboard === true) {
        //     renderDashboard =<div>
        //         <Redirect to={{
        //             pathname: "Dashboard",
        //             state: {
        //                 cart: this.state.cart,
        //                 orderTotal: this.state.orderTotal,
        //                 // qtyIncrementHandler:this.qtyIncrementHandler,
        //                 // qtyDecrementHandler:this.qtyDecrementHandler,
        //                 // getTotalHandler:this.getTotalHandler,
        //                 // checkoutHandler:this.checkoutHandler,
        //                 // removeItemHandler:this.removeItemHandler,
        //                 // history.pushState(this.getTotalHandler, '', 'Dashboard'),
        //                 cartCount:this.state.cart.length
        //             }
                    
        //         }}>
        //         </Redirect>
        //         </div>
        // }
        const data = this.state.dishes;
        console.log("data:", data);
        console.log("proooooooooops",this.props.location)
        return (
            <div>
                <Navbar bg="light" expand="lg">
                    <Container>
                        <Col>
                            <Link to="/Dashboard" className="btn btn-outline-success">Dashboard</Link>
                            
                        </Col>
                        {/* <Col>
                            <Button variant="outline-success" onClick={this.handleDashboardShow}>
                            Dashboard
                            </Button>{renderDashboard}
                        </Col> */}
                    </Container>
                    </Navbar>
                <Cart
                    cart={this.state.cart}
                    orderTotal={this.state.orderTotal}
                    qtyIncrementHandler={this.qtyIncrementHandler}
                    qtyDecrementHandler={this.qtyDecrementHandler}
                    getTotalHandler={this.getTotalHandler}
                    checkoutHandler={this.checkoutHandler}
                    removeItemHandler={this.removeItemHandler}
                    cartCount={this.state.cart.length}
                ></Cart>
                {placeOrderRender}
                {renderNewOrderModal}
                <RestaurantTab></RestaurantTab>
                <hr></hr>
                <div>  
                    <Container>
                    <Row>
                    {data !== "" ? data.map((d,i) => {
                        return (
                            <Col xs="3">
                            <Card style={{ width: '15rem' }}>
                                <Card.Header as="h5"> Category : {d.category}</Card.Header>
                                <Card.Img variant="top" src={d.image} />
                                <Card.Body>
                                    <Card.Title>{d.dishName}</Card.Title>
                                    <Card.Text>
                                        Price : ${d.price}
                                    </Card.Text>
                                    <Card.Text>
                                        Ingredients : {d.ingredients}
                                    </Card.Text>
                                    <Card.Text>
                                        Description : {d.description}
                                    </Card.Text>
                                    <Card.Text>
                                        Dish ID : {i}
                                    </Card.Text>
                                </Card.Body>
                                <Card.Footer>
                                    <Button variant="success" onClick={() => this.addToCartHandler(d)}>Add to Cart</Button>
                                </Card.Footer>
                            </Card>
                            </Col>
                        )
                    }) : ""}
                    </Row>
                    </Container>
                
                </div>
                
            </div>

            
        );
    }
}

export default CustomerDishes;
