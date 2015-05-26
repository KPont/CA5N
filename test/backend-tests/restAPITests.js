global.TEST_DATABASE = "mongodb://localhost/TestDataBase_xx1243";
global.SKIP_AUTHENTICATION = true;  //Skip security

var should = require("should");
var app = require("../../server/app");
var http = require("http");
var testPort = 9999;
var testServer;
var mongoose = require("mongoose");
var User = mongoose.model("User");
var nock = require('nock');

describe('REST API for /user', function () {
    this.timeout(8000);
  //Start the Server before the TESTS
  before(function (done) {

    testServer = app.listen(testPort, function () {
      console.log("Server is listening on: " + testPort);
      done();
    })
    .on('error',function(err){
        console.log(err);
      });
  })

  beforeEach(function(done){
     nock.cleanAll();
  })

  after(function(){  //Stop server after the test
    //Uncomment the line below to completely remove the database, leaving the mongoose instance as before the tests
    //mongoose.connection.db.dropDatabase();
    testServer.close();
  })

  it("Should get a flight", function (done) {
      var api = nock(testServer)
          .get('/getFlights/CPH/LON/123456')
          .reply(200, [{
              airline: 'airline1',
              price: 1234,
              flightId: '7',
              takeOffDate: '123456',
              landingDate: '123456',
              depature: 'CPH',
              destination: 'LON',
              seats: 2,
              availableSeats: 2,
              bookingCode: true
          }]);

      http.get(testServer+"/CPH/LON/123456", function(resp) {
          var str = "";
          resp.on("data", function(data) { str += data; });
          resp.on("end", function() {
              console.log("Got Result: ", str);
              api.isDone();
              done();
          });
      });

   done();
  });
});
