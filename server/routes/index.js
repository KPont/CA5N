var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var facade = require("../model/Facade");

/* GET home page. */
router.get('/', function(req, res) {
  res.redirect("app/index.html")
});

router.get('/getFlights/:departure/:arrival/:date', function(req, res){
var dep = req.params.departure;
    var arr = req.params.arrival;
    var date = req.params.date;

    facade.getFlight(dep, arr, date, function(err, flights){
        //res.header("Content-type","application/json");

        res.json(flights);


    })
});

router.post('/flights/:id', function(req, res){
    var flightId = req.params.id;

})

router.post('/register', function(req, res){

    if(typeof(req.body.newusername) !== 'undefined'){
        console.log("HAISDOHFIJHDSGIHIDSHGIHSDIUGH"+req.body.firstname + " " +req.body.zip + " " )
        var newFName = req.body.firstname;
        var newLName = req.body.lastname;
        var newEmail = req.body.email;
        var newUser = req.body.newusername;
        var newPw = req.body.newpassword;
        var newStreet = req.body.street;
        var newCity = req.body.city;
        var newZip = req.body.zip;
        var newCountry = req.body.country;

        facade.createUser({"userName" : newUser, "password" : newPw, "firstName" : newFName, "lastName" : newLName, "email" : newEmail, "street" : newStreet, "city" : newCity, "zip" : newZip, "country" : newCountry },function(err, user){
        });
        //facade.createUser({"firstName" : newFName, "lastName" : newLName, "userName" : newUser, "email" : newEmail, "phone" : newPhone, "password" : newPw });
        res.redirect("/");
        return next();
    }
});

router.post('/authenticate', function (req, res) {
  //TODO: Go and get UserName Password from "somewhere"
  //if is invalid, return 401
    if (req.body.username === 'user1' && req.body.password === 'test') {
        var profile = {
            username: 'user1',
            role: "user",
            id: 1000
        };
        // We are sending the profile inside the token
        var token = jwt.sign(profile, require("../security/secrets").secretTokenUser, { expiresInMinutes: 60*5 });
        res.json({ token: token });
        return;
    }

    if (req.body.username === 'admin1' && req.body.password === 'test') {
        var profile = {
            username: 'admin1',
            role: "admin",
            id: 123423
        };
        // We are sending the profile inside the token
        var token = jwt.sign(profile, require("../security/secrets").secretTokenAdmin, { expiresInMinutes: 60*5 });
        res.json({ token: token });
        return;
    }

    facade.checkUser(req.body.username, req.body.password, function (err, result) {
        if (err || result === false) {
            res.status(401).send('Wrong user or password');
            return;
        }
        else {
            var profile = {
                username: req.body.username,
                role: "user",
                id: 1000
            };

            var token = jwt.sign(profile, require("../security/secrets").secretTokenUser, { expiresInMinutes: 60*5 });
            res.json({ token: token });
            return;
        }
        return res.redirect("/view1");
    });



});


//Get Partials made as Views
router.get('/partials/:partialName', function(req, res) {
  var name = req.params.partialName;
  res.render('partials/' + name);
});

module.exports = router;
