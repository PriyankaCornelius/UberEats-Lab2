//import the require dependencies
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cors = require('cors');
var kafka = require('./kafka/client');
//use cors to allow cross origin resource sharing
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(bodyParser.json());
const jwt = require('jsonwebtoken');
const { secret } = require('./kafka/Utils/config');
//const Users = require('../Models/UserModel');
const { auth } = require("./kafka/Utils/passport");
const { checkAuth } = require("./kafka/Utils/passport");
// let Customer = require('../models/customer.model');

//Allow Access Control
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
    res.setHeader('Cache-Control', 'no-cache');
    next();
  });

  var options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // poolSize: 500,
    // bufferMaxEntries'/: 0
  };
  
const { mongoDB } = require('./kafka/Utils/config');
const mongoose = require('mongoose');
mongoose.connect(mongoDB, options, (err, res) => {
    if (err) {
      console.log(err);
      console.log(`MongoDB Connection Failed`);
    } else {
      console.log(`MongoDB Connected`);
    }
  });

//Route to get All Books when user visits the Home Page
/*app.get('/books', function(req,res){   
    res.writeHead(200,{
        'Content-Type' : 'application/json'
    });
    res.end(JSON.stringify(books));
    
});
*/

const customerRouter = require('./routes/customer');
const restaurantRouter = require('./routes/restaurant');
app.use('/customer', customerRouter);
app.use('/restaurant', restaurantRouter);

  
app.post('/book', function(req, res){

    kafka.make_request('post_book',req.body, function(err,results){
        console.log('in result');
        console.log(results);
        if (err){
            console.log("Inside err");
            res.json({
                status:"error",
                msg:"System Error, Try Again."
            })
        }else{
            console.log("Inside else");
                res.json({
                    updatedList:results
                });

                res.end();
            }
        
    });
});
//start your server on port 5000
app.listen(5000);
console.log("Server Listening on port 5000");