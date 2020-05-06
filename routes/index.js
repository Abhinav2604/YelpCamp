var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');


router.get("/", function (request, response) {
    response.setHeader("Set-Cookie", "HttpOnly;Secure;SameSite=Strict");
    response.render("landing");
});

router.get('/register', function (request, response) {
    response.render('register');
});

router.post('/register', function (request, response) {
    var newUser = new User({ username: request.body.username });
    User.register(newUser, request.body.password, function (err, user) {
        if (err) {
            response.flash('error', err.message);
            return response.render('/register');
        }
        passport.authenticate('local')(request, response, function () {
            request.flash('success','Welcome to YelpCamp '+ user.username)
            response.redirect('/campground');
        });

    });
});
// login 
router.get('/login', function (request, response) {
    response.render('login');
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/campground',
    failureRedirect: '/login'
}), function (request, response) {

});
router.get('/logout', function (request, response) {
    request.logout();
    request.flash('success', "Logged you out");
    response.redirect('/campground');
});


module.exports = router;
