var mongoose=require("mongoose");
var commentSchema = new mongoose.Schema({
    text: String,
    author:{
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref:'User'
        },
        username :String
    }

});
let Comment
try {
    Comment = mongoose.model('Comment')
} catch (error) {
    Comment = mongoose.model("Comment", commentSchema)
}
module.exports = Comment;