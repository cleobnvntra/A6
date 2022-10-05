var employees = [];
var departments = [];
var managers = [];
var fs = require('fs');

/**reads departments and employees json files to store in the array*/
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

/**returns a promise to list of all employees*/
module.exports.getAllEmployees = function() {

    return new Promise(function(resolve, reject) {
        if(employees.length == 0) reject("No employees were found.");
        resolve(employees);
    });
}

/**returns a promise to list of managers.
 * uses aManager() function.*/
module.exports.getManagers = function() {

    return new Promise(function(resolve, reject) {
        employees.forEach(aManager);

        if (managers.length == 0) reject("No employees were found.");
        resolve(managers);
        managers = [];
    });
}

/**returns a promise to list of departments*/
module.exports.getDepartments = function() {

    return new Promise(function(resolve, reject) {
        if(departments.length == 0) reject("No employees were found.");
        resolve(departments);
    });
}

/**returns a promise to add employee data to array using form*/
module.exports.addEmployee = function(employeeData) {

    return new Promise(function(resolve, reject) {
        if (employeeData.firstName == "" || employeeData.lastName == "") {
            reject("Invalid data.");
        }
        else {
            if(typeof employeeData.isManager === 'undefined' ) {
                employeeData.isManager = false;
            }

            employeeData.employeeNum = employees.length + 1;
            employees.push(employeeData);
            resolve;
        }
    });
}

/**function call for status query string*/
module.exports.getEmployeesByStatus = function(status) {
    return new Promise(function(resolve, reject) {
        var empByStat = [];
        for(var i = 0; i < employees.length; ++i) {
            if(status == employees[i].status) {
                empByStat.push(employees[i]);
            }
        }
        if(empByStat.length == 0) reject("No employees were found.");
        resolve(empByStat);
    });
}

/**function call for department query string*/
module.exports.getEmployeesByDepartment = function(department) {
    return new Promise(function(resolve, reject) {
        var empByDep = [];
        for(var i = 0; i < employees.length; ++i) {
            if(department == employees[i].department) {
                empByDep.push(employees[i]);
            }
        }
        if(empByDep.length == 0) reject("No employees were found.");
        resolve(empByDep);
    });
}

/**function call for manager query string*/
module.exports.getEmployeesByManager = function(manager) {
    return new Promise(function(resolve, reject) {
        var empByManager = [];
        for(var i = 0; i < employees.length; ++i) {
            if(manager == employees[i].employeeManagerNum) {
                empByManager.push(employees[i]);
            }
        }
        if(empByManager.length == 0) reject("No employees were found.");
        resolve(empByManager);
    })
}

/**function call for one parameter route*/
module.exports.getEmployeesByNum = function(empNum) {
    return new Promise(function(resolve, reject) {
        for(var i = 0; i < employees.length; ++i) {
            if(empNum == employees[i].employeeNum) {
                resolve(employees[i]);
            }
        }
        reject("No employee found.");
    })
}

/**pushes employee data if employee is a manager */
function aManager(emp) {
    if(emp.isManager == true) {
        managers.push(emp);
    }
}