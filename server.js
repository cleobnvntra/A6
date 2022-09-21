var express = require("express");
var data_service = require("./data-service.js");
var path = require("path");
const { send } = require("process");
var app = express();

var HTTP_PORT = process.env.PORT || 8080;

// call this function after the http server starts listening for requests
function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT);
}

app.use(express.static('public'));

app.get("/about", function(req,res) {
    res.sendFile(path.join(__dirname,"/views/about.html"));
});

app.get("/", function(req,res) {
    res.sendFile(path.join(__dirname,"/views/home.html"));
});

app.get("/managers", function(req,res) {
  data_service.getManagers().then(function(data) {
    res.json(data);
  })
  .catch(function(err) {
    res.send(err);
  }); 
});

app.get("/employees", function(req,res) {
  data_service.getAllEmployees().then(function(data) {
    res.json(data);
  })
  .catch(function(err) {
    res.send(err);
  });
});

app.get("/departments", function(req,res) {
    data_service.getDepartments().then(function(data) {
      res.json(data);
    })
    .catch(function(err) {
      res.send(err);
    });
});

app.get("*", function(req,res) {
  res.sendFile(path.join(__dirname,"/views/error.html"))
})

// setup http server to listen on HTTP_PORT
data_service.initialize()
.then(function (response) {
  app.listen(HTTP_PORT, onHttpStart);
  console.log(response);
})
.catch(function (err) {
  console.log(err);
});