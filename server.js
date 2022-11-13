/*************************************************************************
* BTI325– Assignment 5
* I declare that this assignment is my own work in accordance with Seneca Academic
Policy. No part * of this assignment has been copied manually or electronically from any
other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: Cleo Buenaventura Student ID: 030626139 Date: 10/24/2022
*
* Your app’s URL (from Heroku) : 
*
*************************************************************************/ 

var express = require("express");
var data_service = require("./data-service.js");
var path = require("path");
//var multer = require("multer");
var app = express();
var exphbs = require("express-handlebars");
//var fs = require("fs");

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

//ADD DEPARTMENT ROUTE
//ADD DEPARTMENT FORM
app.get("/departments/add", function(req, res) {
  res.render('addDepartment');
});

//ADD DEPARTMENT POST
//ADDS DEPARTMENT DATA
app.post("/departments/add", function(req,res) {
  data_service.addDepartment(req.body).then(function() {
    res.redirect("/departments");
  }).catch(function(err) {
    res.send(err);
  });
});

//ADD EMPLOYEE ROUTE
//ADD EMPLOYEE FORM
app.get("/employees/add", function(req,res) {
  data_service.getDepartments().then(function(data) {
    res.render('addEmployee', {departments: data});
  }).catch(function() {
    res.render('addEmployee', {departments: []});
  });
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
  res.render('addImage');
});

//ADD IMAGE POST
//UPLOAD IMAGE
app.post("/images/add", upload.single("imageFile"), function(req,res) {
  res.redirect("/images");
});

//EMPLOYEE ROUTE
//LIST OF ALL EMPLOYEES
app.get("/employees", function(req,res) {
  if(req.query.status) {
    data_service.getEmployeesByStatus(req.query.status).then(function(data) {
      res.render("employees", {employees: data});
    }).catch(function(err) {
      res.render("employees", {message: err});
    });
  }
  else if(req.query.department) {
    data_service.getEmployeesByDepartment(req.query.department).then(function(data) {
      res.render("employees", {employees: data});
    }).catch(function(err) {
      res.render("employees", {message: err});
    });
  }
  else if(req.query.manager) {
    data_service.getEmployeesByManager(req.query.manager).then(function(data) {
      res.render("employees", {employees: data});
    }).catch(function(err) {
      res.render("employees", {message: err});
    });
  }
  else {
    data_service.getAllEmployees().then(function(data) {
      if(data.length > 0) {
        res.render("employees", {employees: data});
      }
      else {
        res.render("employees", {message: "No results."});
      }
    }).catch(function(err) {
      res.render("employees", {message: err});
    });
  }
});

//SINGLE EMPLOYEE ROUTE
//DISPLAY EMPLOYEE BY EMPLOYEENUM
app.get("/employee/:empNum", (req, res) => {
  // initialize an empty object to store the values
  let viewData = {};
  data_service.getEmployeeByNum(req.params.empNum).then((data) => {
    if (data) {
      viewData.employee = data; //store employee data in the "viewData" object as "employee"
    } else {
      viewData.employee = null; // set employee to null if none were returned
    }
  }).catch(() => {
    viewData.employee = null; // set employee to null if there was an error
  }).then(data_service.getDepartments)
  .then((data) => {
    viewData.departments = data; // store department data in the "viewData" object as "departments"
    // loop through viewData.departments and once we have found the departmentId that matches
    // the employee's "department" value, add a "selected" property to the matching
    // viewData.departments object
    for (let i = 0; i < viewData.departments.length; i++) {
      if (viewData.departments[i].departmentId == viewData.employee.department) {
        viewData.departments[i].selected = true;
      }
    }
  }).catch(() => {
    viewData.departments = []; // set departments to empty if there was an error
  }).then(() => {
    if (viewData.employee == null) { // if no employee - return an error
      res.status(404).send("Employee Not Found");
    } else {
      res.render("employee", { viewData: viewData }); // render the "employee" view
    }
  }); 
});

//DEPARTMENT ROUTE
//LIST OF DEPARTMENTS
app.get("/departments", function(req,res) {
    data_service.getDepartments().then(function(data) {
      if(data.length > 0) {
        res.render("departments", {departments: data});
      }
      else {
        res.render("departments", {message: "No results."});
      }
    })
    .catch(function(err) {
      res.render("departments", {message: err});
    });
});

//SINGLE DEPARTMENT ROUTE
//DISPLAY DEPARTMENT BY DEPARTMENT depId
app.get("/department/:departmentId", function(req,res) {
  data_service.getDepartmentById(req.params.departmentId).then(function(data) {
    if(data != undefined) {
     res.render("department", {departments: data});
    }
    else {
      res.status(404).send("Department Not Found.");
    }
  }).catch(function(err){
    res.status(404).send("Department Not Found.");
  });
});

//IMAGE ROUTE
//LIST OF IMAGES
app.get("/images", function(req,res) {
  fs.readdir("./public/images/uploaded", function(err, images) {

    if(!err && !images) {
      res.render('images', {
        data: images,
        layout: "main.hbs"
      });
    }
    else {
      res.render("images", {message: "No images available."});
    }
  });
});

//UPDATE DEPARTMENT POST
//UPDATE SINGLE DEPARTMENT DATA
app.post("/department/update", function(req,res) {
  data_service.updateDepartment(req.body).then(function() {
    res.redirect("/departments");
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
    res.status(500).send(err);
  });
});

//DELETE EMPLOYEE ROUTE
//DELETE BY EMPLOYEENUM
app.get("/employees/delete/:empNum", function(req,res) {
  data_service.deleteEmployeeByNum(req.params.empNum).then(function() {
    res.redirect("/employees");
  }).catch(function(err) {
    res.status(500).send(err);
  });
})

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