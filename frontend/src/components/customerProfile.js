// Display complete profile of a customer 
// (basic details, favourites, about, profile picture)
// 2.Upload profile picture
// 
//     country, nickname)
// 4.Update Contact Information(email id, phone number)
// 5.Thecountryshouldbeadropdownwiththelistofcountriestoselectfromandshouldnotbe entered manually
//     .Note:YourprofilepageneednotbethesameasUberEatsprofileastheyhavelittleinformation available.

import React, { Component } from 'react';
import { Row, Col } from 'react-bootstrap';
import { Form } from 'react-bootstrap';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router';
import { Navbar } from 'react-bootstrap';
import { Container } from 'react-bootstrap';
import Logout from './logout';
import axios from 'axios';
class CustomerProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            birthdate: "",
            address:"",
            location:"",
            city: "",
            State: "",
            country: "",
            file:""
        }
    }
    componentDidMount() {
        const data = {
            params: {
                CustomerID: localStorage.getItem("c_id")
            }
        };
        console.log("data",data);
        axios.get("http://localhost:5000/customer/getCustomerProfile", data)
            .then(response => {
                console.log("status is",response.status);
                if (response.status === 200) {
                    console.log(response.data);
                    this.setState({
                        name: response.data.name,
                        birthdate: response.data.birthdate,
                        address:response.data.address,
                        location: response.data.location,
                        city:response.data.city,
                        State:response.data.State,
                        country:response.data.country || "India"
                    });
                }
        });
    }
    countryChangeHandler = e => {
        e.preventDefault();
        this.setState({
            country:e.target.textContent
        })
    }
    nameChangeHandler = e => {
        this.setState({
            name:e.target.value
        })
    }
    birthdateChangeHandler = e => {
        this.setState({
            birthdate:e.target.value
        })
    }
    addressChangeHandler = e => {
        this.setState({
            address:e.target.value
        })
    }
    locationChangeHandler = e => {
        this.setState({
            location:e.target.value
        })
    }
    cityChangeHandler = e => {
        this.setState({
            city:e.target.value
        })
    }
    StateChangeHandler = e => {
        this.setState({
            State:e.target.value
        })
    }
    updateCustomerProfile = e => {
        //prevent page from refresh
        e.preventDefault();
        console.log("update customer profile api call");
        const data = {
            CustomerID: localStorage.getItem("c_id"),
            name: this.state.name,
            birthdate: this.state.birthdate,
            address:this.state.address,
            location: this.state.location,
            city: this.state.city,
            State: this.state.State,
            country: this.state.country
        };
        console.log("data :", data);
        axios
            .post("http://localhost:5000/customer/updateCustomerProfile", data)
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

    // async function postImage({image}) {
    //     const formData = new FormData();
    //     formData.append("image", image)
      
    //     const result = await axios.post('/images', formData, { headers: {'Content-Type': 'multipart/form-data'}})
    //     return result.data
    //   }
    fileSelected = e => {
        e.preventDefault();
        const file = e.target.files[0];
        this.setState({ file: file }, () => {
            console.log("fiiiillleee",this.state.file)
        });
    }

    // submit = async event => {
    //     event.preventDefault();
    //     const result = await postImage({image: this.state.file})
    //     this.setState({ result: result });
    //   }

    render() {
        let viewCustomerOrder = null;
        let updateProfileButton = null;
        if (localStorage.getItem("persona") === 'Customer') {
            updateProfileButton = <Button type="submit" className='btn' variant="success">Update</Button>
            viewCustomerOrder = <Link to="/CustomerOrders" className="btn btn-outline-success">View Orders</Link>;
        }
        return <div>
            <div className="container">
            <Navbar bg="light" expand="lg">
                <Container>
                        <Navbar.Brand>
                            <Row>
                                <Col>
                            <Link to="/Dashboard" className="btn btn-outline-success">Dashboard</Link>
                            </Col>
                            <Col>
                            {viewCustomerOrder}
                            </Col>
                            <Col>
                                <Logout></Logout>
                            </Col>
                        </Row>
                        </Navbar.Brand>
                </Container>
            </Navbar>

                <div className="customerProfile">
                    <Row>
                        <Col>
                        <form onSubmit={this.submit}>
                            <input onChange={this.fileSelected} type="file"></input>
                            {/* <img src="" alt="photo"></img> */}
                            {/* {this.state.file.map(image => (
                                <div key={image}> */}
                    <img src={require("../images/photo.jpg").default} height="200" width="200" alt=""></img>
                                {/* </div>
                            ))} */}
                                <button type="submit">Submit</button>
                            </form>
                        </Col>
                        <Col>
                            <div>
                                <Form onSubmit={this.updateCustomerProfile}>
                                
                            <Form.Group>
                                <Row>
                                    <Col>
                                        <Form.Label htmlFor="name" aria-readonly>Name:</Form.Label>
                                    </Col>
                                    <Col>
                                        <Form.Control type="text" id="name" className="text-center" placeholder="Name" aria-readonly value={this.state.name} onChange={this.nameChangeHandler}></Form.Control>
                                    </Col>
                                </Row>
                            </Form.Group>
                            <Form.Group>
                                <Row>
                                    <Col>
                                        <Form.Label htmlFor="birthdate" aria-readonly>Date of birth:</Form.Label>
                                    </Col>
                                    <Col>
                                        <Form.Control type="date" id="birthdate" className="text-center" placeholder="Date of birth" aria-readonly value={this.state.birthdate} onChange={this.birthdateChangeHandler}></Form.Control>
                                    </Col>
                                </Row>
                                </Form.Group>
                                <Form.Group>
                                <Row>
                                    <Col>
                                        <Form.Label htmlFor="address" aria-readonly>Address:</Form.Label>
                                    </Col>
                                    <Col>
                                        <Form.Control type="text" id="address" className="text-center" placeholder="Address" aria-readonly value={this.state.address} onChange={this.addressChangeHandler}></Form.Control>
                                    </Col>
                                </Row>
                            </Form.Group>
                            <Form.Group>
                                <Row>
                                    <Col>
                                        <Form.Label htmlFor="location" aria-readonly>Location:</Form.Label>
                                    </Col>
                                    <Col>
                                        <Form.Control type="text" id="location" className="text-center" placeholder="Location" aria-readonly value={this.state.location} onChange={this.locationChangeHandler}></Form.Control>
                                    </Col>
                                </Row>
                            </Form.Group>
                            <Form.Group>
                                <Row>
                                    <Col>
                                        <Form.Label htmlFor="city" aria-readonly>City:</Form.Label>
                                    </Col>
                                    <Col>
                                        <Form.Control type="text" id="city" className="text-center" placeholder="City" aria-readonly value={this.state.city} onChange={this.cityChangeHandler}></Form.Control>
                                    </Col>
                                </Row>
                            </Form.Group>
                            <Form.Group>
                                <Row>
                                    <Col>
                                        <Form.Label htmlFor="state" aria-readonly>State:</Form.Label>
                                    </Col>
                                    <Col>
                                        <Form.Control type="text" id="state" className="text-center" placeholder="State" aria-readonly value={this.state.State} onChange={this.StateChangeHandler}></Form.Control>
                                    </Col>
                                </Row>
                            </Form.Group> 
                            <Form.Group>
                                <Row>
                                    <Col>
                                        <Form.Label htmlFor="country" aria-readonly>Country:</Form.Label>
                                    </Col>
                                    <Col>
                                    <DropdownButton id="dropdown-basic-button" placeholder="Country" title={ this.state.country} value={this.state.country} variant="outline-dark">
                                    <Dropdown.Item as="button" variant="outline-dark"><div onClick={(e) => this.countryChangeHandler(e)}>US</div></Dropdown.Item>
                                    <Dropdown.Item as="button" variant="outline-dark"><div onClick={(e) => this.countryChangeHandler(e)}>India</div></Dropdown.Item>
                                    <Dropdown.Item as="button" variant="outline-dark"><div onClick={(e) => this.countryChangeHandler(e)}>Pakistan</div></Dropdown.Item>
                                    </DropdownButton>
                                    </Col>
                                </Row>
                            </Form.Group>    
                            {updateProfileButton}
                            </Form>
                            </div>
                        </Col>
                    </Row>
                </div>
                {/* <div>
                {viewCustomerOrder}
                </div> */}
            </div>
        </div>;
    }
}
 
export default CustomerProfile;