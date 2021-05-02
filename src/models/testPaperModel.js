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
        marksObtained:{type:Number},
        maxMarks:{type:Number,default:60}
        // inCorrect:[{questionID:{type:String,required:true}}]
    }]},
    {
        timestamps:true
    }
)         





module.exports = mongoose.model('TestPaper', TestPaper)