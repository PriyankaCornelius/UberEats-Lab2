var connection = new require('./kafka/Connection');
const customerLogin = require('./services/customerLogin');
const customerSignup = require('./services/customerSignup');
const updateCustomerProfile = require('./services/updateCustomerProfile');
const getCustomerProfile = require('./services/getCustomerProfile');
const getCustomerLocation = require('./services/getCustomerLocation');
const getFavouriteRestaurants = require('./services/getFavouriteRestaurants');
const placeOrder = require('./services/placeOrder');

//topics files
//var signin = require('./services/signin.js');
var Books = require('./services/books.js');

const { mongoDB } = require('./config');
//const mongoDB  = process.env.ATLAS_URI;
const mongoose = require('mongoose');
var options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // poolSize: 500,
    // bufferMaxEntries: 0
  };
  
mongoose.connect(mongoDB, options
  , (err, res) => {
    if (err) {
      console.log(err);
      console.log(`MongoDB Connection Failed`);
    } else {
      console.log(`MongoDB Connected`);
    }
  }
);

function handleTopicRequest(topic_name,fname){
    //var topic_name = 'root_topic';
    var consumer = connection.getConsumer(topic_name);
    var producer = connection.getProducer();
  console.log('server is running ');
    consumer.on('message', function (message) {
        console.log('message received for ' + topic_name +" ", fname);
        console.log(JSON.stringify(message.value));
        var data = JSON.parse(message.value);
        
        fname.handle_request(data.data, function(err,res){
            console.log('after handle'+res);
            var payloads = [
                { topic: data.replyTo,
                    messages:JSON.stringify({
                        correlationId:data.correlationId,
                        data : res
                    }),
                    partition : 0
                }
            ];
            producer.send(payloads, function(err, data){
                console.log(data);
            });
            return;
        });
        
    });
}
// Add your TOPICs here
//first argument is topic name
//second argument is a function that will handle this topic request
//handleTopicRequest("post_book", Books);
handleTopicRequest("customerLoginNew", customerLogin);
handleTopicRequest("customerSignup", customerSignup);
handleTopicRequest("updateCustomerProfile", updateCustomerProfile);
handleTopicRequest("getCustomerProfile", getCustomerProfile);
handleTopicRequest("getCustomerLocation", getCustomerLocation);
handleTopicRequest("getFavouriteRestaurants", getFavouriteRestaurants);
handleTopicRequest("placeOrder", placeOrder);

