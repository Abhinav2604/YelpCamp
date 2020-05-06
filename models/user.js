var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');
var userSchema = new mongoose.Schema({
    username : String,
    password : String
});
userSchema.plugin(passportLocalMongoose);
let User
try {
    User = mongoose.model('User')
} catch (error) {
    User  = mongoose.model('User',userSchema)
}
module.exports = User;