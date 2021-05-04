const mongoose = require('mongoose')

const TestPaper= new mongoose.Schema({
     name:{
        type:String,
        required: true,
        trim:true        
    },
    questions: [{
        questionID:{type : String, required: true,},
        
    }],
    result:[{
        userID:{type :String,required:true},
        userName:{type:String, require:true},
        marksObtained:{type:Number},
        maxMarks:{type:Number,default:60},
        questions:[{questionID:{type:String,required:true},status:{type:String,default:'NA'}}]
    }]},
    {
        timestamps:true
    }
)         





module.exports = mongoose.model('TestPaper', TestPaper)