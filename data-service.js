var employees = [];
var departments = [];

function initialize() {
    
    return new Promise(function(resolve, reject){
        fs.readFile('./data/employees.json',(err,data)=>{
            if (err) reject("Failure to read file employees.json!");
            employees = JSON.parse(data);
        });
    });
}