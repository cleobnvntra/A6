const bcrypt = require('bcryptjs');
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var userSchema = new Schema({
  "userName": {
    type: String,
    unique: true,
  },
  "password": String,
  "email": String,
  "loginHistory": [{
    "dateTime": Date,
    "userAgent": String
  }]
});

let connection;
var User;

module.exports.initialize = function() {
    return new Promise(function (resolve, reject) {
        connection = mongoose.createConnection(`mongodb+srv://ceejbnvntra:cj950609@a6.gq5g3f7.mongodb.net/Accounts`);
        connection.on("error", function(err) {
            reject(err);
        });

        connection.once("open", function() {
            User = connection.model("users", userSchema);
            resolve();
        });
    });
}

module.exports.registerUser = function(userData) {
    return new Promise(function (resolve, reject) {
        if(userData.password.trim().length === 0 || userData.password2.trim() === 0) {
            reject("Error: password cannot be empty or only white spaces!");
        }
        else if(userData.password != userData.password2) {
            reject("Passwords do not match.");
        }
        else if(userData.password == userData.password2) {
            bcrypt.hash(userData.password, 10).then(hash => {
                userData.password = hash;
                let newUser = new User(userData);
                newUser.save().then(function() {
                    resolve();
                }).catch(function(err) {
                    if(err.code == 11000) {
                        reject("User name already taken.");
                    }
                    else {
                        reject("There was an error creating the user: " + err);
                    }
                });
            }).catch(function(err) {
                reject("There was an error encrypting the password");
            });
        }
    });
}

module.exports.checkUser = function(userData) {
    return new Promise(function (resolve, reject) {
        User.findOne({userName: userData.userName}).exec().then(function(foundUser) {
            if(foundUser == {}) {
                reject("Unable to find user: " + userData.userName);
            }
            else {
                bcrypt.compare(userData.password, foundUser.password).then(function(result) {
                    if(result) {
                        foundUser.loginHistory.push({dateTime: (new Date()).toString(), userAgent: userData.userAgent});
                        User.updateOne(
                            {userName: foundUser.userName},
                            {$set: {loginHistory: foundUser.loginHistory}}
                        ).exec().then(function() {
                            resolve(foundUser);
                        }).catch(function(err) {
                            reject(err);
                        });
                    }
                    else {
                        reject("Incorrect Password for user: " + userData.userName);
                    }
                });
            }  
        }).catch(function() {
            reject("Unable to find user: " + userData.userName);
        });
    });
}