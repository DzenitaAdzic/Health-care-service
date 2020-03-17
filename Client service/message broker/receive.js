var express = require('express');
var app = express();
var amqp = require('amqplib/callback_api');
var db = require('../db/update_db');

const port = 3002;

amqp.connect('amqp://localhost', (err, conn) => {
    conn.createChannel( (err, ch) => {
        var queue = 'TEAM UPDATE';
        
        ch.assertQueue('TEAM UPDATE', {durable:false});
        ch.assertQueue('TEAM DELETE', {durable:false});
        ch.assertQueue('EMPLOYEE UPDATE', {durable:false});
        ch.assertQueue('EMPLOYEE DELETE', {durable:false});
        ch.assertQueue('TEAMEMPLOYEE UPDATE', {durable:false});
        ch.assertQueue('TEAMEMPLOYEE DELETE', {durable:false});
        console.log(`Waiting for message`);
        
        ch.consume('TEAM UPDATE', (message) => {
            console.log(`Received ${message.content}`);
            db.updateTeam(message.content.toString());
        }, { noAck : true} );

        ch.consume('TEAM DELETE', (message) => {
            //console.log( message.content.toString());
            db.deleteTeam(message.content.toString());
        }, { noAck : true} );

        ch.consume('EMPLOYEE UPDATE', (message) => {
            //console.log( message.content.toString());
            db.updateEmployee(message.content.toString());
        }, { noAck : true} );

        ch.consume('EMPLOYEE DELETE', (message) => {
            //console.log( message.content.toString());
            db.deleteEmployee(message.content.toString());
        }, { noAck : true} );

        ch.consume('TEAMEMPLOYEE UPDATE', (message) => {
            //console.log( message.content.toString());
            db.updateTeamEmployee(message.content.toString());
        }, { noAck : true} );

        ch.consume('TEAMEMPLOYEE DELETE', (message) => {
            //console.log( message.content.toString());
            db.deleteTeamEmployee(message.content.toString());
        }, { noAck : true} );
    });

});
/*
amqp.connect('amqp://localhost', (err, conn) => {
    conn.createChannel( (err, ch) => {
        var queue = 'TEAM DELETE';
        
        ch.assertQueue(queue, {durable:false});
        console.log(`Waiting for message in ${queue}`);
        ch.consume(queue, (message) => {
            //console.log( message.content.toString());
            db.deleteTeam(message.content.toString());
        }, { noAck : true} );
    });

});
*/

app.listen(port, () => console.log(`RabbitMq listening on port ${port}`));