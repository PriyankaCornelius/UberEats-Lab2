const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var customerProfile = new Schema({
    //FirstName: {type: String, required: true},
    Name: {type: String, required: true},
    Email: {type: String, required: true},
    Password: { type: String, required: true },
    DOB: { type: String },
    Address: { type: String },
    Location: { type: String },
    City: {type: String},
    State: {type: String},
    Country: {type: String},
    NickName: { type: String },
    Favourites: {type: String},
    ProfilePicPath: {type: String},
    following: [{ type: Schema.Types.ObjectId }],
    favouriteRestaurants: { type: Array },
    //customerOrders: [{ type: Schema.Types.ObjectId }]
    customerOrders: [{
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
        RestaurantID:{
            type: String,
            required: true
        },
        instruction: {
            type: String,
            required: true
        }
    }]
},
{
    versionKey: false
});

const customer = mongoose.model('customer', customerProfile);
module.exports = customer;