const jwt = require('jsonwebtoken')
const User = require('../models/userModel')

const auth = async(req,res,next)=>{
    try{
        const token= req.header('Authorization').replace('Bearer ','')
        console.log("A: "+token)
        const decoded = jwt.verify(token, process.env.JWT_KEY)
        console.log("B: "+decoded._id)
        const user = await User.findOne({_id: decoded._id,'tokens.token':token})
        console.log("found: "+user)
        if(!user)throw new Error()

        req.token = token
        req.user = user
        next()
    }
    catch(e){
        res.status(401).send('Please Authenticate')
    }
    
}


module.exports = auth