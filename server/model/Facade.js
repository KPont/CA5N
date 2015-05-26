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
            callback(null, Users );
        }
    });
}

function _getAllAirlines(callback){
    var airlines = db.Airline.find(function (err, Airlines){
        if(err) {
            return console.log(err);
        }
        else{
            callback(null, Airlines );
        }
    });
}

function _checkUser(user,password,callback){
    db.User.findOne({userName : user },function(err,foundUser){
        if(err) {
            return callback(err);
        }
        if(foundUser != null && foundUser.password === password){
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
            return callback( null, user );
        }
    });
}

function _getUserByUsername(username, callback){
    db.User.find({userName: username}, function(err, user){
        if(err) {
            return console.log(err);
        }
        else {
            callback( null, user );
        }
    });
}

function _createUser(UserJson, callback){
    var User = new db.User({'userName': UserJson.userName, 'password': UserJson.password, 'firstName': UserJson.firstName, 'lastName': UserJson.lastName,'email': UserJson.email, 'street': UserJson.street, 'city': UserJson.city, 'zip': UserJson.zip, 'country': UserJson.country, 'tickets': []});
    User.save(function(err){
        if(err) {
            return callback(err);
        }
        else{

            return callback(null, User)
        }
    });
}

function _createAirline(UserJson, callback){
    var airline = new db.Airline({'airlineName': UserJson.airlineName, 'url': UserJson.url });
    airline.save(function(err){
        if(err) {
            return callback(err);
        }
        else{
            return callback(null, airline)
        }
    });
}

function _createTicketAndAddToUser(ticketJson, userName, callback){

    var ticket = new db.Ticket({'seat': ticketJson.seat, 'date': ticketJson.departure, 'arrival': ticketJson.arrival});
    ticket.save(function(err){
        if(err) {
            return callback(err);
        }
        else{
            db.User.findOne({'userName': userName}, function(err, user){
                if(err){
                    callback(err);
                }
                user.tickets.push(ticket.id);
                user.save(function(err){

                    return callback(null, ticket)
                })

            })
        }

    });
}

function _getTicketInfo(userName, callback){
    db.User.findOne({'userName': userName}, function(err, user){
        var index = 0;
        var ticketList = [];
        if(user.tickets.length === 0){
            callback(null, ticketList)
        }
        for(var i = 0; i < user.tickets.length; i++){
            db.Ticket.findById(user.tickets[i], function(err, ticket){
                ticketList.push(ticket);
                index++;
                if(index === user.tickets.length){
                    return callback (null, ticketList);
                }
            })
        }
    });
}

function _getFlight(departurePort, landingPort, date, callback){
   var airlines =  _getAllAirlines(function(err, airlines){
       console.log(departurePort);
        var counter = 0;
       var airlinelenght = airlines.length;
       var flights = [];

       for(var i = 0;i < airlinelenght ; i++)
       {
           var options = {
               url: airlines[i].url + 'api/flights/'+ departurePort + "/" + landingPort + "/" + date,
               method: 'GET',
               json: true
           }

           request(options, function (error, response, body) {
               console.log(JSON.stringify(response.statusCode))
               if (!error && JSON.stringify(response.statusCode === 200)) {
                   for(var j = 0;j < body.length; j++){
                      // console.log('herind ?'+body[j])
                       flights.push(body[j])
                   }
               }
               console.log(error + " : " + JSON.stringify(body))
               counter++
               if(counter === airlinelenght){
                   return callback(null, flights);
               }
           });
       }

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
function _ja(){
//_createAirline({'airlineName' : 'Airline 7', 'url' : 'http://Airline7-team007.rhcloud.com'}, function(err, airline){

//})
    _getFlight('CPH','LON','1430784000000',function(err, flights){
        console.log('yoooap'+ flights);
    })
}



module.exports = {
    createTicketAndAddToUser: _createTicketAndAddToUser,
    getTicketInfo : _getTicketInfo,
    getAllFlights : _getAllFlights,
    checkUser : _checkUser,
    getAllUsers : _getAllUsers,
    getAllAirlines : _getAllAirlines,
    getUser : _getUser,
    getUserByUsername : _getUserByUsername,
    createAirline : _createAirline,
    createUser : _createUser,
    getFlight : _getFlight,
    //ja : _ja()
}