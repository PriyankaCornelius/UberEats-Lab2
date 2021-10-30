import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import { Modal } from 'react-bootstrap';
import { Row, Col } from 'react-bootstrap';
import { Navbar } from 'react-bootstrap';
import { Container } from 'react-bootstrap';
import Logout from './logout';
class Cart extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            seen: false
        }
    }
    handleClose = () => this.setState({ seen: false });
    handleShow = () => this.setState({ seen: true });

    render() {
        
        return <div>
            
            <div>
            <Navbar bg="light" expand="lg">
                <Container>
                        <Navbar.Brand>
                            <Row>
                            <Col>
                            <Button variant="outline-success" onClick={this.handleShow}>
                            View Cart
                            </Button>
                            {/* <input type="text" placeholder={this.props.cartCount}></input> */}
                            <Button style={{ backgroundColor: "green", color:"white"}} >{this.props.cartCount}</Button>
                            </Col>
                            <Col><Logout></Logout></Col>
                            </Row>
                        </Navbar.Brand>
                </Container>
            </Navbar>   
            <>
            {/* <Button variant="primary" onClick={this.handleShow}>
                View Cart
            </Button> */}
      
            <Modal show={this.state.seen} onHide={this.handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title as="h3">Cart</Modal.Title>
                </Modal.Header>
                <Modal.Header>
                <Modal.Title as="h6">
                        Dish
                </Modal.Title>
                <Modal.Title as="h6">
                        Price
                </Modal.Title>
                <Modal.Title as="h6">
                        Quantity
                </Modal.Title>
                <Modal.Title>
                </Modal.Title>
                </Modal.Header>
                <div>
                    {this.props.cart.length !== 0 ? this.props.cart.map((item, index) => {
                        return (
                            <div>
                            <Modal.Body>
                                <Row>
                                    <Col>
                                        {item.dishName}
                                    </Col>
                                    <Col>
                                        ${item.price}
                                    </Col>
                                    <Col>
                                        {item.qty}
                                        <Button className="btn btn-light" value={index} onClick={()=>this.props.qtyIncrementHandler({index})}>+</Button>
                                        <Button className="btn btn-light" value={index} onClick={()=>this.props.qtyDecrementHandler({index})}>-</Button>
                                        {/* <Button variant="outline-danger" value={index} onClick={()=>this.props.qtyDecrementHandler({index})}>remove</Button> */}
                                    </Col>
                                    <Col>
                                        <Button variant="outline-danger" value={index} onClick={()=>this.props.removeItemHandler({index})}>remove</Button>
                                    </Col>
                                </Row>
                            </Modal.Body>
                          </div>
                    )
                    }): <Modal.Body>Your cart is empty</Modal.Body>}
                        </div>
                       
                <div>
                    {this.props.cart.length !== 0 ? 
                        <div>
                        <Modal.Footer>
                        <Button className="btn btn-dark" onClick={this.props.getTotalHandler}>
                          View Total
                        </Button>
                        <input placeholder={this.props.orderTotal || "order total"} readOnly></input>
                        </Modal.Footer>
                        <Modal.Footer>
                        <Button className="btn btn-dark" onClick={this.props.checkoutHandler}>
                          Checkout
                        </Button>
                      </Modal.Footer>
                      </div>
                         : <p></p>}
                </div>
              
              
            </Modal>
          </>
        </div>
      
        </div>
    }
}
 
export default Cart;
//<Button type="button" class="btn btn-light btn-block btn btn-outline-success" onClick={this.props.addDishHandler}>View Cart</Button>
