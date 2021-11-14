const Customers = require('../Models/customer.model');

function handle_request(msg, callback){
    var res={};
    var d = new Date();
    var newOrder = {
        // _id: new ObjectID(),
        deliveryMode:msg.deliveryMode,
        orderStatus:"Order Received",
        date: Date.now(),
        deliveryAddress: msg.deliveryAddress,
        orderTotal: msg.orderTotal,
        items:msg.finalorder,
        RestaurantID: msg.RestaurantID,
        instruction:msg.instruction,
        RestaurantVisiting:msg.RestaurantVisiting
      };
    
      Customers.findByIdAndUpdate(msg.CustomerID, { $push:{customerOrders: newOrder} },{new: true}, (error, order) => {
        if (error) {
            res.status = 205;
          console.log(error);
          res.message = 'could not place order';
          callback(null, res);
        }
        if (order) {
          console.log("****Order Placed at customer***", order.customerOrders.at(-1).id);
          res.data = order.customerOrders.at(-1).id;
          res.message = 'order placed';
          res.status = 200;
          callback(null, res);
        }
      });
};
exports.handle_request = handle_request;