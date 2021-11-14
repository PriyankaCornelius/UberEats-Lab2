const Customers = require('../Models/customer.model');
function handle_request(msg, callback){
    var res={};
    var CustomerID = msg.CustomerID;
    console.log(CustomerID);
  
    Customers.findById(CustomerID, (error, profile) => {
      if (error) {
        console.log(error);
        res.status = 205;
        res.message = 'customer not found';
        callback(null, res);
      }
      if (profile) {
        res.status = 200;
        res.data=profile.Location;
        console.log("customer location: ",profile.Location);
        callback(null, res);
      }
    });


};

exports.handle_request = handle_request;