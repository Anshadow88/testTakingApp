const express = require('express')
const router = new express.Router()
const User = require('./models/userModel')
const TestPaper = require('./models/testPaperModel')
const jwt = require('jsonwebtoken')
const auth = require('./middleware/auth.js')
const multer = require('multer')
const sharp = require('sharp')
//const {sendWelcomeEmail,sendCancellationEmail} = require('../email/account')

router.get('/test',(req,res)=>{
    res.send('This is a new router')
})

router.get('/users',auth,async (req,res)=>{
    try{
        const users = await User.find({})
        res.send(users)
    }catch(err){
        res.status(500).send()
    }
})

router.get('/users/:id',(req,res)=>{
    const _id = req.params.id
    User.findById(_id).then((user)=>{
        if(!user){
            return res.status(404).send()
        }
        res.send(user)
    }).catch((err)=>{
        return res.status(500).send()
    })
})

router.post('/users',async (req,res)=>{   
    const user = new User(req.body)
    try{ 
        await user.save()
        //sendWelcomeEmail(user.email,user.name)
        const token = await user.generateAuthToken()
         //console.log(token)
        // console.log('chk40')     
       res.status(201).send({user,token})
    } catch(err){
    res.status(400).send(err)
    }
})

router.post('/users/login', async(req,res)=>{
    try{
        //console.log("0")
        const user = await User.findByCredentials(req.body.email,req.body.password)        
        const token = await user.generateAuthToken() 
        //console.log("1")  
        res.status(200).send({user,token})
    
    }
    catch(e){
        res.status(400).send()
    }
})


const upload = multer({
    //dest: 'avatars',
    limit:{
        fileSize: 50000
    },
    fileFilter(req,file,cb){
        // cb(new Error('File must be a pdf'))
        // cb(undefined,true)
        // cb(undefined,false)
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/))
        {
            return cb(new Error('Plz upload jpg/jpeg/png file'))
        }
        cb(undefined,true)
    }
})

router.post('/users/avatar',auth,upload.single('avatar'), async(req,res)=>{
    const buffer = await sharp(req.file.buffer).resize({width:250,height:250}).png().toBuffer()
    
    req.user.avatar = buffer
    await req.user.save()
    res.send()
},(error,req,res,next)=>{
    res.status(400).send({error:error.message})
})

router.delete('/users/me/avatar/delete',auth,upload.single('avatar'), async(req,res)=>{
    req.user.avatar = undefined
    
    await req.user.save()
    res.send()
})

router.get('/users/:id/avatar', async(req,res)=>{
try{
    const user = await User.findById(req.params.id)

    if(!user||!user.avatar)
    {
        res.send(new Error())
    }
    res.set('Content-Type','image/png')
    res.send(user.avatar)
}
catch(e){
    res.status(404).send()
}

})

router.post('/users/logout',auth,async(req,res)=>{
    try{
            req.user.tokens = req.user.tokens.filter((token)=>{
                return token.token !== req.token
            })
            await req.user.save()
            res.send()
        }
    catch(e){
        res.status(500).send()

    }
})

router.post('/users/logoutAll',auth,async(req,res)=>{
    try{
            req.user.tokens = []
            await req.user.save()
            res.send()
        }
    catch(e){
        res.status(500).send()

    }
})

router.delete('/users/me',auth ,async(req,res)=>{
    try{
            // const user = await User.findByIdAndDelete(req.params.id)
            // if(!user){res.status(404).send()}
            //console.log('Delete Use 1')
            sendCancellationEmail(req.user.email,req.user.name)
            await req.user.remove()
            res.send(req.user)
    }
    catch(e){
        res.status(400).send()
    }
})


router.patch('/users/me',auth, async(req,res)=>{
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name','email','password','age']
    const isValidOperation = updates.every((update)=> allowedUpdates.includes(update))
        
    if(!isValidOperation){
        return res.status(400).send()
    }
    try{
        //const userNew = await User.findById(req.params.id)
            
        updates.forEach((update)=> {
            req.user[update] = req.body[update]
                    
        })
        
        await req.user.save()
        res.send(req.user)
        

    }
    catch(e)
    {
        res.status(400).send(e)
    }

})

//update TestResult of any new test given
router.patch('/userTestUpdate/:id',async(req,res)=>{
    const updates = Object.keys(req.body)
    console.log(updates)
    try{
        const user = await User.findOne({_id: req.params.id})
        if(!user){return res.status(404).send()}
        
        updates.forEach((update)=>{
            console.log(update)
            user[update] = req.body[update]
        })
        await user.save()
        //const task = await Task.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
        res.send(user)

    }
    catch(e)
    {
        res.status(400).send(e)
    }
})

//add new question & result to user data
router.patch('/userQuestionUpdate/:id',async(req,res)=>{
    const updates = Object.keys(req.body)
    console.log(updates)
    try{
        const user = await User.findOne({_id: req.params.id})
        if(!user){return res.status(404).send()}
        
        updates.forEach((update)=>{
            console.log(update)
            user[update] = req.body[update]
        })

        await user.save()
        //const task = await Task.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
        res.send(user)

    }
    catch(e)
    {
        res.status(400).send(e)
    }
})

router.patch('/logout/:id',async(req,res)=>{
    console.log('Logging out everyone by deleting all tokens')
    try{
        const user = await User.find({_id:req.params.id})
        
        user['tokens'] = []

        
        //const task = await Task.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
        res.send('Logged Out')

    }
    catch(e)
    {
        res.status(400).send(e)
    }
})

router.patch('/masterLogout',async(req,res)=>{
    console.log('Logging out everyone by deleting all tokens')
    try{
        const allUsers = await User.find()
        
        allUsers.forEach((user)=>{
            console.log(user.name)
            user['tokens'] = []
            user.save()
        })

        
        //const task = await Task.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
        res.send('Everyone Logged Out')

    }
    catch(e)
    {
        res.status(400).send(e)
    }
})



// async function AllUsersUpdateTheirResults()
// {
//     const allUsers = await User.find()
//     allUsers.forEach(user=>{
//         //console.log(user.id)
//         OneUserUpdateTheirResults(user.id)
//     })
// }

// async function OneUserUpdateTheirResults(id)
// {
//     const user = await User.findOne({_id:id})
//     if(!user) return('Cant find this user')

//     const allTests = await TestPaper.find()
//     console.log(allTests.length)
//     allTests.forEach((test)=>{
//       //  console.log(test.name+' has '+test.result.length+' Results stored')
//         test.result.forEach((re) => {
//            // console.log(re.userID)
//             if(re.userID==id)
//             {
//                 console.log(user.name)
//                 console.log(user.testsTaken)
//                 user.testsTaken.push({testID: test.id,marks:re.marksObtained, maxMarks:re.maxMarks})
//             }
//         });


//     })
//     await user.save()
// }

// AllUsersUpdateTheirTestName()

// async function AllUsersUpdateTheirTestName()
// {
//     const allUsers = await User.find()
//     allUsers.forEach(user=>{
//         //console.log(user.id)
//         OneUserUpdateAllTestsName(user.id)
//     })
// }

// async function OneUserUpdateAllTestsName(id)
// {
//     const user = await User.findOne({_id:id})
//     for(i=0;i<user.testsTaken.length;i++)
//     {
//         OneUserUpdateTheirSingleTestName(id,i)
//     }

// }

// async function OneUserUpdateTheirSingleTestName(id,testNo)
// {
//     console.log('HERE')
//     const user = await User.findOne({_id:id})
//     if(!user) return('Cant find this user')
//     console.log(user.name)
//     const foundtest = await TestPaper.findOne({_id:user.testsTaken[testNo].testID})
//     if(!foundtest) 
//     return('Not Goven This Test')
//     console.log(user.testsTaken[testNo].id)
//     console.log(foundtest.name)
        
//     user.testsTaken[testNo].testName= foundtest.name;
      
//     await user.save()
// }



module.exports = router