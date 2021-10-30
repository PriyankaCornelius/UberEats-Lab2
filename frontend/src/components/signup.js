import React, { Component } from "react";
//import "../../App.css";
import axios from "axios";
//import cookie from "react-cookie";
//import { Redirect } from "react-router";
import 'react-bootstrap-accordion/dist/index.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
//import { Accordion } from 'react-bootstrap-accordion';
import Accordion from 'react-bootstrap/Accordion'
import { Card } from 'react-bootstrap';
import { Redirect } from "react-router";
import { connect } from "react-redux";
import { setUsername, setAuthFlag, setPersona, setName } from "../redux/slices/signup"
// import Button from 'react-bootstrap';
//Define a Login Component
class Signup extends Component {
    //call the constructor method
    constructor(props) {
        //Call the constrictor of Super class i.e The Component
        super(props);
        //maintain the state required for this component
        this.state = {
            authFlag:false,
            persona:"",
            name:"",
            email: "",
            password: "",
            idCreated: "",
            location: "",
        };
        
        //Call the Will Mount to set the auth Flag to false
        //   componentWillMount() {
        //     this.setState({
        //       authFlag: false,
        //     });
        //   }
    
    }

    personaChangeHandler=(e)=>{
        this.setState({
            persona: e.target.textContent.split(' ')[0]
        });
        console.log(e.target.textContent.split(' ')[0]);
    };

    nameChangeHandler=(e)=>{
        this.setState({
            name: e.target.value
        });
    };

    emailChangeHandler=(e)=>{
        this.setState({
            email: e.target.value
        });
        console.log(e.target.value);
    };

    passwordChangeHandler=(e)=>{
        this.setState({
            password: e.target.value
        });
        console.log(e.target.value);
    };

    locationChangeHandler=(e)=>{
        this.setState({
            location: e.target.value
        });
        console.log(e.target.value);
    };

    //submit Login handler to send a request to the node backend
    submitCustomerSignup = (e) => {
        var headers = new Headers();
        //prevent page from refresh
        e.preventDefault();
        const data = {
        email: this.state.email,
        password: this.state.password,
        name: this.state.name
        };
        //set the with credentials to true
        axios.defaults.withCredentials = true;
        //make a post request with the user data
        // this.props.signup(data);
        axios
        .post("http://localhost:5000/customer/customerSignUp", data)
        .then((response) => {
            console.log("Status Code : ", response.status);
            if (response.status === 200) {
                localStorage.setItem("c_id", response.data.CustomerID);
                localStorage.setItem('customerEmail', this.state.email);
                localStorage.setItem('persona',this.state.persona);
                this.setState({
                    authFlag: true,
                    persona:"Customer",
                    idCreated: ( 
                    <Redirect to="/customerProfile"></Redirect>
                ),
                });
            this.props.setPersona(this.state.persona);
            this.props.setName(this.state.name);
            this.props.setUsername(this.state.email);
            console.log(" props for redux", this.state.email)
            this.props.setAuthFlag(true);
                
            } else {
            this.setState({
                idCreated: (
                <h3>
                    Email Id already registered!
                </h3>
                ),
            });
            }
        })
        .catch((e) => {
            debugger;
            console.log("FAIL!!!");
        });
    };

    submitRestaurantSignup = (e) => {
        var headers = new Headers();
        //prevent page from refresh
        e.preventDefault();
        const data = {
            name: this.state.name,
            email: this.state.email,
            password: this.state.password,
            location: this.state.location
        };
        //set the with credentials to true
        axios.defaults.withCredentials = true;
        //make a post request with the user data
        // this.props.signup(data);
        axios
          .post("http://localhost:5000/restaurant/restaurantSignUp", data)
          .then((response) => {
              console.log("Status Code : ", response.status);
              console.log("restaurant id : ", response.data.RestaurantID);
              
              if (response.status === 200) {
                  localStorage.setItem("r_id", response.data.RestaurantID);
                  localStorage.setItem('restaurantEmail', this.state.email);
                  localStorage.setItem('persona',this.state.persona);
                  this.setState({
                    authFlag: true,
                    persona:"Restaurant",
                    idCreated: ( 
                  <Redirect to="/restaurantProfile"></Redirect>
                    ),
                });
          this.props.setPersona(this.state.persona);
          this.props.setName(this.state.name);
          this.props.setUsername(this.state.email);
          console.log(" props for redux", this.state.email)
          this.props.setAuthFlag(true);
    
            } else {
              this.setState({
                idCreated: (
                  <h3>
                    Email Id already registered!
                  </h3>
                ),
              });
            }
          })
          .catch((e) => {
            debugger;
            console.log("FAIL!!!");
          });
      };
    


    render() {
        //redirect based on successful login
        // let redirectVar = null;
        // // let invalidCredentials = null;
        // if (cookie.load("cookie")) {
        // redirectVar = <Redirect to="/home" />;
        // }

        return (
            <div>
                <div className="container" >
                    <div className="shadow" style={{textAlign: "center"}}>
                        <div className="signup-form">
                            
                            {this.state.idCreated}
                            <Accordion>
                               <Accordion.Header  as="button" className="btn" eventKey="0" value="Customer" onClick={this.personaChangeHandler}>Customer Sign Up</Accordion.Header>
                                <Accordion.Body>
                                <Card>
                                    <Card.Body>
                                        <div>
                                        <Form onSubmit={this.submitCustomerSignup}>
                                                
                                        <Form.Group controlId="CformName">
                                        <Form.Label>Name</Form.Label>
                                        <Form.Control type="text" placeholder="Name" onChange={this.nameChangeHandler} required />
                                        </Form.Group>
                                               
                                        <Form.Group controlId="CformEmail">
                                        <Form.Label>Email address</Form.Label>
                                        <Form.Control type="email" placeholder="Enter email" onChange={this.emailChangeHandler} required/>
                                        </Form.Group>

                                        <Form.Group controlId="CformPassword">
                                        <Form.Label>Password</Form.Label>
                                        <Form.Control type="password" placeholder="Password" onChange={this.passwordChangeHandler} required />
                                        </Form.Group>
                                                
                                        <Button variant="success" type="submit">
                                        Sign up
                                        </Button>
                                        </Form>   
                                        </div>
                                    </Card.Body>
                                </Card>
                                </Accordion.Body>
                            </Accordion>
                            <Accordion>
                            <Accordion.Header  as="button" className="btn" eventKey="0" value="Restaurant" onClick={this.personaChangeHandler}>Restaurant Sign Up</Accordion.Header>
                                <Accordion.Body>
                                <Card>
                                    <Card.Body>
                                        <div>
                                        <Form onSubmit={this.submitRestaurantSignup}>
                                                
                                        <Form.Group controlId="RformName">
                                        <Form.Label>Restaurant Name</Form.Label>
                                        <Form.Control type="text" placeholder="Restaurant Name" onChange={this.nameChangeHandler} required />
                                        </Form.Group>
                                               
                                        <Form.Group controlId="RformEmail">
                                        <Form.Label>Email address</Form.Label>
                                        <Form.Control type="email" placeholder="Enter email" onChange={this.emailChangeHandler} required/>
                                        </Form.Group>

                                        <Form.Group controlId="RformPassword">
                                        <Form.Label>Password</Form.Label>
                                        <Form.Control type="password" placeholder="Password" onChange={this.passwordChangeHandler} required />
                                        </Form.Group>
                                                
                                        <Form.Group controlId="RformLocation">
                                        <Form.Label>Location</Form.Label>
                                        <Form.Control type="text" placeholder="Location" onChange={this.locationChangeHandler} required />
                                        </Form.Group>
                                        
                                        <Button variant="success" type="submit">
                                        Sign up
                                        </Button>    
                                        </Form>
                                        </div>
                                    </Card.Body>
                                </Card>
                                </Accordion.Body>
                            </Accordion>
                        </div>
                    </div>
                </div>
           </div>
    );
    }
}
const mapDispatchToProps = { setUsername, setAuthFlag, setPersona, setName };

//export Signup Component
export default connect(null, mapDispatchToProps)(Signup);