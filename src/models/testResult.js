const mongoose = require('mongoose')

const testResult= new mongoose.Schema({
     name:{
        type:String,
        required: true,
        trim:true
        
    },
    email:{
        type: String,
        unique: true,
        required: true,
        trim:true,
        lowercase:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Email is not Correct')
            }
        }
    },
    questionsAttempted: [{
        questionID:{
            type : String,
            required: true,
        },
        attemped:{            
            type:Boolean,
            default:false,
        },
        result:{
            type:Boolean,
            default:false
        },
        timeTaken:{
            time:Number,
            default: "0"
        }
    }]},
    {
        timestamps:true
    }
)         





module.exports = mongoose.model('Question', QuestionSchema)