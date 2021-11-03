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
            image: [],
            idDishes:"",
        };
        this.addDishHandler = this.addDishHandler.bind(this);
        this.editDishHandler = this.editDishHandler.bind(this);
        this.dishNameChangeHandler = this.dishNameChangeHandler.bind(this);
        this.priceChangeHandler = this.priceChangeHandler.bind(this);
        this.categoryChangeHandler = this.categoryChangeHandler.bind(this);
        this.descriptionChangeHandler = this.descriptionChangeHandler.bind(this);
        this.ingredientsChangeHandler = this.ingredientsChangeHandler.bind(this);
        this.fileSelected = this.fileSelected.bind(this);
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
            image: d.image,
            idDishes: i,
        });
    };
    dishNameChangeHandler = (e) => {
        this.setState({
            dishName: e.target.value || this.state.dishName,
        });
    };
    priceChangeHandler = (e) => {
        this.setState({
            price: e.target.value || this.state.price,
        });
    };
    categoryChangeHandler = (e) => {
        this.setState({
            category: e.target.value || this.state.category,
        }, () => {
            console.log("$$$$$$$$$$$$$$$$$ categoryyyyyy", this.state.category)
        });
    };
    descriptionChangeHandler = (e) => {
        this.setState({
            description: e.target.value || this.state.description,
        });
    };
    ingredientsChangeHandler = (e) => {
        this.setState({
            ingredients: e.target.value || this.state.ingredients,
        });
    };
    fileSelected = e => {
        e.preventDefault();
        const image = e.target.files[0];
        console.log("ee . target, ", e.target.files[0])
        this.setState({ image: image || this.state.image}, () => {
            console.log("fiiiillleee",this.state.image)
        });
    }

    // submit = event => {
    //     event.preventDefault()
    //     const image = this.state.image;
    //     const formData = new FormData();
    //     formData.append("image", image);
    //     formData.append("RestaurantID", localStorage.getItem("r_id"));
    //     console.log("formdata", formData.get('image'));
        
    //     const result = axios.post('http://localhost:5000/restaurant/dishImages', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
    //         .then((response) => {
    //             console.log("Status Code : ", response.status, "and", response.data);
    //             this.setState({
    //                 image: response.data
    //             })
    //         })
        
        
    //   }
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
        const image = this.state.image;
        const formData = new FormData();
        formData.append("image", image);
        formData.append("RestaurantID", localStorage.getItem("r_id"));
        formData.append("dishName", this.state.dishName);
        formData.append("price", this.state.price);
        formData.append("description", this.state.description);
        formData.append("ingredients", this.state.ingredients);
        formData.append("category", this.state.category);
        formData.append("idDishes", this.state.idDishes);

        console.log("idDishes",this.state.idDishes)
        //set the with credentials to true
        axios.defaults.withCredentials = true;
        //make a post request with the user data
        // this.props.signup(data);
        axios
            .post("http://localhost:5000/restaurant/restaurantEditNewDish",formData,{ headers: { 'Content-Type': 'multipart/form-data' } })
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
        const image = this.state.image;
        const formData = new FormData();
        formData.append("image", image);
        formData.append("RestaurantID", localStorage.getItem("r_id"));
        formData.append("dishName", this.state.dishName);
        formData.append("price", this.state.price);
        formData.append("description", this.state.description);
        formData.append("ingredients", this.state.ingredients);
        formData.append("category", this.state.category);
        formData.append("idDishes", this.state.idDishes);
        
        console.log("dish add form data,", formData.get('image'));
        //set the with credentials to true
        axios.defaults.withCredentials = true;
        //make a post request with the user data
        // this.props.signup(data);
        axios.post("http://localhost:5000/restaurant/restaurantAddNewDish", formData,{ headers: { 'Content-Type': 'multipart/form-data' } })
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
                                <option value="Salad">Salad</option>
                                <option value="Dessert">Dessert</option>
                                <option value="Beverage">Beverage</option>
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
                            <Form.Label>Image</Form.Label>
                            {/* <Form.Control type="file" accept="image/*" name="image" placeholder="Image URL" onChange={this.fileSelected} /> */}
                            <input onChange={this.fileSelected} type="file" accept="image/*" name="image"></input>
                            {/* <img src={this.state.image} className="profilePhoto" height="200" width="200" alt="Add profile picture"></img> */}
                            {/* <Button type="submit" className='btn m-3' variant="outline-success">Update Profile Picture</Button> */}
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
                                <option value="Salad">Salad</option>
                                <option value="Dessert">Dessert</option>
                                <option value="Beverage">Beverage</option>
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
                            <Form.Label>Image</Form.Label>
                            {/* <Form.Control type="file" accept="image/*" name="image" placeholder="Image URL" onChange={this.fileSelected} /> */}
                            <input onChange={this.fileSelected} type="file" accept="image/*" name="image"></input>
                            {/* <img src={this.state.image} className="profilePhoto" height="200" width="200" alt="Add profile picture"></img> */}
                            {/* <Button type="submit" className='btn m-3' variant="outline-success">Update Profile Picture</Button> */}
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
                            <Card style={{ width: '20rem',height: '25rem' }} className="text-black">
                                <Card.Header as="h5"> {d.dishName}</Card.Header>
                                <Card.Img variant="top" src={d.image} alt="Dish image"/>
                                <Card.ImgOverlay>
                                   
                                         <Card.Text className="bg-black" style={{ opacity: "0.8", marginTop: "220px", marginLeft: "50px", color: "white" }}>
                                             <small>
                                    {d.category} ~ <big>${d.price}</big>
                                <br></br>
                                             Ingredients : {d.ingredients}
                                             <br></br>
                                    
                                             Description : {d.description}
                                             <br></br>
                                    
                                        </small>
                                         </Card.Text>
                                         <Card.Footer>
                                    <Button variant="outline-success" onClick={() => this.editDishHandler(d,i)}>Edit</Button>
                                </Card.Footer>
                                </Card.ImgOverlay>
                                
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
