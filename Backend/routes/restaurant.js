const router = require('express').Router();
const bcrypt = require('bcryptjs');
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })
let Restaurant = require('../models/restaurant.model');

const { uploadFile, getFileStream } = require('../s3');

router.route('/').get((req, res) => {
  console.log("Inside /");
  Restaurant.find()
      .then(restaurant => { res.json(restaurant); console.log("hey")})
    .catch(err => res.status(400).json('Error: ' + err));
});


router.post('/images', upload.single('image'), async (req, res) => {
  console.log("Inside upload Restaurant profile photo");
  const file = req.file;
  console.log("image is", file);
  const result = await uploadFile(file);
  console.log("upload result", result);
  var RestaurantID = req.body.RestaurantID;
  console.log("Restaurant id for file upload, ", RestaurantID);
  Restaurant.findByIdAndUpdate(RestaurantID, { ProfilePicPath: `http://localhost:5000/restaurant/images/${result.Key}` },{$upsert:true}, (error, profile) => {
    if (error) {
      res.writeHead(205, {
        "Content-Type": "text/plain",
      });
      res.end();
    }
    if (profile) {
      res.status(200).send(`http://localhost:5000/restaurant/images/${result.Key}`);
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

// router.post('/dishImages', upload.single('image'), async (req, res) => {
//   console.log("Inside upload Restaurant profile photo");
//   const file = req.file;
//   console.log("image is", file);
//   const result = await uploadFile(file);
//   console.log("upload result", result);
//   var RestaurantID = req.body.RestaurantID;
//   console.log("Restaurant id for file upload, ", RestaurantID);
//   Restaurant.findByIdAndUpdate(RestaurantID, { ProfilePicPath: `http://localhost:5000/restaurant/images/${result.Key}` },{$upsert:true}, (error, profile) => {
//     if (error) {
//       res.writeHead(205, {
//         "Content-Type": "text/plain",
//       });
//       res.end();
//     }
//     if (profile) {
//       res.status(200).send(`http://localhost:5000/restaurant/images/${result.Key}`);
//       return;
//     }
//     // res.send(`http://localhost:5000/customer/images/${result.Key}`)
//   })
// })

// router.route('/restaurantLogin').get((req, res) => {
//   console.log("Inside get Login Request");
//   console.log("Req Body : ", req.query.email);
// })

//Route to handle Post Request Call for Restaurant Login
router.route('/restaurantLogin').post((req, res) =>{
  console.log("Inside Login Post Request");
  
  console.log("Req Body : ", req.body);
  var email = req.body.email;
                      // *****var sql = "SELECT * FROM restaurants WHERE email = ?";
                      // *******con.query(sql, [email], async function (err, result) {
    Restaurant.findOne({ Email: email }, async function (err, result) {
      if (err) {
        console.log('Mongo Error:', err);
        res.status(205).json('Error: ' + err);
      }
      console.log(result);
      if (result) {
        const isSame = await bcrypt.compare(req.body.password, result.Password);
        console.log(isSame);
        if (isSame === true) {
          console.log("login successfull!");
          resjson = {
            RestaurantID: result._id.toString(),
            password: result.Password,
          };
          res.status = 200;
          res.json(resjson);
        }
        else {
          console.log('Error1:', err);
          //'unable to login error1';
          res.status(205).json('Error1: ' + err);
      }
    }
      else {
        console.log('Error2:', err);
        //'unable to login error2';
        res.status(205).json('Error2: ' + err);
      }
    });
    console.log("logged in");
});

//Route to handle Post Request Call for Restaurant SignUp
router.route('/restaurantSignUp').post((req, res) =>{
  console.log("Inside SignUp Request");
  console.log("Req Body : ", req.body);
  var email = req.body.email;
  var name = req.body.name;
  var location = req.body.location;
  async function hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    console.log("hash:", hash);
    return hash;
  }

  hashPassword(req.body.password).then((restaurantPassword) => {
    console.log("after Hash:", restaurantPassword);
    var RestaurantProfile = new Restaurant({
      Name: name,
      Email: email,
      Password: restaurantPassword,
      Location: location
    });

    Restaurant.findOne({ Email: email }, (error, profile) => {
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
        res.end("Restaurant Email ID already exists");
      }
      else {
        RestaurantProfile.save((error, data) => {
          if (error) {
            res.writeHead(500, {
              'Content-Type': 'text/plain'
            })
            res.end();
          }
          else {
            // res.writeHead(200, {
            //   'Content-Type': 'text/plain'
            // })
            console.log("Restaurant Profile Created with id:", data.id);
            resjson = {
                RestaurantID: data.id.toString(),
              };
            //   res.json(data);
            //   res.end();
            res.status(200).send(resjson);
          }
        });
      }
    });
  });

});

//get restaurant profile
router.route("/getRestaurantProfile").get( (req, res)=> {
  console.log(req.query.RestaurantID);
  var RestaurantID = req.query.RestaurantID;
  console.log("RestaurantID is" ,RestaurantID);
  
  Restaurant.findById(RestaurantID, (err, result)=> {
    if (err) {
          console.log('SQL Error:', err);
              res.writeHead(205, {
                "Content-Type": "text/plain",
              });
              res.end("Fetch data failed");
    }
    else {
      console.log(result);
      let resjson = {
              name: result.Name,
              email: result.Email,
              location: result.Location,
              cuisine: result.Cuisine,
              deliveryMode: result.DeliveryMode,
              dietary:result.Dietary,
              description: result.Description,
              phoneNo: result.PhoneNum,
              address: result.Address,
              timings: result.Timings,
              ProfilePicPath: result.ProfilePicPath
            };
      console.log(resjson);
      res.status(200).send(resjson);
    }
  });
  })

//update restaurant Profile
router.route("/updateRestaurantProfile").post((req, res)=> {
  console.log("Inside restaurant profile update page");
  console.log(req.body.RestaurantID);
  var RestaurantID = req.body.RestaurantID;
  var name = req.body.name;
  var email = req.body.email;
  var location = req.body.location;
  var description = req.body.description;
  var deliveryMode = req.body.deliveryMode;
  var dietary=req.body.dietary;
  var phoneNo = req.body.phoneNo;
  var address = req.body.address;
  var timings = req.body.timings;
  var cuisine = req.body.cuisine;

  Restaurant.findByIdAndUpdate(RestaurantID, { Name: name, Email:email, Location:location, DeliveryMode:deliveryMode, Description:description, PhoneNum:phoneNo, Address:address, Timings:timings, Cuisine:cuisine, Dietary:dietary },{$upsert:true}, (err, result)=> {
    if (err) {
      console.log('SQL Error:', err);
      res.writeHead(205, {
        "Content-Type": "text/plain",
      });
      res.end("SignUp failed SQL ERROR");
    }
    else {
      console.log("Update successfull!!!!");
      console.log(result);
            res.writeHead(200, {
              "Content-Type": "text/plain",
            });
            res.end("Update Successful");
          }
  });
});

//route to fetch list of restaurants on customer dashboard
router.route("/getRestaurants").get((req, res) =>{
    console.log("Inside get-Restaurant-list for customer dashboard section");
    
    Restaurant.find( (err, result) => {
            if (err) {
              console.log('SQL Error:', err);
              res.writeHead(205, {
                "Content-Type": "text/plain",
              });
                res.send("Unsuccessful fetching restaurants list");
                res.end();
            }
            else {
              let resjson = {};
              console.log("complete list of restaurants:  ***********", result);
              resjson['allLocationRestaurants']=result;
              res.status(200).send(resjson);
            }
          });
});
  
//Route to list of orders by customers for a restaurant
router.route("/getRestaurantDishes").get( (req, res) =>{
  console.log("Inside get Restaurant dishes section");
  var RestaurantID = req.query.RestaurantID;
  console.log("r-id",RestaurantID);
  Restaurant.findById(RestaurantID, (err, result)=> {
    if (err) {
      console.log('SQL Error:', err);
      res.status(400).send("Unsuccessful To orders list");
    }
    else {
      console.log("dishes result:  ***********", result.Dishes);
      res.status(200).send(result);
    }
  });
});



//Route to create a new Dish for a restaurant
router.post("/restaurantAddNewDish",upload.single("image"),async (req, res) =>{
  console.log("Inside Add new Dish Request");
  // console.log("Req Body : ", req.body);
  const file = req.file;
  const result = await uploadFile(file);
  var RestaurantID = req.body.RestaurantID;
  var idDishes = req.body.idDishes;
  var dishName = req.body.dishName;
  var price = req.body.price;
  var category = req.body.category;
  // var image = req.body.image;
  var description = req.body.description;
  var ingredients = req.body.ingredients;
  Restaurant.findByIdAndUpdate(RestaurantID, { $push: { 
  
    Dishes: {
             "idDishes":idDishes,
             "dishName": dishName,
             "price": price,
             "description": description,
             "ingredients": ingredients,
             "image": `http://localhost:5000/restaurant/images/${result.Key}`,
             "category": category,
           } //inserted data is the object to be inserted 
  }} ,{$upsert:true},(error, profile) =>{
    if (error) {
      console.log('SQL Error:', err);
      res.writeHead(205, {
        "Content-Type": "text/plain",
      });
      res.end("failed to add new dish");
    }
    else {
      console.log("add new dish successfull!");
      res.status(200).send(`http://localhost:5000/restaurant/images/${result.Key}`);
         return;
    }
  });
});

//Update Menue Item By Customer
router.post("/restaurantEditNewDish",upload.single("image"),async (req, res) =>{
  console.log("Inside Update Dishes Edit section");
  
  const file = req.file;
  const result = await uploadFile(file);
  var RestaurantID = req.body.RestaurantID;
  var idDishes = req.body.idDishes;

  console.log("Inside Update Dishes Edit section", idDishes);
  //console.log("req.body", req.body);
  var newDishDetails = {
    dishName: req.body.dishName,
    price: req.body.price,
    description : req.body.description,
    ingredients : req.body.ingredients,
    image : `http://localhost:5000/restaurant/images/${result.Key}`,
    category : req.body.category
  };
 
  Restaurant.findById(RestaurantID, (err, profile) => {
    if (err) {
      res.writeHead(205, {
        "Content-Type": "text/plain",
      });
      console.log(err);

      res.end();
    }
    else {
      //console.log("profile", profile);
      var newDish = profile.Dishes;
      newDish.splice(idDishes, 1, newDishDetails)
    
      Restaurant.findByIdAndUpdate(RestaurantID, { Dishes: newDish }, (error, dish) => {
        if (error) {
          res.writeHead(205, {
            "Content-Type": "text/plain",
          });
          console.log(error);
          
          res.end();
        }
        if (dish) {
          res.writeHead(200, {
            'Content-Type': 'text/plain'
          })
          console.log("Dish Edited");
          //console.log("*************dish", dish);
          res.end("Dish Edited");
        }
      })
    }
  })
});

//Route to place order by customer 
router.route("/submitOrder").post((req, res)=> {
  console.log("Inside place order by customer  section", req.body.finalorder);
  //var date = new Date(dateStr);  // dateStr you get from mongodb

  var newOrder = {
    _id: req.body._id,
    deliveryMode:req.body.deliveryMode,
    orderStatus:"Order Received",
    date: Date.now(),
    deliveryAddress: req.body.deliveryAddress,
    orderTotal: req.body.orderTotal,
    items:req.body.finalorder,
    CustomerID: req.body.CustomerID,
    customerEmail: req.body.customerEmail
  };

  Restaurant.findByIdAndUpdate(req.body.RestaurantID, { $push:{restaurantOrders: newOrder} }, { useFindAndModify: false }, (error, order) => {
    if (error) {
      res.writeHead(205, {
        "Content-Type": "text/plain",
      });
      console.log(error);
      res.end();
    }
    if (order) {
      res.writeHead(200, {
        'Content-Type': 'text/plain'
      })
      console.log("order placed at restaurant's end");
      //console.log("*************order", order);
      res.end("order placed at restaurant's end");
    }
  });

});

//Route to list of orders by customer at a Restaurant
router.route("/getRestaurantOrders").get( (req, res)=> {
  console.log("Inside Restaurant orders section");
  var RestaurantID = req.query.RestaurantID;
  console.log(RestaurantID);
  //var sql = "SELECT * FROM orders WHERE RestaurantID = ? order by customerEmail";
  Restaurant.findById(RestaurantID, (err, result) =>{
    if (err) {
      console.log('SQL Error:', err);
      res.status(205).send("Unsuccessful To orders list");
    }
    else {
      res.status(200).send(result);
    }
  })
});

//Route to update order status through restaurant
router.route("/updateOrderStatus").post( (req, res) => {
  console.log("Inside Update Order Status");
  console.log(req.body.orderStatus, req.body.orderID)
  var orderID = req.body.orderID;
  //var sql = "UPDATE orders SET orderStatus= ? WHERE orderID = ? ";
  Restaurant.updateOne({_id:req.body.RestaurantID,"restaurantOrders._id":orderID}, { $set:{"restaurantOrders.$.orderStatus":req.body.orderStatus} }, { useFindAndModify:false  }, (error, order) => {
    if (error) {
      console.log('SQL Error:', err);
      res.status(205).send("Unsuccessful To update details");
    }
    else {
      console.log("restaurant orderstatus updated", order);
      res.status(200).send("Order Status UPDATED");
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