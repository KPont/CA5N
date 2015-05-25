/**
 * Created by Kasper on 22-05-2015.
 */
var db = require('../model/db.js');
var request = require('request');


function _getAllUsers(callback){
    var users = db.User.find(function (err, Users){
        if(err) {
            return console.log(err);
        }
        else{
            callback( Users );
        }
    });
}

function _checkUser(user,password,callback){
    db.User.findOne({userName : user },function(err,foundUser){
        if(err) {
            return callback(err);
        }
        if(foundUser !== null && foundUser.password === password){
            callback(null,true);
        } else
        {
            callback(null,false);
        }
    })
}

function _getUser(id, callback){
    db.User.findById(id, function(err, user){
        if(err) {
            return console.log(err);
        }
        else {
            callback( user );
        }
    });
}

function _getUserByUsername(username, callback){
    db.User.find({userName: username}, function(err, user){
        if(err) {
            return console.log(err);
        }
        else {
            callback( user );
        }
    });
}

function _createUser(UserJson){
    var User = new db.User({firstName: UserJson.firstName, lastName: UserJson.lastName, userName: UserJson.userName, email: UserJson.email, phone: UserJson.phone, password: UserJson.password});
    User.save(function(err){
        if(err) {
            return console.log(err);
        }
        else{
            console.log(User);
        }
    });
}

function _getFlight(departurePort, landingPort, date, callback){
    var options = {
        url: "http://semesterproject-testnikolai1.rhcloud.com/SemesterProjectFligths/api/flights/" + departurePort + "/" + landingPort + "/" + date,
        method: 'GET',
        json: true
    }

    request(options, function(error, response, body){
        if(!error && response.statusCode === 200){
            return callback(body);
        }
        console.log(error + " : " + JSON.stringify(body))
    });
}

function _getAllFlights(callback){
    var options = {
        url: "http://localhost:8084/CA5/api/flights",
        method: 'GET',
        json: true
    }

    request(options, function(error, response, body){
        if(!error && response.statusCode === 200){
            return callback(body);
        }
        console.log(error + " : " + JSON.stringify(body))
    });
}


module.exports = {
    getAllFlights : _getAllFlights,
    checkUser : _checkUser,
    getAllUsers : _getAllUsers,
    getUser : _getUser,
    getUserByUsername : _getUserByUsername,
    createUser : _createUser,
    getFlight : _getFlight
}