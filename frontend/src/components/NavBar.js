import React, { Component } from 'react';
import { Navbar } from 'react-bootstrap';
import { Container } from 'react-bootstrap';
class NavBar extends React.Component {
    render() { 
        return <div>
            <Navbar bg="light" expand="lg">
            <Container>
            <Navbar.Brand href="#home">
                <img src="https://www.ubereats.com/_static/8b969d35d373b512664b78f912f19abc.svg" alt="UberEats"></img>
            </Navbar.Brand>
            </Container>
            </Navbar>
        </div>;
    }
}
 
export default NavBar;