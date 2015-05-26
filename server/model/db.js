var mongoose = require( 'mongoose' );

/*

 Note:
 To this test project as it is:

 Start your MongoDB database.
 Start mongo.exe and do:
 use testdb
 db.testusers.insert({userName : "Lars", email :"lam@cphbusiness.dk",pw: "test",created : new Date()})
 db.testusers.insert({userName : "Henrik", email :"hsty@cphbusiness.dk",pw: "test",created : new Date()})
 db.testusers.insert({userName : "Tobias", email :"tog@cphbusiness.dk",pw: "test",created : new Date()})
 db.testusers.insert({userName : "Anders", email :"aka@cphbusiness.dk",pw: "test",created : new Date()})

 */
var dbURI;

//This is set by the backend tests
if( typeof global.TEST_DATABASE != "undefined" ) {
    dbURI = global.TEST_DATABASE;
}
else{
    dbURI = 'mongodb://ca5sem3:ca5sem3@ds063909.mongolab.com:63909/ca5sem3';
}

mongoose.connect(dbURI);

mongoose.connection.on('connected', function () {
    console.log('Mongoose connected to ' + dbURI);
});

mongoose.connection.on('error',function (err) {
    global.mongo_error = "Not Connected to the Database";
    console.log('Mongoose connection error: ' + err);
});

mongoose.connection.on('disconnected', function () {
    console.log('Mongoose disconnected');
});

process.on('SIGINT', function() {
    mongoose.connection.close(function () {
        console.log('Mongoose disconnected through app termination');
        process.exit(0);
    });
});


/** User SCHEMA **/
/** Replace this Schema with your own(s) **/



var userSchema = new mongoose.Schema({
    userName : {type: String, unique: true},
    password : String,
    firstName : String,
    lastName : String,
    email : String,
    street : String,
    city : String,
    zip : Number,
    country : String,
    tickets : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ticket'
    }]
});

var User = mongoose.model( 'User', userSchema);

var airlineSchema = mongoose.Schema({
    airlineName : String,
    url : String
});

var Airline = mongoose.model( 'Airline', airlineSchema);

var ticketSchema = mongoose.Schema({
    seat : String,
    date : String,
    departure : String,
    arrival : String
});

var Ticket = mongoose.model( 'ticket', ticketSchema);



exports.User = User;
exports.Airline = Airline;
exports.Ticket = Ticket;

