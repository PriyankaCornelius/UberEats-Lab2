import React, { Component } from "react";
//import "../../App.css";
import axios from "axios";
//import cookie from "react-cookies";
import { Redirect } from "react-router";
import Card from 'react-bootstrap/Card';
import { Row, Col } from 'react-bootstrap';
import { Container } from "react-bootstrap";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { Navbar } from 'react-bootstrap';

//Define a Login Component
class Dishes extends Component {
    //call the constructor method
    constructor(props) {
        //Call the constrictor of Super class i.e The Component
        super(props);
        //maintain the state required for this component
        this.state = {
            dishes: [],
            addDishModal: false,
            editDishModal: false,
            dishName: "",
            price: "",
            description:"",
            ingredients: "",
            category: "",
            imageURL: "",
            idDishes:"",
        };
        this.addDishHandler = this.addDishHandler.bind(this);
        this.editDishHandler = this.editDishHandler.bind(this);
        this.dishNameChangeHandler = this.dishNameChangeHandler.bind(this);
        this.priceChangeHandler = this.priceChangeHandler.bind(this);
        this.categoryChangeHandler = this.categoryChangeHandler.bind(this);
        this.descriptionChangeHandler = this.descriptionChangeHandler.bind(this);
        this.ingredientsChangeHandler = this.ingredientsChangeHandler.bind(this);
        this.imageUrlChangeHandler = this.imageUrlChangeHandler.bind(this);
        this.submitAddDish = this.submitAddDish.bind(this);
        this.submitEditDish= this.submitEditDish.bind(this);
    }
    addDishHandler = (e) => {
        this.setState({
            idDishes: this.state.dishes.length,
            addDishModal: true,
        });
        
    };
    editDishHandler = (d,i) => {
        this.setState({
            editDishModal: true,
            dishName: d.dishName,
            price: d.price,
            description:d.description,
            ingredients: d.ingredients,
            category: d.category,
            imageURL: d.Image,
            idDishes: i,
        });
    };
    dishNameChangeHandler = (e) => {
        this.setState({
            dishName: e.target.value,
        });
    };
    priceChangeHandler = (e) => {
        this.setState({
            price: e.target.value,
        });
    };
    categoryChangeHandler = (e) => {
        this.setState({
            category: e.target.value,
        });
    };
    descriptionChangeHandler = (e) => {
        this.setState({
            description: e.target.value,
        });
    };
    ingredientsChangeHandler = (e) => {
        this.setState({
            ingredients: e.target.value,
        });
    };
    imageUrlChangeHandler = (e) => {
        this.setState({
            imageURL: e.target.value,
        });
    };
    componentDidMount() {
        var data = { params: { RestaurantID: localStorage.getItem("r_id") } };
        axios.get("http://localhost:5000/restaurant/getRestaurantDishes", data).then((response) => {
            //update the state with the response data
            this.setState({
                dishes: response.data.Dishes,
                addDishModal: false,
                editDishModal: false,
                dishName: "",
                price: "",
                description:"",
                ingredients: "",
                category: "",
                idDishes:"",
            
            });
        });


    }


    submitEditDish = (e) => {
        var headers = new Headers();
        //prevent page from refresh
        e.preventDefault();
        const data = {
            //idRestaurants: +localStorage.getItem("r_id"),
            RestaurantID: localStorage.getItem("r_id"),
            dishName: this.state.dishName,
            price: this.state.price,
            description:this.state.description,
            ingredients: this.state.ingredients,
            category: this.state.category,
            imageURL: this.state.imageURL,
            idDishes:this.state.idDishes,

        };
        console.log("idDishes",this.state.idDishes)
        //set the with credentials to true
        axios.defaults.withCredentials = true;
        //make a post request with the user data
        // this.props.signup(data);
        axios
            .post("http://localhost:5000/restaurant/restaurantEditNewDish", data)
            .then((response) => {
                console.log("Status Code : ", response.status);
                if (response.status === 200) {
                    window.alert("Dish Edited Successfully");
                    //var data1 = { params: { idRestaurants: +localStorage.getItem("r_id") } };
                    var data1 = { params: { RestaurantID: localStorage.getItem("r_id") } };
            axios.get("http://localhost:5000/restaurant/getRestaurantDishes", data1).then((response) => {
                //update the state with the response data
                console.log("response dishes",response.data.Dishes);
                this.setState({
                    dishes: response.data.Dishes,
                    addDishModal: false,
                    editDishModal: false,
                    dishName: "",
                    price: "",
                    description:"",
                    ingredients: "",
                    category: "",
                    idDishes:"",
                
                });
            });
                } else {
                    window.alert("Unable to edit dish!");

                }
            })
            .catch((e) => {
                debugger;
                console.log("FAIL!!!");
            });


            
    
    };


    submitAddDish = (e) => {
        var headers = new Headers();
        //prevent page from refresh
        e.preventDefault();
        const data = {
            //idRestaurants: +localStorage.getItem("r_id"),
            RestaurantID: localStorage.getItem("r_id"),
            dishName: this.state.dishName,
            price: this.state.price,
            description:this.state.description,
            ingredients: this.state.ingredients,
            category: this.state.category,
            imageURL: this.state.imageURL,
            idDishes: this.state.idDishes
        };
        
        //set the with credentials to true
        axios.defaults.withCredentials = true;
        //make a post request with the user data
        // this.props.signup(data);
        axios
            .post("http://localhost:5000/restaurant/restaurantAddNewDish", data)
            .then((response) => {
                console.log("Status Code : ", response.status);
                if (response.status === 200) {
                    window.alert("Dish Added To Menu!");
                    //var data2 = { params: { idRestaurants: +localStorage.getItem("r_id") } };
                    var data2 = { params: { RestaurantID: localStorage.getItem("r_id") } };
            axios.get("http://localhost:5000/restaurant/getRestaurantDishes", data2).then((response) => {
                //update the state with the response data
                console.log("response dishes",response.data.Dishes);
                this.setState({
                    dishes: response.data.Dishes,
                    addDishModal: false,
                    editDishModal: false,
                    dishName: "",
                    price: "",
                    description:"",
                    ingredients: "",
                    category: "",
                    idDishes:"",
                
                });
            });

                } else {
                    window.alert("Unable to Add Dish");
                }

            })
            .catch((e) => {
                debugger;
                console.log("FAIL!!!");
            });

            
    
    };

    render() {
        let addDish = (
            <Modal show={this.state.addDishModal} onHide={() => this.setState({ addDishModal: false })}>
                <Modal.Header closeButton>
                    <Modal.Title>Add a new Dish!</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form onSubmit={this.submitAddDish} >
                        <Form.Group controlId="formDishName">
                            <Form.Label>Dish Name</Form.Label>
                            <Form.Control type="text" placeholder="Name" onChange={this.dishNameChangeHandler} required />
                        </Form.Group>
                        <Form.Group controlId="Price">
                            <Form.Label>Price</Form.Label>
                            <Form.Control type="number" step="0.01" placeholder="Price" onChange={this.priceChangeHandler} required/>
                        </Form.Group>
                        <Form.Group controlId="exampleForm.ControlSelect1">
                            <Form.Label>Category</Form.Label>
                            <Form.Control as="select" onChange={this.categoryChangeHandler}>
                                <option value="Main Course">Main Course</option>
                                <option value="Appetizer">Appetizer</option>
                                <option value="Salads">Salads</option>
                                <option value="Desserts">Desserts</option>
                                <option value="Beverages">Beverages</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="description">
                            <Form.Label>Description</Form.Label>
                            <Form.Control type="text" placeholder="Description" onChange={this.descriptionChangeHandler} />
                        </Form.Group>
                        <Form.Group controlId="formIngredients">
                            <Form.Label>Ingredients</Form.Label>
                            <Form.Control type="text" placeholder="Ingredients" onChange={this.ingredientsChangeHandler} />
                        </Form.Group>
                        <Form.Group controlId="formImageURL">
                            <Form.Label>Image URL</Form.Label>
                            <Form.Control type="text" placeholder="Image URL" onChange={this.imageUrlChangeHandler} />
                        </Form.Group>
                        <Button variant="success" type="submit">
                            Add
                        </Button>
                       
                    </Form>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="primary" onClick={() => this.setState({ addDishModal: false })}>Close</Button>
                </Modal.Footer>
            </Modal>
        );

        let editDish = (
            <Modal show={this.state.editDishModal} onHide={() => this.setState({ editDishModal: false })}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Dish!</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form onSubmit={this.submitEditDish} >
                        <Form.Group controlId="formDishName">
                            <Form.Label>Dish Name</Form.Label>
                            <Form.Control type="text" placeholder="Name" onChange={this.dishNameChangeHandler} defaultValue={this.state.dishName} required />
                        </Form.Group>
                        <Form.Group controlId="Price">
                            <Form.Label>Price</Form.Label>
                            <Form.Control type="number" step="0.01" placeholder="Price" onChange={this.priceChangeHandler} defaultValue={this.state.price} required/>
                        </Form.Group>
                        <Form.Group controlId="exampleForm.ControlSelect1">
                            <Form.Label>Category</Form.Label>
                            <Form.Control as="select" onChange={this.categoryChangeHandler} defaultValue={this.state.category}>
                                <option value="Main Course">Main Course</option>
                                <option value="Appetizer">Appetizer</option>
                                <option value="Salads">Salads</option>
                                <option value="Desserts">Desserts</option>
                                <option value="Beverages">Beverages</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="description">
                            <Form.Label>Description</Form.Label>
                            <Form.Control type="text" placeholder="Description" onChange={this.descriptionChangeHandler} />
                        </Form.Group>
                        <Form.Group controlId="formIngredients">
                            <Form.Label>Ingredients</Form.Label>
                            <Form.Control type="text" placeholder="Ingredients" onChange={this.ingredientsChangeHandler} defaultValue={this.state.ingredients}/>
                        </Form.Group>
                        <Form.Group controlId="formImageURL">
                            <Form.Label>Image URL</Form.Label>
                            <Form.Control type="text" placeholder="Image URL" onChange={this.imageUrlChangeHandler} defaultValue={this.state.imageURL}/>
                        </Form.Group>
                        <Button variant="success" type="submit">
                            Edit
                    </Button>
                
                    </Form>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="outline-success" onClick={() => this.setState({ editDishModal: false })}>Close</Button>
                </Modal.Footer>
            </Modal>
        );
        const data = this.state.dishes;
        console.log("data:", data);
        //var d = data;
        return (
            <div>
                
                <Button variant="success" onClick={this.addDishHandler}>Add Dish</Button>
                {addDish}
                {editDish}
                <div>
                    
                    <Container>
                    <Row>
                    {data !== [] ? data.map((d, i) => {
                        
                         return ( 
                            <Col xs="3">
                            <Card style={{ width: '20rem' }}>
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
                                    <Button variant="outline-success" onClick={() => this.editDishHandler(d,i)}>Edit</Button>
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

export default Dishes;
