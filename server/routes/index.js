var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var facade = require("../model/Facade");

/* GET home page. */
router.get('/', function(req, res) {
  res.redirect("app/index.html")
});

router.post('/register', function(req, res){
    if(typeof(req.body.newusername) !== 'undefined'){
        var newFName = req.body.firstname;
        var newLName = req.body.lastname;
        var newEmail = req.body.email;
        var newPhone = req.body.phone;
        var newUser = req.body.newusername;
        var newPw = req.body.newpassword;

        facade.createUser({"firstName" : newFName, "lastName" : newLName, "userName" : newUser, "email" : newEmail, "phone" : newPhone, "password" : newPw });
        res.redirect("/api/home");
        return next();
    }
});

router.post('/authenticate', function (req, res) {
  //TODO: Go and get UserName Password from "somewhere"
  //if is invalid, return 401
    facade.checkUser(req.body.username, req.body.password, function (err, result) {
        if (err || result === false) {
            res.json('Wrong user or password');
            return;
        }
        else {
            var profile = {
                username: req.body.username,
                role: "admin",
                id: 12345
            };

            var token = jwt.sign(profile, require("../security/secrets").secretTokenAdmin, { expiresInMinutes: 60*5 });
            res.json({ token: token });
            return;
        }
        return res.redirect("/");
    });
});

router.post('/findflight', function (req, res) {

    facade.getFlight(req.body.depart, req.body.arrival, req.body.date, function (err, result) {
        if (err || result === false) {
            res.json('Wrong user or password');
            return;
        }
        else {
            res.end(result);
            return;
        }
        return res.redirect("/");
    });
});

//Get Partials made as Views
router.get('/partials/:partialName', function(req, res) {
  var name = req.params.partialName;
  res.render('partials/' + name);
});

module.exports = router;
