const fetch = require('node-fetch');
const redis = require('redis');

const REDIS_PORT = process.env.PORT || 6379;
const client = redis.createClient(REDIS_PORT);


async function saveEmployees(){
    try {
        console.log('Fetching data..');
        const response = await fetch(`http://localhost:3000/employee`);
        
        const data = await response.json();
  
        //set data to redis
        data.forEach(element => {        
            client.hmset(`Employee:${element.id}`, 
                           {'name' : element.name, 
                            'lastname' : element.lastname,
                            'title' : element.title 
                            }, (err, reply) => {
                if(err) {
                console.error(err);
                } 
                else {
                console.log(reply);
                }
            });
        });
    }
    catch (err) {
        console.log(err);
    } 
  }

async function saveTeams(){
    try {
        console.log('Fetching data..');
        const response = await fetch(`http://localhost:3000/team`);
        
        const data = await response.json();

        //set data to redis
        data.forEach(element => {
          
            client.hmset(`Team:${element.id}`, { 'name' : element.name}, (err, reply) => {
            if(err) {
              console.error(err);
            } 
            else {
              console.log(reply);
            }
          });
        });
    }
    catch (err) {
        console.log(err);
    }

}

async function saveEmployeeToTeam(){
    try {
        console.log('Fetching data..');
        const response = await fetch(`http://localhost:3000/teams`);
        
        const data = await response.json();
        
        //set data to redis
        data.forEach(element => {
            var team_members = element.members.split(" ");
            team_members.forEach(member => {
                client.del(`Team:${element.team_id}:members`, (err, reply) => {
                    if (err){
                        console.log(err);
                    }
                    client.sadd(`Team:${element.team_id}:members`, member, (err, reply) => {
                        if(err) {
                            console.error(err);
                        } 
                        else {
                            console.log(reply);
                        }
                    });
                })
                
            });
            
        });
    }
    catch (err) {
        console.log(err);
    }

}

async function write2database() {

    saveTeams();
    saveEmployees();
    saveEmployeeToTeam();
}

module.exports.write = write2database;
module.exports.saveEmployeeToTeam = saveEmployeeToTeam;