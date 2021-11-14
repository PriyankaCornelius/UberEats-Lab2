const router = require('express').Router();
// const bcrypt = require('bcryptjs');
var kafka = require('../kafka/client');
const multer = require('multer')
const upload = multer({ dest: 'uploads/' });
const jwt = require('jsonwebtoken');
const { secret } = require('../kafka/Utils/config');
//const Users = require('../Models/UserModel');
const { auth } = require("../kafka/Utils/passport");
const { checkAuth } = require("../kafka/Utils/passport");
let Customer = require('../kafka/Models/customer.model');
//var ObjectID = require('mongodb').ObjectID;

const { uploadFile, getFileStream } = require('../s3');

router.route('/').get((req, res) => {
  console.log("Inside /");
  Customer.find()
      .then(customer => { res.json(customer); console.log("hey")})
    .catch(err => res.status(400).json('Error: ' + err));
});

// router.route('/customerLogin').get((req, res) => {
//   console.log("Inside get Login Request");
//   console.log("Req Body : ", req.query.email);
// })

router.post('/images', upload.single('image'), async (req, res) => {
  console.log("Inside upload customer profile photo");
  const file = req.file;
  console.log("image is", file);
  const result = await uploadFile(file);
  console.log("upload result", result);
  var CustomerID = req.body.CustomerID;
  console.log("customer id for file upload, ", CustomerID);
  Customer.findByIdAndUpdate(CustomerID, { ProfilePicPath: `http://localhost:5000/customer/images/${result.Key}` },{$upsert:true}, (error, profile) => {
    if (error) {
      res.writeHead(205, {
        "Content-Type": "text/plain",
      });
      res.end();
    }
    if (profile) {
      
      res.status(200).send(`http://localhost:5000/customer/images/${result.Key}`);
      return;
    }
    // res.send(`http://localhost:5000/customer/images/${result.Key}`)
  })
})

router.get('/images/:key', (req, res) => {
  console.log("requuuuueeeesssttttt.paraaammmss",req.params)
  const key = req.params.key
  const readStream = getFileStream(key)

  readStream.pipe(res)
})


//Route to handle Post Request Call for Customer Login
router.route('/customerLogin').post((req, res) =>{
  console.log("Inside Login Post Request");
  kafka.make_request('customerLoginNew', req.body, function (err, results) {
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
        const token = jwt.sign(payload, secret, {
            expiresIn: 1008000
        });
        console.log("JWT TOKEN CREATED : ", token);
        console.log("%%%%%%%%4444:",results.data.CustomerID);
        resjson = {
          CustomerID: results.data.CustomerID
        };
        if (results.status === 200) {
            res.status(200).end("JWT " + token);
            //res.status(results.status).send(results.data);
        } else {
            res.status(results.status).send(resjson);
        }
    }

});


});

//Route to handle Post Request Call for Customer SignUp
router.route('/customerSignUp').post((req, res) =>{
  console.log("Inside customer SignUp Request");
    console.log("Req Body : ", req.body);
    kafka.make_request('customerSignup', req.body, function (err, results) {
        console.log(results);
        if (err) {
            console.log("Inside err customer SignUp");
            res.writeHead(205, {
                "Content-Type": "text/plain",
            });
            res.end("Unsuccessful Signup");
        } else {
          
            console.log("Inside else customer SignUp");
            res.status(results.status).send(results.message);
        }
    });
});

//get customer profile
router.route("/getCustomerProfile").get( (req, res)=> {
  console.log("Inside Customer profile section");
    kafka.make_request('getCustomerProfile', req.query, function (err, results) {
        console.log(results);
        if (err) {
            console.log("Inside err Customer Profile get");
            res.writeHead(205, {
                "Content-Type": "text/plain",
            });
            res.end("Unsuccessful Profile get");
        } else {
          console.log("Inside result Customer Profile get");
          console.log("result customer profile!", results.data);
            if (results.status === 200) {
                res.status(results.status).send(results.data);
            } else {
                res.status(results.status).send(results.message);
                console.log("Customer Profile Success");
            }
        }
    });
});

//update customer Profile
router.route("/updateCustomerProfile").post( (req, res) =>{
  console.log("Inside Update customer profile section");
    console.log(req.body);
    kafka.make_request('updateCustomerProfile', req.body, function (err, results) {
        console.log(results);
        if (err) {
            console.log("Inside err update CustomerProfile ");
            res.writeHead(205, {
                "Content-Type": "text/plain",
            });
            res.end("Unsuccessful Update Customer Profile");
        } else {
            console.log("Inside else update CustomerProfile ");
           
                res.status(results.status).send(results.message);
        }
    });
});


//Route to get customer location
router.route("/getCustomerLocation").get((req, res) =>{
  console.log("Inside get-Customer-Location for customer dashboard section");
  //var idRestaurants = req.query.idRestaurants;
  
  kafka.make_request('getCustomerLocation', req.query, function (err, results) {
    // console.log(results);
    if (err) {
        console.log("Inside err Customer Profile get");
        res.writeHead(205, {
            "Content-Type": "text/plain",
        });
        res.end("Unsuccessful Profile get");
    } else {
      console.log("Inside result Customer location get");
      console.log("location customer @@@@@@@", results.data);
        if (results.status === 200) {
            res.status(results.status).send(results.data);
        } else {
            res.status(results.status).send(results.message);
            console.log("Customer Profile Success");
        }
    }
});
});

//Route to get customer's favourite restaurants
router.route("/getFavouriteRestaurants").get((req, res)=> {
  console.log("Inside get customer's favourite restaurants");
  console.log("customer id",req.query.CustomerID)
  Customer.findById(req.query.CustomerID, (err, result) =>{
    if (err) {
      console.log('SQL Error:', err);
      res.status(205).send("Unsuccessful To update details");
    }
    else {
      console.log("favourite restaurants", result.data)
      res.status(200).send(result);
    }
  });

});

//Route to update customer's favourite restaurants
router.route("/updateFavouriteRestaurants").post( (req, res)=> {
  console.log("Inside update customer's favourite restaurants");
  console.log(req.body.CustomerID, req.body.restaurantEmail)
  if (req.body.favSelected === true) {
    
    Customer.findByIdAndUpdate(req.body.CustomerID, { $push: { favouriteRestaurants: req.body.restaurantEmail } }, (error, profile) => {
      if (error) {
        res.writeHead(205, {
          "Content-Type": "text/plain",
        });
        res.end("Unsuccessful To add restaurant to favourites");
      }
      if (profile) {
        res.status(200);
        res.end();
      }

    });
  }
  else if (req.body.favSelected === false) {
    Customer.findByIdAndUpdate(req.body.CustomerID, { $pull: { favouriteRestaurants: req.body.restaurantEmail } }, (error, profile) => {
      if (error) {
        res.writeHead(205, {
          "Content-Type": "text/plain",
        });
        res.end("Unsuccessful To delete restaurant from favourites");
      }
      if (profile) {
        res.status(200);
        res.end();
      }

    });
  }

});

//Route to place order by customer 
router.route("/submitOrder").post((req, res)=> {
  console.log("Inside place order by customer section", req.body.finalorder);
  kafka.make_request('placeOrder', req.body, function (err, results) {
    console.log("results",results);
    if (err) {
        console.log("Inside err customer SignUp");
        res.writeHead(205, {
            "Content-Type": "text/plain",
        });
        res.end("Unsuccessful Signup");
    } else {
      if (results.status === 200) {
        console.log("order placed");
        res.status(results.status).send(results.data);
      } else {
        console.log("order placed Success but diffrent status", results.status);
        res.status(results.status).send(results.message);
    }
    }
});
});

//Route to list of orders by restaurants for a customer
router.route("/getCustomerOrders").get((req, res) =>{
  console.log("Inside Customers orders section");
  var CustomerID = req.query.CustomerID;
  console.log(CustomerID);
  //var sql = "SELECT * FROM orders WHERE customerEmail = ? order by restaurantEmail";
  Customer.findById(CustomerID, (err, result) =>{
    if (err) {
      res.writeHead(205, {
        "Content-Type": "text/plain",
      });
      console.log(error);
      res.end("Unsucessfull fetching customer orders");
    }
    else {
      console.log("customer orders retrieved successfully");
      res.status(200).send(result);
    }
  });
});

//Route to update order status through restaurant
router.route("/updateOrderStatus").post( (req, res) => {
  console.log("Inside Update Order Status");
  console.log(req.body.orderStatus, req.body.orderID,'custid', req.body.CustomerID)
  var orderID = req.body.orderID;
  //var sql = "UPDATE orders SET orderStatus= ? WHERE orderID = ? ";
  Customer.updateOne({_id:req.body.CustomerID,"customerOrders._id":orderID}, { $set:{"customerOrders.$.orderStatus":req.body.orderStatus} }, { useFindAndModify:false  }, (error, order) => {
    if (error) {
      console.log('SQL Error:', err);
      res.status(205).send("Unsuccessful To update details");
    }
    else {
      console.log("customer orderstatus updated", order);
      res.status(200).send("Order Status UPDATED on customer's end");
    }
  });

});

// router.route('/add').post((req, res) => {
//   const username = req.body.username;

//   const newUser = new User({username});

//   newUser.save()
//     .then(() => res.json('User added!'))
//     .catch(err => res.status(400).json('Error: ' + err));
// });

module.exports = router;