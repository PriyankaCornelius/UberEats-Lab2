const Customers = require('../Models/customer.model');
const bcrypt = require('bcryptjs');

function handle_request(msg, callback){
    var res={};
    var email = msg.email;
    var name = msg.name;
    
    async function hashPassword(password) {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);
      console.log("hash:", hash);
      return hash;
    }
  
    hashPassword(msg.password).then((customerPassword) => {
      console.log("after Hash:", customerPassword);
      var CustomerProfile = new Customers({
        Name: name,
        Email: email,
        Password: customerPassword
      });
  
      Customers.findOne({ Email: email }, (error, profile) => {
        if (error) {
            res.status = 205;
            res.message = 'mongo error';
            callback(null, res);
        }
        if (profile) {
          res.status = 205;
          res.message = 'Customer Email ID already exists';
          callback(null, res);
        }
        else {
          CustomerProfile.save((error, data) => {
            if (error) {
                res.status = 205;
                res.message = 'Failed to save in DB';
              console.log("error mongo", error);
                callback(null, res);
            }
            else {
              console.log("Customer Profile Created");
              res.status = 200;
              res.message = "Customer Profile Created";
              callback(null, res);
            }
          });
        }
      });
    });


};

exports.handle_request = handle_request;