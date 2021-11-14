// eslint-disable-next-line no-unused-vars
import React, { Component } from 'react';
import ReactDOM from "react-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import {Redirect} from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from "axios";
import jwt_decode from "jwt-decode";
import { connect } from "react-redux";
import { setUsername, setAuthFlag, setPersona, setCustomerID } from "../redux/slices/login"
//const axios = require('axios');


class Login extends React.Component {
    //call the constructor method
    constructor(props) {
        //Call the constructor of Super class i.e The Component
        super(props);
        //maintain the state required for this component
      this.state = {
            username: "",
            password: "",
            authFlag: false,
            idStatus: "",
            idCustomers: "",
            persona: "",
            CustomerID:""
        }
        this.usernameChangeHandler = this.usernameChangeHandler.bind(this);
        this.passwordChangeHandler = this.passwordChangeHandler.bind(this);
        this.personaChangeHandler = this.personaChangeHandler.bind(this);
        this.submitLogin = this.submitLogin.bind(this);
    }

     //Call the Will Mount to set the auth Flag to false
    componentWillMount() {
        this.setState({
            authFlag: false,
            persona: ""
        });
    }
  
    personaChangeHandler=(e)=>{
        this.setState({
            persona: e.target.value
        });
        console.log(e.target.value);
    };
    //username change handler to update state variable with the text entered by the user
    usernameChangeHandler = (e) => {
      this.setState({
        username: e.target.value,
      });
      console.log("email ",e.target.value);
    };
    
    //password change handler to update state variable with the text entered by the user
    passwordChangeHandler = (e) => {
      this.setState({
        password: e.target.value,
      });
    };
  
    //submit Login handler to send a request to the node backend
    submitLogin = (e) => {
      var headers = new Headers();
      //prevent page from refresh
      e.preventDefault();
      const data = {
        email: this.state.username,
        password: this.state.password,
      };
      console.log(data);
      //set the with credentials to true
      axios.defaults.withCredentials = true;
      if (this.state.persona === "Customer") {
        //make a post request with the user data
        axios
          .post("http://localhost:5000/customer/customerLogin", data)
        .then((response) => {
          console.log("Status Code : ", response.status);
          console.log(response.data);
          if (response.status === 200) {
            this.setState({
              token: response.data,
              authFlag: true,
              
            });
            console.log("length", this.state.token.length);
            if (this.state.token.length > 0) {
              localStorage.setItem("token", this.state.token);

              var decoded = jwt_decode(this.state.token.split(' ')[1]);
              console.log("decoded:", decoded);
              localStorage.setItem("c_id", decoded._id);
              localStorage.setItem("persona", this.state.persona);
              localStorage.setItem("customerEmail", this.state.email);
              this.props.setPersona(this.state.persona);
              // console.log(response.data.idCustomers);
              this.setState({
                CustomerID: decoded._id,
                idStatus: ( 
                  <Redirect to="/Dashboard"></Redirect>
              )
              });
              
              //   console.log(response.data.password);

              this.props.setCustomerID(this.state.CustomerID);
              this.props.setUsername(this.state.username);
              this.props.setAuthFlag(true);
              //  window.location.reload();
            }

          } else {
            this.setState({
              authFlag: false,
            });
            this.setState({
              invalidCredentials: (
                <p>
                  Your login credentials could not be verified, please try again.
                </p>
              ),
            });
          }
          console.log("success:" + this.state.authFlag);
        })
        .catch((e) => {
          debugger;
          console.log("FAIL!!!");
        });
    }
    else {
      //make a post request with the user data
        
        
      axios
        .post("http://localhost:5000/restaurant/restaurantLogin", data)
        .then((response) => {
          console.log("Status Code : ", response.status);
          console.log(response.data);
          if (response.status === 200) {
            console.log("login r_id:", response.data.RestaurantID);
             localStorage.setItem("r_id", response.data.RestaurantID);
            // localStorage.setItem("persona", this.state.persona);
            localStorage.setItem('restaurantEmail', this.state.username);
            localStorage.setItem('persona', this.state.persona);
            this.setState({
              authFlag: true,
              idStatus: ( 
                <Redirect to="/restaurantProfile"></Redirect>
              )
            });
            this.props.setPersona(this.state.persona);
            this.props.setUsername(this.state.username);
            console.log(" props for redux", this.state.username)
            this.props.setAuthFlag(true);
            //window.location.reload();


          } else {
            this.setState({
              authFlag: false,
            });
            this.setState({
              idStatus: (
                <p>
                  Your login credentials could not be verified, please try again.
                </p>
              ),
            });
          }
          console.log("success" + this.state.authFlag);
        })
        .catch((e) => {
          debugger;
          console.log("FAIL!!!");
        });

    }
  };
    render() { 
        return (   
            <div>
            <div className="container" style={{textAlign: "center"}}>
              {this.state.idStatus}
                    <div className="shadow" style={{display: "inline-block"}}>
                        <form onSubmit={this.submitLogin}>
                            <div className="container">
                                <h2>Login</h2>
                            </div>
                            <br></br>
                            <div className="container">
                                <small>Login as:</small><br></br>
                                <div className="form-check form-check-inline" name="options" onChange={this.personaChangeHandler}>
                                    <label>
                                    <input type="radio" name="radioBtn" className='btn btn-outline-primary' value={"Customer"}></input>
                                        Customer
                                    </label>
                                </div>
                                <div className="form-check form-check-inline" name="options" onChange={this.personaChangeHandler}>
                                    <label>
                                    <input type="radio" name="radioBtn"   className='btn btn-outline-primary' value={"Restaurant"}></input>
                                        Restaurant
                                    </label>
                                </div>
                            </div>
                            <br></br>
                            <div className="main-div">
                                <div className="panel">
                                    <div className="form-group">
                                    <label htmlFor="emailInput">Username</label>
                                        <div>
                                        <input type='email' className="border p-2 w-full" placeholder='Enter username' name='username' onChange={this.usernameChangeHandler} required></input>
                                        </div>
                                    </div>
                                    <br></br>
                                    <div className="form-group">
                                        <label htmlFor="fpasswordInput">Password</label>
                                        <div> 
                                        <input type='password' className="border p-2 w-full" placeholder='Enter password' name='password' onChange={this.passwordChangeHandler} required></input>
                                        </div>
                                    </div>
                                    <br></br>
                                    <Button type="submit" className='btn' variant="success">Login</Button>
                                </div>
                            </div>
                            <br></br>
                            <div>
                                <small>
                                    <p className="text-muted m-2">
                        New User?
                        <div>
                        <Link to="/signup" className="btn btn-outline-success">Sign Up</Link>
                        </div>
                                    </p>  
                                </small>
                            </div>
                    
                        </form>
                    </div>
                </div>
           </div>
        )
    }
} 
const mapDispatchToProps = { setUsername, setAuthFlag, setPersona, setCustomerID };

//export Login Component
export default connect(null, mapDispatchToProps)(Login);
