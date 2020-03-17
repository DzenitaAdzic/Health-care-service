const express = require("express");
const bodyParser = require("body-parser");
const mySqlConnection = require("./connection");
const TeamRoutes = require("./routes/team");
const EmployeeRoutes = require("./routes/employee");
const TeamEmployee = require("./routes/team_employee");
const message_broker = require("./message broker/send");

const port = 3000;
var app = express();

app.use(bodyParser.json());
app.use("/team", TeamRoutes);
app.use("/employee", EmployeeRoutes);
app.use("/teams", TeamEmployee);

app.listen(port, () => console.log(`Administrative service listening on port ${port}`));
 