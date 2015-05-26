global.TEST_DATABASE = "mongodb://localhost/ca5test";

var mongoose = require( 'mongoose' );
var should = require( 'should' );
var facade = require("../../server/model/Facade");
var db = require("../../server/model/db");

describe('Facade data layer', function(){
    this.timeout(10000);
    beforeEach(function(done){
        var array = [{
            userName: "testUser",
            password: "pw",
            firstName: "Alex",
            lastName: "Lund",
            email: "adlund@hotmail.com",
            street: "Hvidovrevej",
            city: "Hvidovre",
            zip: "2",
            country: "Denmark"},
            {
                userName: "testUser2",
                password: "pw2",
                firstName: "Alex2",
                lastName: "Lund2",
                email: "adlund@hotmail.com2",
                street: "Hvidovrevej2",
                city: "Hvidovre2",
                zip: "22",
                country: "Denmark2"}];
        db.User.create(array,function(err){
            done();
        });
    })

    afterEach(function(){  //Stop server after the test
        mongoose.connection.db.dropDatabase();
    })


    it('Should return all users', function(done){
        facade.getAllUsers(function(err, users){
            users.length.should.equal(2);
            done();
        })



    });
    it('Should check if a user is in the database and return true if there is', function(done) {
        facade.checkUser("testUser", "pw", function (err, bol) {
            bol.should.equal(true);
            done();
        })
    })

    it('Should check if a user is in the database and return false if there is not', function(done) {
        facade.checkUser("adlund", "adlund", function (err, bol) {
            bol.should.equal(false);
            done();
        })
    })
   // it('Should get a user based on an id', function(done) {
     //   facade.getUserByUsername("testUser", function (err, userByUserName) {
       //     console.log("WOOOOT!"+userByUserName.id);
         //   facade.getUser(userByUserName.id, function(err, user){
//
  //              user.userName.should.equal("testUser");
    //            user.password.should.equal("pw");
      //          user.firstName.should.equal("Alex");
        //        user.lastName.should.equal("Lund");
          //      user.email.should.equal("adlund@hotmail.com");
            //    user.street.should.equal("Hvidovrevej");
              //  user.city.should.equal("Hvidovre");
                //user.zip.should.equal(2);
    //user.country.should.equal("Denmark");
      //          done();
        //    })
        //})
    //})
    it('Should return a list of tickets based on a User', function(done) {
        facade.getTicketInfo("testUser", function (err, tickList) {
            tickList.length.should.equal(0);
            done();
        })
    })
    it('Should create tickets for user and return a list of tickets based on the user', function(done) {
        facade.createTicketAndAddToUser({seat: 'A87', date: '05-05-2015', departure: 'CPH', arrival: 'BAR'}, 'testUser', function(err, ticket){
            facade.createTicketAndAddToUser({seat: 'A88', date: '05-05-2015', departure: 'CPH', arrival: 'BAR'}, 'testUser', function(err, tickets) {
                facade.getTicketInfo("testUser", function (err, tickList) {
                    tickList.length.should.equal(2);
                    done();
                })
            })
        });


    })
    it('Should create a user', function(done) {
        facade.createUser({userName: 'adlund', password: 'adlund', firstName: 'Alex', lastName: "lastAlex", email: 'adlund@hotmail.com', street: 'hvidovrevej', city: 'Hvidovre', zip: 2650, country: 'Denmark'}, function (err, user){
            console.log("WOOOOT!"+user.id);
            user.userName.should.equal("adlund");
            user.password.should.equal("adlund");
            user.firstName.should.equal("Alex");
            user.lastName.should.equal("lastAlex");
            user.email.should.equal("adlund@hotmail.com");
            user.street.should.equal("hvidovrevej");
            user.city.should.equal("Hvidovre");
            user.zip.should.equal(2650);
            user.country.should.equal("Denmark");
            done();
        });
    })



})