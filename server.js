/*************************************************************************
* BTI325– Assignment 4
* I declare that this assignment is my own work in accordance with Seneca Academic
Policy. No part * of this assignment has been copied manually or electronically from any
other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: Cleo Buenaventura Student ID: 030626139 Date: 10/24/2022
*
* Your app’s URL (from Heroku) : https://tranquil-taiga-27351.herokuapp.com/
*
*************************************************************************/ 

var express = require("express");
var data_service = require("./data-service.js");
var path = require("path");
var multer = require("multer");
var app = express();
var exphbs = require("express-handlebars");
var fs = require("fs");

var HTTP_PORT = process.env.PORT || 8080;

//call this function after the http server starts listening for requests
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

app.engine('.hbs', exphbs.engine({ extname: '.hbs'}));
app.set('view engine', '.hbs');

//CUSTOM HELPERS
app.engine('.hbs', exphbs.engine({ 
  extname: '.hbs',
  helpers: { 
    navLink: function(url, options) {
      return '<li' +
      ((url == app.locals.activeRoute) ? ' class="active" ' : '') +
      '><a href=" ' + url + ' ">' + options.fn(this) + '</a></li>';
    },
    equal: function (lvalue, rvalue, options) {
      if (arguments.length < 3)
      throw new Error("Handlebars Helper equal needs 2 parameters");
      if (lvalue != rvalue) {
      return options.inverse(this);
      } else {
      return options.fn(this);
      }
     }      
  }
}));

//SET THE CURRENT ROUTE TO ACTIVE WHEN ROUTE CHANGES
app.use(function(req,res,next){
  let route = req.baseUrl + req.path;
  app.locals.activeRoute = (route == "/") ? "/" : route.replace(/\/$/, "");
  next();
 });

//HOME ROUTE
//HOME PAGE
app.get("/", function(req,res) {
  res.render('home');
});

//ABOUT ROUTE
//ABOUT PAGE
app.get("/about", function(req,res) {
  res.render('about');
});

//EMPLOYEE ROUTE
//LIST OF ALL EMPLOYEES
app.get("/employees", function(req,res) {
  if(req.query.status) {
    data_service.getEmployeesByStatus(req.query.status).then(function(data) {
      res.render("employees", {employees: data});
    }).catch(function(err) {
      res.render({message: err});
    });
  }
  else if(req.query.department) {
    data_service.getEmployeesByDepartment(req.query.department).then(function(data) {
      res.render("employees", {employees: data});
    }).catch(function(err) {
      res.render({message: err});
    });
  }
  else if(req.query.manager) {
    data_service.getEmployeesByManager(req.query.manager).then(function(data) {
      res.render("employees", {employees: data});
    }).catch(function(err) {
      res.render({message: err});
    });
  }
  else {
    data_service.getAllEmployees().then(function(data) {
      res.render("employees", {employees: data});
    }).catch(function(err) {
      res.render({message: err});
    });
  }
});

//SINGLE EMPLOYEE ROUTE
//DISPLAY EMPLOYEE BY EMPLOYEENUM
app.get("/employee/:employeeNum", function(req,res) {
  data_service.getEmployeesByNum(req.params.employeeNum).then(function(data) {
    res.render("employee", {employee: data});
  }).catch(function(err){
    res.render("employee", {message: err});
  });
});

//DEPARTMENT ROUTE
//LIST OF DEPARTMENTS
app.get("/departments", function(req,res) {
    data_service.getDepartments().then(function(data) {
      res.render("departments", {departments: data});
    })
    .catch(function(err) {
      res.render({message: err});
    });
});

//ADD EMPLOYEE ROUTE
//ADD EMPLOYEE FORM
app.get("/employees/add", function(req,res) {
  res.render('addEmployee');
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

//UPDATE EMPLOYEE POST
//UPDATE SINGLE EMPLOYEE DATA
app.post("/employee/update", function(req,res) {
  data_service.updateEmployee(req.body).then(function() {
    res.redirect("/employees");
  }).catch(function(err) {
    res.send(err);
  });
});

//ADD IMAGE ROUTE
//ADD IMAGE FORM
app.get("/images/add", function(req,res) {
  res.render('addImage');
});

//IMAGE ROUTE
//LIST OF IMAGES


app.get("/images", function(req,res) {
  fs.readdir("./public/images/uploaded", function(err, images) {

    if(!err) {
      res.render('images', {
        data: images,
        layout: "main.hbs"
      });
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

//setup http server to listen on HTTP_PORT
data_service.initialize()
.then(function (response) {
  app.listen(HTTP_PORT, onHttpStart);
  console.log(response);
}).catch(function (err) {
  console.log(err);
});