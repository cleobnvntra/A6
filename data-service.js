var employees = [];
var departments = [];
var fs = require('fs');

module.exports.initialize = function() {
    
    return new Promise(function(resolve, reject){
        fs.readFile('./data/employees.json',(err,data)=>{
            if (err) reject("Failure to read file employees.json!");
            employees = JSON.parse(data);
        });

        fs.readFile('./data/departments.json',(err,data)=>{
            if (err) reject("Failure to read file departments.json!");
            departments = JSON.parse(data);
        });

        resolve();
    });
}

module.exports.getAllEmployees = function() {

    return new Promise(function(resolve, reject) {
        if(employees.length == 0) reject("No results returned.");
        resolve();
    });
}