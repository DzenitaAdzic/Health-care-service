const express = require("express");
const Router = express.Router();
const mysqlConnection = require("../connection");
var msgBroker = require("../message broker/send");

Router.get("/", (req, res)=>{
    mysqlConnection.query("SELECT team_id ,GROUP_CONCAT(employee_id SEPARATOR ' ') members FROM team_employee GROUP BY team_id", (err, rows, fields) => {
        if(!err)
        {
            res.send(rows);
        }
        else
        {
            console.log(err);
        }
    })
});

Router.get('/:id/members', function(req, res, next) {
    var id = req.params.id;
    
    var sql = `SELECT employee_id from team_employee where team_id = ${id}`;
    mysqlConnection.query(sql, function(err, row, fields) {
      if(err) {
        res.status(500).send({ error: 'Something failed!' })
      }
      res.json(row)
    });
  });

  /*post method for create team member*/ 
Router.post('/create', function(req, res, next) {
    var team_id = req.body.team_id;
    var employee_id = req.body.employee_id;
  
    var sql = `INSERT INTO team_employee (team_id, employee_id) VALUES ("${team_id}", "${employee_id}")`;
    mysqlConnection.query(sql, function(err, result) {
      if(err) {
        res.status(500).send({ error: 'Something failed!' })
      }
      res.json({'status': 'success'});
      msgBroker.send_message("TEAMEMPLOYEE UPDATE", { teamId : `${team_id}`, employeeId : `${employee_id}`});
   
    });
  });

  /*delete method for delete team member*/
  Router.delete('/delete/team/:teamId/employee/:employeeId', function(req, res, next) {
    var team_id = req.body.team_id;
    var employee_id = req.body.employee_id;
  
    var sql = `DELETE FROM team_employee WHERE team_id=${team_id} AND employee_id = ${employee_id}`;
    mysqlConnection.query(sql, function(err, result) {
      if(err) {
        res.status(500).send({ error: 'Something failed!' })
      }
      res.json({'status': 'success'});
      msgBroker.send_message("TEAMEMPLOYEE DELETE", { teamId : `${team_id}`, employeeId : `${employee_id}`});
    });
  });

module.exports = Router;

