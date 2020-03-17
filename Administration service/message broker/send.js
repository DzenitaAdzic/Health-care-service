var express = require('express');
var app = express();
var amqp = require('amqplib/callback_api');

const port = 3001;
var ch;
function send_message (queue, message) {

    ch.assertQueue(queue, {durable: false});
    ch.sendToQueue(queue, new Buffer(JSON.stringify(message)));

}
amqp.connect('amqp://localhost', (err, conn) => {
    conn.createChannel( (err, channel) => {
       ch = channel;       
    });  
});

app.listen(port, () => console.log(`RabbitMq listening on port ${port}`));



module.exports.send_message = send_message;