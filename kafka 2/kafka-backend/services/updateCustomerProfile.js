const Customers = require('../Models/customer.model');

function handle_request(msg, callback){
    var res={};
    var updatedValues = {
         CustomerID : msg.CustomerID,
         Name : msg.name,
         DOB : msg.birthdate,
         Location : msg.location,
         Address : msg.address,
         City : msg.city,
         State : msg.State,
         Country : msg.country
    }

  Customers.findByIdAndUpdate(msg.CustomerID, { $set: updatedValues },{$upsert:true}, (error, profile) => {
    if (error) {
      console.log("error update profile #");
        console.log(error);
        res.status = 205;
        res.message = 'customer profile not updated';
        callback(null, res);
    }
    if (profile) {
      console.log("update profile successful!");
        res.status = 200;
        res.message = 'customer profile updated';
        callback(null, res);
  }
  });
}

exports.handle_request = handle_request;