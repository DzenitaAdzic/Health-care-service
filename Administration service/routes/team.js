const express = require("express");
const Router = express.Router();
const mysqlConnection = require("../connection");
var msgBroker = require("../message broker/send");

/*get method for fetch all teams*/
Router.get("/", (req, res)=>{
    mysqlConnection.query("SELECT * from team", (err, rows, fields) => {
        if(err){
          res.status(500).send({ error: 'Something failed!' });
          return;
        }     
        res.send(rows);       
    })
});

/*get method for fetch single team*/
Router.get('/:id', function(req, res, next) {
    var id = req.params.id;
    var sql = `SELECT * FROM team WHERE id=${id}`;

    mysqlConnection.query(sql, function(err, row, fields) {
      if(err) {
        res.status(500).send({ error: 'Something failed!' })
      }
      res.json(row[0])
    });
  });

  /*post method for create team*/  
Router.post('/create', function(req, res, next) {
    var name = req.body.name;
    var sql = `INSERT INTO team (name) VALUES ("${name}")`;

    mysqlConnection.query(sql, function(err, result) {
      if(err) {
        res.status(500).send({ error: 'Something failed!' })
      }
      res.json({'status': 'success', id: result.insertId});
      msgBroker.send_message("TEAM UPDATE", { id : `${result.insertId}`, name : `${name}`, });
    });
  });

  /*put method for update team*/
Router.put('/update/:id', function(req, res, next) {
    var id = req.params.id;
    var name = req.body.name;
    
    var sql = `UPDATE team SET name="${name}" WHERE id=${id}`;
    mysqlConnection.query(sql, function(err, result) {
      if(err) {
        res.status(500).send({ error: 'Something failed!' })
      }
      res.json({'status': 'success'})
      msgBroker.send_message("TEAM UPDATE", { id : `${id}`, name : `${name}`, });
    })
  });
  
  /*delete method for delete team*/
  Router.delete('/delete/:id', function(req, res, next) {
    var id = req.params.id;
    var sql = `DELETE FROM team WHERE id=${id}`;
    mysqlConnection.query(sql, function(err, result) {
      if(err) {
        res.status(500).send({ error: 'Something failed!' })
      }
      res.json({'status': 'success'});
      msgBroker.send_message("TEAM DELETE", { id : `${id}`});

    });
  });

module.exports = Router;

