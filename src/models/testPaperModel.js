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
    time:{
        type:Number 
    },
    description:{
        type:String, //0. TeacherMade //1. Pastyearpaper 2.chapterwiseJEE 3. chapterwiseNEET 4.
    },
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