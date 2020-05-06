var express= require('express');
var router = express.Router();
var Campground    = require('../models/campground');
var Comment       = require('../models/comment');
var middleware = require('../middleware');    

router.get("/campground/:id/comments/new",middleware.isLoggedIn, function (request, response) {
    response.setHeader("Set-Cookie", "HttpOnly;Secure;SameSite=Strict");
    Campground.findById(request.params.id, function (err, campground) {
        if (err)
            console.log('error');
        else {
            response.render("comments/new.ejs", { campground: campground });
        }
    });
});

router.post('/campground/:id/comments',middleware.isLoggedIn,function(request,response){
    Campground.findById(request.params.id, function (err, campground) {
        if (err)
          {  
             response.redirect("/campground");
          }

        else {
            Comment.create(request.body.comment,function(err,comment){
                if(err)
               {   request.flash('error', "Something went wrong");
                   
               }
                else{
                    comment.author.id       = request.user._id;
                    comment.author.username = request.user.username;
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    request.flash('success', "Successfully added comment");
                    response.redirect('/campground/'+ campground._id);
                }
            });
        }
    });
});
router.get('/campground/:id/comments/:comment_id/edit',middleware.checkCommentOwnership ,function(request,response){
    Comment.findById(request.params.comment_id, function(err, comment){
        if(err)
          {
             
              response.redirect('back');
          }
        else
        {
            response.render('comments/edit',{campground_id:request.params.id, comment:comment});
        }
    });
});

router.put('/campground/:id/comments/:comment_id',middleware.checkCommentOwnership, function(request,response){
    Comment.findByIdAndUpdate(request.params.comment_id,request.body.comment, function(err,comment){
        if(err)
        {  
            
            response.send(err);
        }
        else
        {   
            response.redirect('/campground/'+ request.params.id);
        }

    });
});

router.delete('/campground/:id/comments/:comment_id', middleware.checkCommentOwnership,function(request, response){
    Comment.findByIdAndDelete(request.params.comment_id,function(err){
        if(err)
        { 
            
            response.redirect('back');
        }
        else
        {   
            response.flash('success','Comment deleted');
            response.redirect('/campground/'+request.params.id);
        }
    });
   
});



module.exports = router;
