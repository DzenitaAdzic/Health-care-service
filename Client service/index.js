const express = require('express');
const message_broker = require('./message broker/receive');

var write2database = require('./db/write_db');
var readDb = require('./db/read_db');

const PORT = process.env.PORT || 5000;
const app = express();

var teams = undefined;


//write2database.write();


app.get('/teams/', (req, res, next) => {
 
    readDb.getTeams().then((result) => {
      res.send(result);
  });

});

app.listen(PORT, () => {
    console.log(`Client service listening on port ${PORT}`);
});