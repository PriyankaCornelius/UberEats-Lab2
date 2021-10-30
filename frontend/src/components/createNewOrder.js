import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import { Modal } from 'react-bootstrap';
import { Row, Col } from 'react-bootstrap';
import { Navbar } from 'react-bootstrap';
import { Container } from 'react-bootstrap';
import Logout from './logout';
class CreateNewOrder extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            seen: true
        }
    }
    handleClose = () => { this.setState({ seen: false }); window.location.reload()}
    handleShow = () => this.setState({ seen: true });
    newOrderHandler = e => {
        e.preventDefault();
        localStorage.removeItem('cart');
        localStorage.setItem("cart_restaurant",this.props.currentRestaurantID)
    }
    render() {
        // console.log("current rrestaurant id",this.props.currentRestaurantID)
        return <div>
            <Modal show={this.state.seen} onHide={this.handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title as="h3">Create New Order?</Modal.Title>
                </Modal.Header>
                

                <Modal.Body>
                    <Container>
                <div style={{textAlign: "center"}}>
                            
                    <Container>
                    Your order contains items from Restaurant_X. Create a new order to add items from Restaurant_Y?
                    </Container>
                    
                    <br></br>
                    
                    <Container>
                    <Button className="btn btn-dark" onClick={this.newOrderHandler}>New Order</Button>
                    </Container>
                    
                    </div>
                    </Container>
                </Modal.Body>
                </Modal>

        </div>;
    }
}
 
export default CreateNewOrder;