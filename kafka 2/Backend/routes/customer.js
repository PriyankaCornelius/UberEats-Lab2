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
  console.log("Inside SignUp Request");
  console.log("Req Body : ", req.body);
  var email = req.body.email;
  var name = req.body.name;
  
  async function hashPassword(password) {
    // const salt = await bcrypt.genSalt(10);
    // const hash = await bcrypt.hash(password, salt);
    console.log("hash:", hash);
    return hash;
  }

  hashPassword(req.body.password).then((customerPassword) => {
    console.log("after Hash:", customerPassword);
    var CustomerProfile = new Customer({
      Name: name,
      Email: email,
      Password: customerPassword
    });

    Customer.findOne({ Email: email }, (error, profile) => {
      if (error) {
        res.writeHead(205, {
          "Content-Type": "text/plain",
        });
        res.end();
      }
      if (profile) {
        res.writeHead(205, {
          'Content-Type': 'text/plain'
        })
        res.end("Customer Email ID already exists");
      }
      else {
        CustomerProfile.save((error, data) => {
          if (error) {
            res.writeHead(500, {
              'Content-Type': 'text/plain'
            })
            res.end();
          }
          else {
            console.log("Customer Profile Created with id:", data.id);
            resjson = {
              CustomerID: data.id.toString(),
            };
            res.status(200).send(resjson);
          }
        });
      }
    });
  });

});

//get customer profile
router.route("/getCustomerProfile").get( (req, res)=> {
  console.log(req.query.CustomerID);
  var CustomerID = req.query.CustomerID;
  console.log("CustomerID is" ,CustomerID);
  
  Customer.findById(CustomerID, (err, result) =>{
    if (err) {
          console.log('SQL Error:', err);
              res.writeHead(205, {
                "Content-Type": "text/plain",
              });
              res.end("Fetch data failed");
    }
    else {
      console.log(result);
      // var key = result.ProfilePicPath;
      // const readStream = getFileStream(key);

      let resjson = {
              name: result.Name,
              birthdate: result.DOB,
              address:result.Address,
              location: result.Location,
              city: result.City,
              State: result.State,
              country: result.Country,
              ProfilePicPath: result.ProfilePicPath
            };
      console.log(resjson);
      res.status(200).send(resjson);
    }
  });
})

//update customer Profile
router.route("/updateCustomerProfile").post( (req, res) =>{
  console.log("Inside customer profile update page");
  console.log(req.body.CustomerID);
  var CustomerID = req.body.CustomerID;
  //var sql_update = "UPDATE customers SET name=? ,DOB=? ,address=?,location=?, city=? ,State=? ,country=? WHERE email=?";  var name = req.body.name;
  var name = req.body.name;
  var birthdate = req.body.birthdate;
  var location = req.body.location;
  var address=req.body.address;
  var city = req.body.city;
  var State = req.body.State;
  var country = req.body.country;
  //var sql_insert = "INSERT INTO address (customerEmail,address) values (?,?)";

  Customer.findByIdAndUpdate(CustomerID, {Name: name, DOB: birthdate, Address: address, Location: location, City: city, State: State, Country: country },{$upsert:true}, (err, result) => {
    if(err) {
      console.log('SQL Error:', err);
      res.writeHead(205, {
        "Content-Type": "text/plain",
      });
      res.end("Update customer profile failed mongo ERROR");
    }
    else {
      console.log("Update successfull!");
      console.log("result: ",result);
            res.writeHead(200, {
              "Content-Type": "text/plain",
            });
            res.end("Update Successful");
          }
  });
});

//Route to get customer location
router.route("/getCustomerLocation").get((req, res) =>{
  console.log("Inside get-Customer-Location for customer dashboard section");
  //var idRestaurants = req.query.idRestaurants;
  var CustomerID = req.query.CustomerID;
  
  Customer.findOne( { CustomerID: CustomerID }, function (err, result) {
    if (err) {
      res.writeHead(205, {
        'Content-Type': 'text/plain'
      })
      res.end("Unsuccessful fetching customer location");
    }
    else {
      console.log("customer location: ",result.Location);
      res.status(200).send(result);
    }
  })
})

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
      console.log("favourite restaurants", result.favouriteRestaurants)
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
  //var date = new Date(dateStr);  // dateStr you get from mongodb

  var newOrder = {
    // _id: new ObjectID(),
    deliveryMode:req.body.deliveryMode,
    orderStatus:"Order Received",
    date: Date.now(),
    deliveryAddress: req.body.deliveryAddress,
    orderTotal: req.body.orderTotal,
    items:req.body.finalorder,
    RestaurantID: req.body.RestaurantID,
    instruction:req.body.instruction
  };

  Customer.findByIdAndUpdate(req.body.CustomerID, { $push:{customerOrders: newOrder} },{new: true}, (error, order) => {
    if (error) {
      res.writeHead(205, {
        "Content-Type": "text/plain",
      });
      console.log(error);
      res.end();
    }
    if (order) {
      // console.log("****Order Placed at customer***", order.customerOrders.at(-1).id);
      res.status(200).send(order);
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