var connection = new require('./kafka/Connection');
const customerLogin = require('./services/customerLogin');
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
//   const connectionc = mongoose.connection;
// connectionc.once('openUri', () => {
//   console.log("MongoDB database connection established successfully");
// })
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
handleTopicRequest("customerLoginNew",customerLogin);

