const express = require("express");
const bodyParser = require("body-parser");
const mySqlConnection = require("./connection");
const TeamRoutes = require("./routes/team");
const EmployeeRoutes = require("./routes/employee");
const TeamEmployee = require("./routes/team_employee");

var app = express();

app.use(bodyParser.json());
app.use("/team", TeamRoutes);
app.use("/employee", EmployeeRoutes);
app.use("/members", TeamEmployee);

app.listen(3000);
 