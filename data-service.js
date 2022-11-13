const Sequelize = require("sequelize");

var sequelize = new Sequelize('ztkoujvt', 'ztkoujvt', '9Ojed0fZi_T_-u_-lVV4AuPleB1rUp3y', {
    host: 'peanut.db.elephantsql.com',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: true
    },
    query: {raw: true}
});

sequelize.authenticate().then(()=> console.log('Connection success.'))
.catch((err)=>console.log("Unable to connect to DB.", err));

var Employee = sequelize.define('employee', {
    employeeNum:  {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING,
    email: Sequelize.STRING,
    SSN: Sequelize.STRING,
    addressStreet: Sequelize.STRING,
    addressCity: Sequelize.STRING,
    addressState: Sequelize.STRING,
    addressPostal: Sequelize.STRING,
    maritalStatus: Sequelize.STRING,
    isManager: Sequelize.BOOLEAN,
    employeeManagerNum: Sequelize.INTEGER,
    status: Sequelize.STRING,
    department: Sequelize.INTEGER,
    hireDate: Sequelize.STRING
});

var Department = sequelize.define('Department', {
    departmentId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    departmentName: Sequelize.STRING
});
   

/**reads departments and employees json files to store in the array*/
module.exports.initialize = function() {
    
    return new Promise(function (resolve, reject) {
        sequelize.sync().then(function() {
            resolve();
        }).catch(function() {
            reject("Unable to sync database.")
        });
    });      
}

/**returns a promise to add employee data using form*/
module.exports.addEmployee = function(employeeData) {

    return new Promise(function (resolve, reject) {
        employeeData.isManager = (employeeData.isManager) ? true : false;
        for (var data in employeeData) {
            if(employeeData[data] == "") {
                employeeData[data] = null;
            }
        }

        Employee.create(employeeData).then(function() {
            console.log(employeeData);
            resolve();
        }).catch(function() {
            reject("Unable to create employee.");
        });
    });
}

/**returns a promise to add department data using form*/
module.exports.addDepartment = function(departmentData) {

    return new Promise(function (resolve, reject) {
        for (var data in departmentData) {
            if(departmentData[data] == "") {
                departmentData[data] = null;
            }
        }
        Department.create(departmentData).then(function() {
            resolve();
        }).catch(function() {
            reject("Unable to create department.");
        });
    });
}

/**returns a promise to list of all employees*/
module.exports.getAllEmployees = function() {

    return new Promise(function (resolve, reject) {
        Employee.findAll().then(function(emp) {
            resolve(emp);
        }).catch(function() {
            reject("No results found.")
        });
    });    
}

/**returns a promise to list of departments*/
module.exports.getDepartments = function() {

    return new Promise(function (resolve, reject) {
        Department.findAll().then(function(dep) {
            resolve(dep);
        }).catch(function() {
            reject("No results found.");
        });
    });      
}

/**returns a promise to list of managers.
 * uses aManager() function.*/
module.exports.getManagers = function() {

    return new Promise(function (resolve, reject) {
        reject();
    });      
}

/**function call for status query string*/
module.exports.getEmployeesByStatus = function(empStatus) {
    return new Promise(function (resolve, reject) {
        Employee.findAll({where: {status: empStatus}}).then(function(emp) {
            resolve(emp);
        }).catch(function() {
            reject("No results found.");
        });
    });  
}

/**function call for department query string*/
module.exports.getEmployeesByDepartment = function(dep) {
    return new Promise(function (resolve, reject) {
        Employee.findAll({where: {department: dep}}).then(function(emp) {
            resolve(emp);
        }).catch(function() {
            reject("No results found.");
        });
    });      
}

/**function call for manager query string*/
module.exports.getEmployeesByManager = function(managerNum) {
    return new Promise(function (resolve, reject) {
        Employee.findAll({where: {employeeManagerNum: managerNum}}).then(function(emp) {
            resolve(emp);
        }).catch(function() {
            reject("No results found.");
        });
    });      
}

/**function call for one parameter employee route*/
module.exports.getEmployeeByNum = function(empNum) {
    return new Promise(function (resolve, reject) {
        Employee.findAll({where: {employeeNum:empNum}}).then(function(emp) {
            resolve(emp);
        }).catch(function() {
            reject("No results found.");
        });
    });     
}

/**function call for one parameter department route*/
module.exports.getDepartmentById = function(depId) {
    return new Promise(function (resolve, reject) {
        Department.findAll({where: {departmentId: depId}}).then(function(dep) {
            resolve(dep[0]);
        }).catch(function() {
            reject("No results found.");
        });
    });     
}

/**function call to update employee data*/
module.exports.updateEmployee = function(employeeData) {
    return new Promise(function (resolve, reject) {
        employeeData.isManager = (employeeData.isManager) ? true : false;
        for (var data in Employee) {
            if(data == "") {
                data = null;
            }
        }

        Employee.update({employeeData, where: {employeeNum: employeeData.employeeNum}}).then(function(emp) {
            resolve(emp);
        }).catch(function() {
            reject("Unable to update employee.");
        });
    });
}

/**function call to update department data*/
module.exports.updateDepartment = function(departmentData) {
    return new Promise(function (resolve, reject) {
        for (var data in Employee) {
            if(data == "") {
                data = null;
            }
        }

        Department.update({departmentData, where: {departmentId: departmentData.departmentId}}).then(function(dep) {
            resolve(dep);
        }).catch(function() {
            reject("Unable to update employee.");
        });
    });   
}

module.exports.deleteEmployeeByNum = function(empNum) {
    return new Promise(function (resolve, reject) {
        Employee.destroy({where: {employeeNum:empNum}}).then(function() {
            resolve();
        }).catch(function() {
            reject("Unable to Remove Employee / Employee not found.");
        });
    })
}

/**pushes employee data if employee is a manager */
function aManager(emp) {
    if(emp.isManager == true) {
        managers.push(emp);
    }
}