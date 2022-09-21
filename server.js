var express = require("express");
var data_service = require("./data-service.js");
var path = require("path");
var app = express();

var HTTP_PORT = process.env.PORT || 8080;

// call this function after the http server starts listening for requests
function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT);
}

app.use(express.static('public'));

app.get("/about", function(req,res){
    res.sendFile(path.join(__dirname,"/views/about.html"));
});

app.get("/", function(req,res){
    res.sendFile(path.join(__dirname,"/views/home.html"));
});

app.get("/managers", function(req,res){
    
})

app.get("/employees", function(req,res){
  data_service.getAllEmployees().then(function(data) {
    res.json(data);
  })
  .catch(function(err){
    res.send(err);
  });
});

app.get("/departments", function(req,res){
    
})

// setup http server to listen on HTTP_PORT
app.listen(HTTP_PORT, data_service.initialize().then(function());