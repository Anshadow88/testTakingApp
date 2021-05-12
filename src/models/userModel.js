const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema( {
    name:{
        type:String,
        required: true,
        trim:true
        
    },
    role:{
        type: String,
        default: 'student' // or teacher or edp or admin

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
    password:{
        type:String,
        required:true,
        trim:true,
        minlength: 7,        
        validate(value){
            if(value.toLowerCase().includes('password')){
                throw new Error('Password cannot contain password')
            }
        }

    },
    questions: [{
        questionID:{
            type: String,
            required: true
        },
        correct:{
            type: Boolean

        }     

    }],
    testsTaken: [{
        testID:{
            type: String,
            required: true
        },
        marks:{
            type: Number

        },maxMarks:{
            type: Number
        }     

    }],
    tokens: [{
        token:{
            type: String,
            required: true
        }

    }]},
    {
    timestamps:true   
    
})

userSchema.virtual('tasks',{
    ref: 'Task',
    localField:'_id',
    foreignField: 'owner'
})

userSchema.methods.generateAuthToken = async function(){
    const user = this      
    const token = jwt.sign({_id: user._id.toString()},process.env.JWT_KEY)
   console.log(token)
   user.tokens = user.tokens.concat({token})
   await user.save()
   console.log('chk 32')   
   return token

}

    userSchema.statics.findByCredentials= async (email,password)=>{
    const user = await User.findOne({email})
   // console.log('Chk 1')
    if(!user) throw Error('Cound not Login')
   // console.log('Chk 2')
    const isMatch = await bcrypt.compare(password,user.password)
   // console.log('Chk 3')
    console.log(isMatch)

    if(!isMatch) throw Error('Cound not Login')

    return user
    }

    userSchema.methods.toJSON =function(){
            const user = this
            const userObject = user.toObject()

            delete userObject.password
            delete userObject.tokens
            delete userObject.avatar

            return userObject

    }


    userSchema.pre("remove",async function(next){
        const user = this
        await Task.deleteMany({owner: user._id})
        next()
    })
    

userSchema.pre("save",async function(next){
    const user = this
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password,8)
    }
    next()
})


const User = mongoose.model('User',userSchema)

module.exports = User