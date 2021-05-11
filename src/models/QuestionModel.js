const mongoose = require('mongoose')

const QuestionSchema = new mongoose.Schema({
    question:{type:String, required:true},
    answer:{type:String,required:true},    
    chapter:{type:String,required:true},
    topic:{type:String,required:true,default:"NA"},
    difficulty:{type:Number,default:5},
    author:{type:String,default:"unknown"}
    
})



module.exports = mongoose.model('Question', QuestionSchema)