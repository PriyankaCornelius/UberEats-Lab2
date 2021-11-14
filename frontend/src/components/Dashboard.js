import React, { Component } from 'react';
import axios from 'axios';
import { Container } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import { Row, Col } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import { Redirect } from 'react-router';
import RestaurantList from './restaurantList';
import { Navbar } from 'react-bootstrap';
import BootstrapSwitchButton from 'bootstrap-switch-button-react';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import { InputGroup } from 'react-bootstrap';
import FormControl from 'react-bootstrap/FormControl';
import { Link } from 'react-router-dom';
import CustomerDishes from './customerDishes';
import Cart from "./customerCart";
import Logout from './logout';

class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sameLocationRestaurants: [],
            allLocationRestaurants: [],
            redirectToRestaurantProfile: "",
            deliveryMode: "",
            searchDietary:"",
            searchCuisine: "",
            searchLocation: "",
            searchDish: "",
            allRestaurants: [],
            filteredRestaurants: [],
            nearbyRestaurants: [],
            customerLocation: "",
            favourites: [],
            favEmails: [],
            idDisplayFavouriteRestaurants: false,
            // newly added
            cart : JSON.parse(localStorage.getItem("cart"))||[],
            orderTotal: "",
            checkingOut: false,
            cartCount: "",
            // newly added
        }
    }

    componentDidMount() {
        var data = { params: { CustomerID: localStorage.getItem("c_id") } };
        axios.get("http://localhost:5000/customer/getCustomerLocation", data).then((response) => {
            console.log("response customer location: ", response);
            console.log("customer location: ", response.data.Location);
            //update the state with the response data
            this.setState({
                searchLocation: response.data.Location,
                customerLocation: response.data.Location
            })
        })

        axios.get("http://localhost:5000/restaurant/getRestaurants").then((response) => {
            console.log("response: ", response);
            console.log("response data: ", response.data);
            //update the state with the response data
            this.setState({
                //sameLocationRestaurants: response.data['sameLocationRestaurants'],
                //allLocationRestaurants: response.data['allLocationRestaurants'],
                allRestaurants: response.data['allLocationRestaurants']
                //restaurants:response.data
            })
            // console.log("response sameLocationRestaurants: ", this.state.sameLocationRestaurants);
            // console.log("response allLocationRestaurants: ", this.state.allLocationRestaurants);
            console.log("response allRestaurants: ", this.state.allRestaurants);

            if (this.state.customerLocation !== null) {
                let filteredValues = this.state.allRestaurants.filter(restrnt => {
                    //return all restaurants where selected delivery mode is available
                    return restrnt.location === this.state.customerLocation
                });
                this.setState({
                    nearbyRestaurants: filteredValues
                });
                console.log(" email wala filval: filteredValues", filteredValues);
            }
        })
        this.getFavouriteRestaurants();
    }
    
    

    searchCuisineChangeHandler = e => {
        e.preventDefault();
        this.setState({
            searchCuisine: e.target.textContent
        }, () => {
            console.log("print", this.state.searchCuisine);
            if (this.state.searchCuisine !== null) {
                let filteredValues = this.state.filteredRestaurants.filter(restrnt => {
                    //return all restaurants where selected cuisine mode is available
                    return restrnt.Cuisine === this.state.searchCuisine
                });
                this.setState({
                    filteredRestaurants: filteredValues
                });
                console.log("printfinal", filteredValues);
            }
        });
        console.log("print", this.state.searchCuisine);
    }

    searchDietaryChangeHandler = e => {
        e.preventDefault();
        this.setState({
            searchDietary: e.target.textContent
        }, () => {
            console.log("printddd", this.state.searchDietary);
            if (this.state.searchDietary !== null) {
                let filteredValues = this.state.filteredRestaurants.filter(restrnt => {
                    //return all restaurants where selected dietary option is matches customer requirement
                    return restrnt.Dietary === this.state.searchDietary
                });
                this.setState({
                    filteredRestaurants: filteredValues
                });
                console.log("printfinal", filteredValues);
            }
        });
        console.log("print", this.state.searchDietary);
    }

    searchLocationChangeHandler = e => {
        e.preventDefault();
        this.setState({
            searchLocation: e.target.value
        });
        console.log("print", this.state.searchLocation);
    }

    searchDishChangeHandler = e => {
        e.preventDefault();
        this.setState({
            searchDish: e.target.value
        })
    }

    deliveryModeChangeHandler = e => {
        e.preventDefault();
        this.setState({
            deliveryMode: e.target.textContent
        }, () => {
            console.log("print", this.state.deliveryMode);
            if (this.state.deliveryMode !== null) {
                let filteredValues = this.state.allRestaurants.filter(restrnt => {
                    //return all restaurants where selected delivery mode is available
                    return restrnt.DeliveryMode === this.state.deliveryMode || restrnt.DeliveryMode=== "Delivery and Pickup"
                });
                this.setState({
                    filteredRestaurants: filteredValues
                });
                console.log("printfinal", filteredValues);
            }
        });
        console.log("print", this.state.deliveryMode);
    }
    
    filterLocation = e => {
        e.preventDefault();
        if (this.state.searchLocation !== null) {
            
            let filteredValues = this.state.filteredRestaurants.filter(restrnt => {
            //return all restaurants where selected delivery mode is available
            return restrnt.Location === this.state.searchLocation
            });
            this.setState({
                filteredRestaurants: filteredValues
            });
            console.log("filval: filteredValues", filteredValues);
        }
    }

        visitHandler = d => {
            //d.preventDefault();
            console.log("cart k liye restaurant id", d.d._id);
            if(this.state.cart.length===0)
                localStorage.setItem("cart_restaurant", d.d._id);
            localStorage.setItem("r_id", d.d._id);
            localStorage.setItem("restaurantVisiting", d.d.Name);
            this.setState({
                redirectToRestaurantProfile: <div>
                    <Redirect to={{
                        pathname: "/customerDishes",
                        addToCartHandler: this.addToCartHandler,
                        qtyIncrementHandler: this.qtyIncrementHandler,
                        qtyDecrementHandler: this.qtyDecrementHandler,
                        getTotalHandler: this.getTotalHandler,
                        checkoutHandler: this.checkoutHandler,
                        removeItemHandler: this.removeItemHandler,
                        state: {
                            cart: this.state.cart,
                            orderTotal: this.state.orderTotal,
                            // qtyIncrementHandler:this.qtyIncrementHandler,
                            // qtyDecrementHandler:this.qtyDecrementHandler,
                            // getTotalHandler:this.getTotalHandler,
                            // checkoutHandler:this.checkoutHandler,
                            // removeItemHandler:this.removeItemHandler,
                            cartCount:this.state.cart.length
                            }
                        }
                    }></Redirect>
                    </div>
            });
        }
    
    getFavouriteRestaurants = e => {
        //e.preventDefault();
        
        const data = {
            params: {
                CustomerID: localStorage.getItem("c_id"),
            }
        };
        console.log(data.params.CustomerID);
        axios.get("http://localhost:5000/customer/getFavouriteRestaurants", data).then((response) => {
            console.log("response status: ", response.status);
            console.log("favourite restaurants: ", response.data.favouriteRestaurants);
            
                let filteredValues = this.state.allRestaurants.filter(restrnt => {
                //return all restaurants which was selected as favourite
                    return response.data.favouriteRestaurants.includes(restrnt.Email)   
                });
                console.log("filteredValues",filteredValues);
                this.setState({
                    favEmails: response.data.favouriteRestaurants,
                    favourites: filteredValues
                });
            })

        // })
    }

    displayFavouriteRestaurants = e => {
        e.preventDefault();
        this.setState({
            idDisplayFavouriteRestaurants: !(this.state.idDisplayFavouriteRestaurants)
        })
    }


    //newly added
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

    // addToCartHandler = d => {
    //     // d.preventDefault();
    //     let newCart = [...this.state.cart];
    //     d['qty'] = 1;
    //     newCart.push(d);
    //     this.setState({
    //         cart: newCart,
    //         cartCount:this.state.cart.length
    //     });
    //     console.log(this.state.cart);
    //     window.location.reload();
    // }

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
    }
    //newly added

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
            let allRestaurantList = null;
            if (this.state.allRestaurants !== undefined) {
                allRestaurantList = <div>
                    <h6>View all restaurants</h6>
                    <RestaurantList
                    data={this.state.allRestaurants}
                    favourites={this.state.favEmails}
                    visitHandler={this.visitHandler}
                    redirectToRestaurantProfile={this.state.redirectToRestaurantProfile}
                >
                </RestaurantList>
                    </div>
            }
            let favouriteRestaurants = null;
            if (this.state.idDisplayFavouriteRestaurants === true && this.state.favourites!==undefined) {
                favouriteRestaurants = <div>
                    <h6>View your selected favourite restaurants</h6>
                    <RestaurantList
                    data={this.state.favourites}
                    favourites={this.state.favEmails}
                    visitHandler={this.visitHandler}
                    redirectToRestaurantProfile={this.state.redirectToRestaurantProfile}
                    fav={(
                        <img src="https://image.emojipng.com/29/13592029.jpg" title="Added to Favourites" style={{ width: 30, height: 20 }}>
                    </img>
                    )}
                >
                </RestaurantList>
                </div>
            }
            let nearbyRestaurants = null;
            if (this.state.customerLocation !== null) {
                nearbyRestaurants = <div>
                <h6>Popular near you</h6>
                <RestaurantList
                data={this.state.nearbyRestaurants}
                favourites={this.state.favEmails}
                visitHandler={this.visitHandler}
                redirectToRestaurantProfile={this.state.redirectToRestaurantProfile}
            >
            </RestaurantList>
                </div>
            }
            
            let filtereredList = null;
            if (this.state.filteredRestaurants !== undefined || this.state.filteredRestaurants !== []) {
                filtereredList = <div>
                    <h6>Filtered Search</h6>
                    <RestaurantList
                    data={this.state.filteredRestaurants}
                    favourites={this.state.favEmails}
                    visitHandler={this.visitHandler}
                    redirectToRestaurantProfile={this.state.redirectToRestaurantProfile}
                >
                    </RestaurantList>
                    </div>
            }
            
            return <div>
                {/* {console.log("log it", this.props.history.location.state)} */}
                {/* {console.log("cart Dashboard", this.props.location)} */}
                <div>
                    <Navbar bg="light" expand="lg">
                        <Container>
                            <Navbar.Brand>
                                <Row>
                                <Col>
                                    <InputGroup className="mb-3">
                                        <DropdownButton id="dropdown-basic-button" placeholder="Delivery Mode" title={this.state.deliveryMode || "Select Delivery Mode"} value={this.state.deliveryMode} variant="outline-success">
                                            <Dropdown.Item as="button" variant="outline-dark"><div onClick={(e) => this.deliveryModeChangeHandler(e)}>Delivery</div></Dropdown.Item>
                                            <Dropdown.Item as="button" variant="outline-dark"><div onClick={(e) => this.deliveryModeChangeHandler(e)}>Pickup</div></Dropdown.Item>
                                        </DropdownButton>
                                    </InputGroup>
                                    </Col>
                                
                                    <Col>
                                        {/* <input type="text" className="rounded-pill border border-success" style={{ fontSize: 14, padding: 6 }} placeholder="Enter location" onChange={this.searchLocationChangeHandler}></input> */}
                                        <InputGroup className="mb-3">
                                        <FormControl
                                        className="border border-success"
                                        style={{color:"black", fontStyle:"italic"}}
                                        onChange={this.searchLocationChangeHandler}
                                        value={this.state.searchLocation}
                                        placeholder="Enter location"
                                        aria-label="Enter location"
                                        aria-describedby="basic-addon2"
                                        />
                                            <InputGroup.Text className="btn" style={{backgroundColor:"white", color:"green"}} onClick={this.filterLocation}>search</InputGroup.Text>
                                    </InputGroup>
                                    </Col>
                                    <Col>
                                        <input type="text" className="rounded-pill border border-success" style={{ fontSize: 14, padding: 6, width: 400 }} placeholder="What are you craving?" onChange={this.searchDishChangeHandler}></input>
                                    </Col>
                                    <Col>
                                    <InputGroup className="mb-3">
                                        <DropdownButton id="dropdown-basic-button" placeholder="Cuisine" title={this.state.searchCuisine || "Search by cuisine"} value={this.state.searchCuisine} variant="outline-success">
                                            <Dropdown.Item as="button" variant="outline-dark"><div onClick={(e) => this.searchCuisineChangeHandler(e)}>Chinese</div></Dropdown.Item>
                                            <Dropdown.Item as="button" variant="outline-dark"><div onClick={(e) => this.searchCuisineChangeHandler(e)}>Thai</div></Dropdown.Item>
                                            <Dropdown.Item as="button" variant="outline-dark"><div onClick={(e) => this.searchCuisineChangeHandler(e)}>Indian</div></Dropdown.Item>
                                        </DropdownButton>
                                    </InputGroup>
                                    </Col>
                                    <Col>
                                    <InputGroup className="mb-3">
                                        <DropdownButton id="dropdown-basic-button" placeholder="Dietary" title={this.state.searchDietary || "Choose Dietary option"} value={this.state.searchDietary} variant="outline-success">
                                            <Dropdown.Item as="button" variant="outline-dark"><div onClick={(e) => this.searchDietaryChangeHandler(e)}>Vegan</div></Dropdown.Item>
                                            <Dropdown.Item as="button" variant="outline-dark"><div onClick={(e) => this.searchDietaryChangeHandler(e)}>Vegetarian</div></Dropdown.Item>
                                            <Dropdown.Item as="button" variant="outline-dark"><div onClick={(e) => this.searchDietaryChangeHandler(e)}>Non Vegetarian</div></Dropdown.Item>
                                        </DropdownButton>
                                    </InputGroup>
                                    </Col>
                                    {/* <Col>
                                    <Link to="/customerProfile" className="btn btn-outline-success">Profile</Link>
                                    </Col> */}
                                </Row> <Row>
                                
                                <Col>
                                <Link to="/CustomerOrders" className="btn btn-outline-success">Your Orders</Link>
                                </Col>
                                <Col>
                                <Link to="/customerProfile" className="btn btn-outline-success">Profile</Link></Col>
                                <Col><Button variant="outline-success" onClick={this.displayFavouriteRestaurants}>Favourites</Button></Col>
                                <Col><Logout></Logout></Col>
                            </Row>
                            </Navbar.Brand>
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
                </div>
                <div>
                {filtereredList}
                </div>
                

                <div>
                {favouriteRestaurants}
                </div>
                <hr></hr>

                <div>
                {nearbyRestaurants}
                </div>
                <hr></hr>
                
                <div>
                {allRestaurantList}
                </div>
                <hr></hr>
            
            </div>;
        }
    }
 
export default Dashboard;