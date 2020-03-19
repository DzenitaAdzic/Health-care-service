const redis = require('redis');

const REDIS_PORT = process.env.PORT || 6379;

const client = redis.createClient(REDIS_PORT);

function getTeamIdKeys(ids){
    var team_id_keys = [];
    for(var i in ids){
      var team_id = i.replace(":members", "");
       team_id_keys.push(team_id); 
    }
    return team_id_keys;
  }
  function getEmployeeInfo(team_key, ids){
            var index = team_key.concat(":members");
            var users_ids = ids[index];
            var length = users_ids.length;
            var users = [];
  
        return new Promise ((resolve, reject) => {
            users_ids.forEach(id => {
              client.hmget(`Employee:${id}`, ["name", "lastname", "title"], 
                      (error, data) => {
                        if (error) {
                          reject(error);
                          return;
                        }
                        --length;
                        users.push(data);
  
                        if (length <=0){
                          resolve(users);  
                        }
                      });
            });
        });
  }
  function getMembers(ids, callback) {
    var teams = {};
    var team_id_keys = getTeamIdKeys(ids);  
    var count_teams = team_id_keys.length;
  
    return new Promise ((resolve, reject) => {
    team_id_keys.forEach(key => {
        client.hmget(key, "name", (err, name) => {
          if(err){
            reject(err);
            return;
          }
          else {  
            --count_teams;             
            getEmployeeInfo(key, ids).then((users) => {
              teams[name] = users;
              if (count_teams <= 0){
                resolve(teams);
              }
            });
          }       
        });
    });
  }); 
  }
  
  function getTeamsWithMembers() {
    return new Promise ((resolve, reject) =>{
      client.keys("Team:*:members", (err, keys) => {
        if(keys.length == 0) {
          reject("No teams entered");        
        }
        else {
          resolve(keys);
        }
    });
  });
  }
  
  function getTeamMembersId(keys){
    var team_membersId = {};
    var count = keys.length;
  
    return new Promise((resolve, reject) => {
                keys.forEach( key => {
                  client.smembers(key, (error, obj) => {
                    if(error) {
                      reject(error);
                      return;
                    } 
                    else {
                      team_membersId[key] = obj; 
                      --count;
                      if (count <= 0) {
                        resolve(team_membersId);
                      }
                    }
                  });
                });
      });
  }
  
  function getTeams() {
   
    return new Promise((resolve, reject) =>{
                getTeamsWithMembers()
                .then((keys) => {
                  return getTeamMembersId(keys) })
                .then((ids) => {
                    return getMembers(ids) })
                .then((result) => {
                      resolve(result);
                    })  
                .catch(function(err){
                  reject(err);
              });
               
            });
  }

module.exports.getTeams = getTeams;  
  