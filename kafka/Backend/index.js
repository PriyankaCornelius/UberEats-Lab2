//import the require dependencies

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cors = require('cors');
var kafka = require('./kafka/client');
var session = require("express-session");
var cookieParser = require("cookie-parser");
app.set("view engine", "ejs");
const bcrypt = require('bcryptjs');
const { response } = require("express");
module.exports = app;
//use cors to allow cross origin resource sharing
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(bodyParser.json());


// const jwt = require('jsonwebtoken');
// const { secret } = require('./kafka/Utils/config');
// //const Users = require('../Models/UserModel');
// const { auth } = require("./kafka/Utils/passport");
// const { checkAuth } = require("./kafka/Utils/passport");
// auth();
// var multer = require('multer');
// var upload = multer({dest:'../../Frontend/src/uploads'});

// const Customers = require('./kafka/Models/Customer');

//var upload = multer({ storage: storage });


//Allow Access Control
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
    res.setHeader('Cache-Control', 'no-cache');
    next();
});

//use express session to maintain session data
app.use(
    session({
        secret: "cmpe273_kafka_passport_mongo",
        resave: false, // Forces the session to be saved back to the session store, even if the session was never modified during the request
        saveUninitialized: false, // Force to save uninitialized session to db. A session is uninitialized when it is new but not modified.
        duration: 60 * 60 * 1000, // Overall duration of Session : 30 minutes : 1800 seconds
        activeDuration: 5 * 60 * 1000,
    })
);

var options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // poolSize: 500,
    // bufferMaxEntries: 0
  };
  
const { mongoDB } = require('./kafka/Utils/config');
// const uri = process.env.ATLAS_URI;
console.log("uriiii", mongoDB);
const mongoose = require('mongoose');
// const Messages = require("./kafka/Models/Message");


mongoose.connect(mongoDB, options, (err, res) => {
    if (err) {
      console.log(err);
      console.log(`MongoDB Connection Failed`);
    } else {
      console.log(`MongoDB Connected`);
    }
  });

// mongoose.connect(mongoDB, { useNewUrlParser: true }
//     );
    const connection = mongoose.connection;
    connection.once('open', () => {
      console.log("MongoDB database connection established successfully");
    })

//Route to get All Books when user visits the Home Page
/*app.get('/books', function(req,res){   
    res.writeHead(200,{
        'Content-Type' : 'application/json'
    });
    res.end(JSON.stringify(books));
    
});
*/


//Route to handle Post Request Call for Customer Login
app.post("/customerLogin", function (req, res) {
    console.log("Inside Login Post Request");
    kafka.make_request('customerLogin', req.body, function (err, results) {
        console.log('in customerLogin');
        console.log(results);
        if (err) {
            console.log("Inside err customerLogin");
            res.writeHead(205, {
                "Content-Type": "text/plain",
            });
            res.end("Unsuccessful Login");
        } else {
            console.log("Inside else customerLogin");
            const payload = { _id: results.data.CustomerID};
            // const token = jwt.sign(payload, secret, {
            //     expiresIn: 1008000
            // });
            var token = "hi";
            console.log("%%%%%%%%4444:",results.data.CustomerID);
            if (results.status === 200) {
                res.status(200).end("JWT " + token);
                res.status(200).end("JWT ");
                //res.status(results.status).send(results.data);
            } else {
                res.status(results.status).send(results.message);
            }
        }

    });


});

//start your server on port 3001
app.listen(5000);
console.log("Server Listening on port 5000");