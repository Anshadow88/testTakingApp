const mongoose = require('mongoose')

const QuestionSchema = new mongoose.Schema({
    type:{type:String,default:'1'},// 1:MCQsingle, 2:MCQmorethanone, 3: Integer/numerical ,4: Decimal Type, 5: Match the following, 5: paragraph
    question:{type:String, required:true},
    subject:{type:String},    
    testPaperName:{type:String},
    answer:{type:String,required:true},    
    chapter:{type:String,required:true},
    topic:{type:String,required:true,default:"NA"},
    difficulty:{type:Number,default:5},
    author:{type:String,default:"unknown"},
    image:{type:String},
    exam:{type:String,default:'0'},//0:none, 1: NEET, 2: Mains/AIEEE, 3: Advanced, 4: state pmt
    year:{type:Number,default:0}   
    
})



module.exports = mongoose.model('Question', QuestionSchema)