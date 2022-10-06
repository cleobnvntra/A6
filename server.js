/*************************************************************************
* BTI325– Assignment 3
* I declare that this assignment is my own work in accordance with Seneca Academic
Policy. No part * of this assignment has been copied manually or electronically from any
other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: Cleo Buenaventura Student ID: 030626139 Date: 10/4/2022
*
* Your app’s URL (from Cyclic) : https://evening-thicket-90046.herokuapp.com/
*
*************************************************************************/ 

var express = require("express");
var data_service = require("./data-service.js");
var path = require("path");
var multer = require("multer");
var app = express();
var fs = require("fs");

var HTTP_PORT = process.env.PORT || 8080;

// call this function after the http server starts listening for requests
function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT);
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const storage = multer.diskStorage({
  destination: "./public/images/uploaded",
  filename: function(req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

app.use(express.static('public'));

//HOME ROUTE
//HOME PAGE
app.get("/", function(req,res) {
  res.sendFile(path.join(__dirname,"/views/home.html"));
});

//ABOUT ROUTE
//ABOUT PAGE
app.get("/about", function(req,res) {
  res.sendFile(path.join(__dirname,"/views/about.html"));
});

//MANAGERS ROUTE
//LIST OF MANAGERS
app.get("/managers", function(req,res) {
  data_service.getManagers().then(function(data) {
    res.json(data);
  })
  .catch(function(err) {
    res.send(err);
  });
});

//EMPLOYEE ROUTE
//LIST OF ALL EMPLOYEES
app.get("/employees", function(req,res) {
  if(req.query.status) {
    data_service.getEmployeesByStatus(req.query.status).then(function(data) {
      res.json(data);
    }).catch(function(err) {
      res.send(err);
    });
  }
  else if(req.query.department) {
    data_service.getEmployeesByDepartment(req.query.department).then(function(data) {
      res.json(data);
    }).catch(function(err) {
      res.send(err);
    });
  }
  else if(req.query.manager) {
    data_service.getEmployeesByManager(req.query.manager).then(function(data) {
      res.json(data);
    }).catch(function(err) {
      res.send(err);
    });
  }
  else {
    data_service.getAllEmployees().then(function(data) {
        res.json(data);
      }
    ).catch(function(err) {
      res.send(err);
    });
  }
});

//SINGLE EMPLOYEE ROUTE
//DISPLAY EMPLOYEE BY EMPLOYEENUM
app.get("/employee/:employeeNum", function(req,res) {
  data_service.getEmployeesByNum(req.params.employeeNum).then(function(data) {
    res.json(data);
  }).catch(function(err){
    res.send(err);
  });
});

//DEPARTMENT ROUTE
//LIST OF DEPARTMENTS
app.get("/departments", function(req,res) {
    data_service.getDepartments().then(function(data) {
      res.json(data);
    })
    .catch(function(err) {
      res.send(err);
    });
});

//ADD EMPLOYEE ROUTE
//ADD EMPLOYEE FORM
app.get("/employees/add", function(req,res) {
  res.sendFile(path.join(__dirname,"/views/addEmployee.html"));
});

//ADD EMPLOYEE POST
//ADDS EMPLOYEE DATA
app.post("/employees/add", function(req,res) {
  data_service.addEmployee(req.body).then(function() {
    res.redirect("/employees");
  }).catch(function(err) {
    res.send(err);
  });
});

//ADD IMAGE ROUTE
//ADD IMAGE FORM
app.get("/images/add", function(req,res) {
  res.sendFile(path.join(__dirname,"/views/addImage.html"));
});

//IMAGE ROUTE
//LIST OF IMAGES
app.get("/images", function(req,res) {
  fs.readdir("./public/images/uploaded", function(err, images){
    if(!err) {
      res.json({images});
    }
  });
});

//ADD IMAGE ROUTE
//UPLOAD IMAGE
app.post("/images/add", upload.single("imageFile"), function(req,res) {
  res.redirect("/images");
});

//ERROR ROUTE
//ERROR PAGE
app.get("*", function(req,res) {
  res.sendFile(path.join(__dirname,"/views/error.html"))
});

// setup http server to listen on HTTP_PORT
data_service.initialize()
.then(function (response) {
  app.listen(HTTP_PORT, onHttpStart);
  console.log(response);
}).catch(function (err) {
  console.log(err);
});