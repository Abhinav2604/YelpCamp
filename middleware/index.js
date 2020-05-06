var Campground = require('../models/campground');
var Comment = require('../models/comment');
var middlewareObj = {};
middlewareObj.checkCampgroundOwnership = function (request, response, next) {
    if (request.isAuthenticated()) {
        Campground.findById(request.params.id, function (err, camp) {
            if (err) {
               // console.log(err);
                request.flash('error', "Campground not found");
                response.redirect('back');
            } else {
                if (camp.author.id.equals(request.user._id))
                    next();
                else {
                    request.flash('error', "You don't have permission to do that ");
                    response.redirect('back');
                }
            }
        });
    }
    else {
        request.flash('error', 'You need to be logged in to do that');
        response.redirect('back');
    }
}

middlewareObj.checkCommentOwnership = function (request, response, next) {
    if (request.isAuthenticated()) {
        Comment.findById(request.params.id, function (err, comment) {
            if (err) {
               // console.log(err);
                request.flash('error', "Comment not found");
                response.redirect('back');
            } else {
                if (comment.author.id.equals(request.user._id))
                    next();
                else
                   {   request.flash('error', "You don't have permission to do that ");
                       response.redirect('back');
                }
            }
        });
    }
    else
      {   request.flash('error', 'You need to be logged in to do that');
          response.redirect('back');
        }
}

middlewareObj.isLoggedIn = function (request, response, next) {
    if (request.isAuthenticated()) {
        return next();
    }
    else {
        request.flash('error', 'You need to be logged in to do that');
        response.redirect('/login');
    }
}


module.exports = middlewareObj;