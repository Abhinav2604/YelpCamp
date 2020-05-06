var express       = require("express");
var app           = express();
var bodyParser    = require("body-parser");
var mongoose      = require("mongoose");
var flash         = require('connect-flash');
var passport      = require('passport');
var localStrategy = require('passport-local');
var methodOverride = require('method-override');
// var Campground    = require('./models/campground.js');
//var Comment       = require('./models/comment.js');
var User          = require('./models/user.js');


var campgroundRoutes = require('./routes/campground.js');
var commentRoutes    = require('./routes/comment.js');
var indexRoutes      = require('./routes/index.js');


mongoose.set('useUnifiedTopology', true);
mongoose.connect("mongodb://localhost/yelp_camp", { useNewUrlParser: true });
mongoose.set('useFindAndModify', false);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
app.use(methodOverride('_method'));
app.use(flash());

//seedDB();

// Passport
app.use(require('express-session')({
    secret:"Learning WebD",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(request,response,next){
   response.locals.currentUser= request.user;
   response.locals.error    = request.flash('error');
   response.locals.success  = request.flash('success');
   next();
});

app.use(indexRoutes);
app.use(campgroundRoutes);
app.use(commentRoutes);


app.listen(process.env.PORT||3000, process.env.IP || '0.0.0.0', function () {
    console.log("Server Started");
});