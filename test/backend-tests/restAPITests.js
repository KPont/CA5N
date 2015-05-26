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

  it("Should get 2 users; Lars and Henrik", function (done) {
      var couchdb = nock('http://myapp.iriscouch.com')
          .get('/users/1')
          .reply(200, {
              _id: '123ABC',
              _rev: '946B7D1C',
              username: 'pgte',
              email: 'pedro.teixeira@gmail.com'
          });


    http.get("http://localhost:"+testPort+"/adminApi/user",function(res){
      res.setEncoding("utf8");//response data is now a string
      res.on("data",function(chunk){
        var n = JSON.parse(chunk);
        n.length.should.equal(2);
        n[0].userName.should.equal("Lars");
        n[1].userName.should.equal("Henrik");
        done();
      });
    })
  });
});
