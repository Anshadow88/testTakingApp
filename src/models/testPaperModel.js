const mongoose = require('mongoose')

const TestPaper= new mongoose.Schema({
     name:{
        type:String,
        required: true,
        trim:true        
    },
    subject:{
        type:String//Physics,Chemisty,Maths,PCM,PCB

    },
    chapter:{
        type: String //1to20
    },
    testType:{
        type:String, //1:Examwise 2: Chapterwise 3: Topicwise

    },
    
    time:{
        type:Number 
    },
    description:{
        type:String, //0. TeacherMade //1. Pastyearpaper 2.chapterwiseJEE 3. chapterwiseNEET 4.
    },
    exam:{type:String},
    year:{type:Number},

    author:{
        type:String,
        default:'unknown'
    },
    questions: [{
        questionID:{type : String, required: true,},
        
    }],
    time: {
        type:Number,
        default:60
    }},
    {
        timestamps:true
    }
)         





module.exports = mongoose.model('TestPaper', TestPaper)