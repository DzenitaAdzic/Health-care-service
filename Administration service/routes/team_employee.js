const express = require("express");
const Router = express.Router();
const mysqlConnection = require("../connection");

Router.get("/", (req, res)=>{
    mysqlConnection.query("SELECT * from team_employee", (err, rows, fields) => {
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

Router.get('/team/:id/members', function(req, res, next) {
    var id = req.params.id;
    
    var sql = `SELECT id, name, lastname, title from employee inner join team_employee on employee.id = team_employee.employee_id where team_employee.team_id = ${id}`;
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
      res.json({'status': 'success'})
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
      res.json({'status': 'success'})
    })
  })

module.exports = Router;

