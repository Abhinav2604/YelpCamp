var express = require('express');
var router = express.Router();
var Campground = require('../models/campground');
//var Comment = require('../models/comment');
var middleware = require('../middleware');                 //this will require index.js in middleware, index is special name, if we  require any folder then index file in that folder would be required automatically

router.get("/campground", function (request, response) {
    response.setHeader("Set-Cookie", "HttpOnly;Secure;SameSite=Strict");
    Campground.find({}, function (err, allCampground) {
        if (err)
            console.log("Error");
        else {
            response.render("campground/index", { campgrounds: allCampground, currentUser: request.user });
        }
    });
});

router.post("/campground", middleware.isLoggedIn, function (request, response) {
    var name = request.body.camp;
    var image = request.body.image;
    var description = request.body.description;
    var price = request.body.price;
    var author = {
        id: request.user._id,
        username: request.user.username
    };                                                             // slightly different way of associating (way used in comments will also work)
    var newCampground = { name: name, image: image, description: description, author: author, price:price };
    Campground.create(newCampground, function (err, newlyCreated) {
        if (err)
            console.log("Error");
        else {
            response.redirect("/campground");
        }

    });
});

router.get("/campground/new", middleware.isLoggedIn, function (request, response) {
    response.setHeader("Set-Cookie", "HttpOnly;Secure;SameSite=Strict");
    response.render("campground/new.ejs");
});

router.get("/campground/:id", function (request, response) {
    Campground.findById(request.params.id).populate('comments').exec(function (err, foundCampground) {
        if (err)
            console.log("Error");
        else {
            response.setHeader("Set-Cookie", "HttpOnly;Secure;SameSite=Strict");
            response.render("campground/show", { campground: foundCampground });
        }
    });

});

router.get('/campground/:id/edit',middleware.checkCampgroundOwnership, function (request, response) {
    Campground.findById(request.params.id, function (err, camp) {
        if (err) {
            //console.log(err);
            response.redirect('/campground');
        }
        else {
            response.render('campground/edit', { campground: camp });

        }
    });
});

router.put('/campground/:id', middleware.checkCampgroundOwnership, function (request, response) {
    Campground.findOneAndUpdate(request.params.id, request.body.campground, function (err, camp) {
        if (err) {
           // console.log(err);
            response.redirect('/campground');
        }
        else {
            response.redirect('/campground/' + request.params.id);
        }
    });
});

router.delete('/campground/:id', middleware.checkCampgroundOwnership, function (request, response) {
    Campground.findOneAndDelete(request.params.id, function (err) {
        if (err)
            console.log('error');
        else {
            response.redirect('/campground');
        }
    });
});




module.exports = router;