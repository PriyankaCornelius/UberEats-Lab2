import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';

class Logout extends React.Component {
    state = {
        
    }
    logoutHandler = e => {
            e.preventDefault();
        localStorage.clear();
    }
    // logoutHandler = e => {
    //     e.preventDefault();
    //     console.log("LOGOUT")
    // }
    render() {
        
        return <div>
        <Button variant="outline-light" onClick={this.logoutHandler}><Link to="/login" className="btn btn-outline-success" >Logout</Link> </Button>
        </div>;
    }
}
 
export default Logout;