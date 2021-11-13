const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var restaurantProfile = new Schema({
    //FirstName: {type: String, required: true},
    Name: {type: String, required: true},
    Email: {type: String, required: true},
    Password: { type: String, required: true },
    Location: { type: String },
    Cuisine: { type: String },
    DeliveryMode: { type: String },
    Dietary: { type: String },
    Description: { type: String },
    PhoneNum: { type: String },
    Address: { type: String },
    Timings: { type: String },
    Dishes : { type : Array , "default" : [] },
   //name,price,description,ingredients,image,category,restaurantEmail
    City: {type: String},
    State: {type: String},
    Country: {type: String},
    
    Favourites: {type: String},
    ProfilePicPath: {type: String},
    following: [{ type: Schema.Types.ObjectId }],
    restaurantOrders: [{
        _id: {
            type: String,
        },
        deliveryMode:{
            type: String,
            required: true
          },
        orderStatus:{
            type: String,
            required: true
        },
        date: {
            type: String,
            required: true
        },
        deliveryAddress: {
            type: String
        },
        orderTotal: {
            type: String,
            required: true
        },
        items:{
            type: Array,
            required: true
        },
        instruction: {
            type: String,
            required: true
        },
        CustomerID:{
            type: String,
            required: true
        },
        customerEmail: {
            type: String,
            required: true
        }
    }]
},
{
    versionKey: false
});

const restaurant = mongoose.model('restaurant', restaurantProfile);
module.exports = restaurant;