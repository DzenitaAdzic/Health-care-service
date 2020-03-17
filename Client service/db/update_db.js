const fetch = require('node-fetch');
const redis = require('redis');
const db = require('./write_db');

const REDIS_PORT = process.env.PORT || 6379;
const client = redis.createClient(REDIS_PORT);


function deleteTeam(msg){
    
    var data = JSON.parse(msg);
    var teamId = data['id'];
    console.log(data['id']);

    client.del(`Team:${teamId}`, (err, reply) => {
        if(err) {
            console.error(err);
          } 
          else {
            console.log(reply);
          }
    });

    client.del(`Team:${teamId}:members`, (err, reply) => {
        if(err) {
            console.error(err);
          } 
          else {
            console.log(reply);
          }
    });
}

function updateTeam(msg){
    
    var data = JSON.parse(msg);
    var teamId = data['id'];
    var teamName = data['name'];
    console.log(data['id']);

    client.hmset(`Team:${teamId}`, { 'name' : teamName}, (err, reply) => {
        if(err) {
          console.error(err);
        } 
        else {
          console.log(reply);
        }
      });
}

function updateEmployee(msg){
    var data = JSON.parse(msg);
    var id = data['id'];
    var name = data['name'];
    var lastname = data['lastname'];
    var title = data['title'];
    

    client.hmset(`Employee:${id}`, { 
        'name' : name,
        'lastname' : lastname,
        'title' : title }, (err, reply) => {
        if(err) {
          console.error(err);
        } 
        else {
          console.log(reply);
        }
      });
}

function deleteEmployee(msg){
    
    var data = JSON.parse(msg);
    var id = data['id'];

    client.del(`Employee:${id}`, (err, reply) => {
        if(err) {
            console.error(err);
          } 
          else {
            console.log(reply);
            db.saveEmployeeToTeam();
          }
    });
}

function deleteTeamEmployee(msg){
    var data = JSON.parse(msg);
    var teamId = data['teamId'];
    var employeeId = data['employeeId'];

    client.srem(`Team:${teamId}:members`, employeeId, (err) =>{
        if (err){
            console.log(err);
        }
    });
}

function updateTeamEmployee(msg){
    var data = JSON.parse(msg);
    var teamId = data['teamId'];
    var employeeId = data['employeeId']; 

    client.sadd(`Team:${teamId}:members`, employeeId, (err, reply) => {
        if(err) {
            console.error(err);
        } 
        else {
            console.log(reply);
        }
    });
}

module.exports.deleteTeam = deleteTeam;
module.exports.updateTeam = updateTeam;
module.exports.updateEmployee = updateEmployee;
module.exports.deleteEmployee = deleteEmployee;
module.exports.deleteTeamEmployee = deleteTeamEmployee;
module.exports.updateTeamEmployee = updateTeamEmployee;