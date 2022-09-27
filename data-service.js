var employees = [];
var departments = [];
var managers = [];
var fs = require('fs');

module.exports.initialize = function() {
    
    return new Promise(function(resolve, reject){
        fs.readFile('./data/employees.json',(err,data)=>{
            if (err) {
                reject("Failure to read file employees.json!");
            }
            else {
                employees = JSON.parse(data);

                fs.readFile('./data/departments.json',(err,data)=>{
                    if (err) {
                        reject("Failure to read file departments.json!");
                    }
                    else {
                        departments = JSON.parse(data);
                        resolve("Read success.");
                    }
                });
            }
        });     
    });
}

module.exports.getAllEmployees = function() {

    return new Promise(function(resolve, reject) {
        if(employees.length == 0) reject("No results returned.");
        resolve(employees);
    });
}

module.exports.getManagers = function() {

    return new Promise(function(resolve, reject) {
        employees.forEach(aManager);

        if (managers.length == 0) reject("No results returned.");
        resolve(managers);
        managers = [];
    });
}

module.exports.getDepartments = function() {

    return new Promise(function(resolve, reject) {
        if(departments.length == 0) reject("No results returned.");
        resolve(departments);
    });
}

function aManager(item) {
    if(item.isManager == true) {
        managers.push(item);
    }
}