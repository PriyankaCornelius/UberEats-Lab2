import axios from 'axios';
import React, { Component } from 'react';
import { Card } from 'react-bootstrap';
import { Row, Col } from 'react-bootstrap';
import { Container } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
class RestaurantList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            
        }
    }

    favouriteHandler = e => {
        console.log("ee ee ee", e.Email);
        e['favSelected'] = !(e['favSelected'])
        console.log("favSelected",e['favSelected'] );
        const data = {
            CustomerID: localStorage.getItem("c_id"),
            restaurantEmail: e.Email,
            favSelected: e['favSelected']
        }
        axios.post("http://localhost:5000/customer/updateFavouriteRestaurants",data).then((response) => {
            console.log("response status: ", response.status);
            window.location.reload(true);
        })
    }
    render() {
        
        return <div>
            <Container>
            <Row>
                    {this.props.data !== null ? this.props.data.map((d) => {
                        d['favSelected'] = false;
                        d['fav']=(
                            <img src="https://www.shareicon.net/data/128x128/2016/05/17/766544_button_512x512.png" title="Removed from favourites" style={{ width: 30, height: 25 }}>
                            </img>)
                        if (this.props.favourites.includes(d.Email)) {
                            d['fav']=(
                                <img src="https://image.emojipng.com/29/13592029.jpg" title="Added to Favourites" style={{ width: 30, height: 20 }}>
                                </img>)
                            d['favSelected'] = true;
                        }
                    
                        return (
                            
                            <Col xs="3">
                            <Card style={{ width: '15rem' }}>
                                    <Card.Header as="h5">
                                    <Row>
                                        <Col>
                                            {d.Name}
                                        </Col>
                                        <Col>
                                            <Button variant="outline-light" onClick={this.favouriteHandler.bind(this, d)}>
                                                    {this.props.fav || d.fav}
                                            </Button>
                                        </Col>
                                    </Row>
                                    </Card.Header>
                                <Card.Img variant="top" src={d.image} />
                                <Card.Body>
                                    <Card.Title>{d.Description}</Card.Title>
                                    <Card.Text>
                                        Location : {d.Location}
                                    </Card.Text>
                                    <Card.Text>
                                        Cuisine : {d.Cuisine}
                                    </Card.Text>
                                    <Card.Text>
                                        Delivery Mode : {d.DeliveryMode}
                                        </Card.Text>
                                    <Card.Text>
                                        Dietary : {d.Dietary}
                                    </Card.Text>
                                    <Card.Text>
                                        timings : {d.Timings}
                                    </Card.Text>
                                    <Card.Text>
                                        email : {d.Email}
                                    </Card.Text>
                                    <Card.Text>
                                        phoneNo : {d.PhoneNum}
                                    </Card.Text>
                                </Card.Body>
                                <Card.Footer>
                                        <Button variant="success" onClick={() => this.props.visitHandler({d})}>Visit</Button>
                                        {this.props.redirectToRestaurantProfile}
                                </Card.Footer>
                            </Card>
                            </Col>
                            
                        )
                    }) : "No results"}
                    </Row>
                    </Container>
        </div>;
    }
}
 
export default RestaurantList;