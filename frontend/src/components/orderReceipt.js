import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';
import { Row, Col } from 'react-bootstrap';
import { Navbar } from 'react-bootstrap';
class OrderReceipt extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            seen:true
        }
    }

    handleClose = () => this.setState({ seen: false });
    handleShow = () => this.setState({ seen: true });

    render() {
        return <div>
           
            <Modal show={this.state.seen} onHide={this.handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title as="h4">Order receipt</Modal.Title>
                </Modal.Header>
                <Modal.Header>
                <Modal.Title as="h6">
                        Item
                </Modal.Title>
                <Modal.Title as="h6">
                        Quantity
                </Modal.Title>
                <Modal.Title as="h6">
                        Price
                </Modal.Title>
                </Modal.Header>


                {this.props.orderDetails.length !== 0 ? this.props.orderDetails.map((detail, index) => {
                    return (
                        <div>
                        <Modal.Body>
                            <Row>
                                <Col>
                                    {detail.dishName}
                                </Col>
                                <Col>
                                    {detail.qty}
                                </Col>
                                <Col>
                                    ${detail.price}
                                </Col>
                            </Row>
                        </Modal.Body>
                      </div>
                )
                }) : <p>error generating receipt</p>}

                <Modal.Footer>
                <Row>
                        <div>Total: ${this.props.order.orderTotal}</div>
                        <div>Date:{this.props.order.date}</div>
                        <div>Address: {this.props.order.deliveryAddress}</div>
                        <div>Special instructions: {this.props.order.instruction ||"none"}</div>
                </Row>
                </Modal.Footer>
            </Modal>
                
        </div>;
    }
}
 
export default OrderReceipt;