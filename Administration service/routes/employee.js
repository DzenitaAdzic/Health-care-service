const express = require("express");
const Router = express.Router();
const mysqlConnection = require("../connection");
var msgBroker = require("../message broker/send");

Router.get("/", (req, res)=>{
    mysqlConnection.query("SELECT * from employee", (err, rows, fields) => {
        if(!err)       {
            res.send(rows);
        }
        else {
            console.log(err);
        }
    });
});

Router.get('/:id', function(req, res, next) {
    var id = req.params.id;
    var sql = `SELECT * FROM employee WHERE id=${id}`;
    mysqlConnection.query(sql, function(err, row, fields) {
      if(err) {
        res.status(500).send({ error: 'Something failed!' })
      }
      res.json(row[0])
    });
  });

Router.post('/create', function(req, res, next) {
    var name = req.body.name;
    var lastname = req.body.lastname;
    var title = req.body.title;
  
    var sql = `INSERT INTO employee (name, lastname, title) VALUES ("${name}", "${lastname}", "${title}")`;
    mysqlConnection.query(sql, function(err, result) {
      if(err) {
        res.status(500).send({ error: 'Something failed!' })
      }
      res.json({'status': 'success', id: result.insertId});
      msgBroker.send_message("EMPLOYEE UPDATE", { id : `${result.insertId}`, 
                                name : `${name}`, 
                                lastname : `${lastname}`,
                                title : `${title}` });

    });
  });

  /*put method for update employee*/
Router.put('/update/:id', function(req, res, next) {
    var id = req.params.id;
    var name = req.body.name;
    var lastname = req.body.lastname;
    var title = req.body.title;
  
    var sql = `UPDATE employee SET name="${name}", lastname="${lastname}", title="${title}"  WHERE id=${id}`;
    mysqlConnection.query(sql, function(err, result) {
      if(err) {
        res.status(500).send({ error: 'Something failed!' })
      }
      res.json({'status': 'success'});
      msgBroker.send_message("EMPLOYEE UPDATE", { id : `${id}`, 
                                name : `${name}`, 
                                lastname : `${lastname}`,
                                title : `${title}` });
    });
  });
  
  /*delete method for delete employee*/
  Router.delete('/delete/:id', function(req, res, next) {
    var id = req.params.id;
    var sql = `DELETE FROM employee WHERE id=${id}`;
    mysqlConnection.query(sql, function(err, result) {
      if(err) {
        res.status(500).send({ error: 'Something failed!' })
      }
      res.json({'status': 'success'});
      msgBroker.send_message("EMPLOYEE DELETE", { id : `${id}`});
    })
  })

module.exports = Router;

