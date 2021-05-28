const express = require('express')
const router = new express.Router()
const User = require('./models/userModel')
const TestPaper = require('./models/testPaperModel')
const jwt = require('jsonwebtoken')
const auth = require('./middleware/auth.js')
const multer = require('multer')
const sharp = require('sharp')
//const {sendWelcomeEmail,sendCancellationEmail} = require('../email/account')


router.get('/users',auth,async (req,res)=>{
    try{
        const users = await User.find({})
        res.send(users)
    }catch(err){
        res.status(500).send()
    }
})

//Get a User
router.get('/users/:id',async (req,res)=>{
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

router.get('/getStudentsOfTeacher/:id',async (req,res)=>{
    try{
    
    const teacherID = req.params.id
   // console.log('Finding Students of '+teacherID)
    const myStudents = await User.find({teachers: {$elemMatch: {teacherID:teacherID}}})
    //console.log(myStudents)
    
    if(!myStudents) res.status(404).send()
    else
    res.status(200).send(myStudents)   
    }
    catch(e)
    {
        res.status(400).send(e)
    }

})

//Create a User
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

router.post('/addMyStudent/:id',async (req,res)=>{   
    const user = new User(req.body)
    const teacherID = req.params.id
    console.log(user)
    //user.teachers.push({'teacherID':teacherID})
    //console.log(user)
    try{ 
        await user.save()
        //sendWelcomeEmail(user.email,user.name)
        user.teachers.push({'teacherID':teacherID})
        console.log('29')
        const token = await user.generateAuthToken()
         //console.log(token)
        console.log('chk40')     
       res.status(201).send({user,token})
    } catch(err){
    res.status(400).send(err)
    }
})

router.post('/removeMyStudent/:id',async (req,res)=>{   
    console.log(req.body)
    try{ 
        const user = await User.findOne({name:req.body.name,email:req.body.email})
        const teacherID = req.params.id
        console.log(user)        
        user.teachers.pop({'teacherID':teacherID})
        console.log(user)
        await user.save()
        console.log('chk40')     
       res.status(201).send(user)
    } catch(err){
    res.status(400).send(err)
    }
})
//User Login
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
//Upload Photo
router.post('/users/avatar',auth,upload.single('avatar'), async(req,res)=>{
    const buffer = await sharp(req.file.buffer).resize({width:250,height:250}).png().toBuffer()
    
    req.user.avatar = buffer
    await req.user.save()
    res.send()
},(error,req,res,next)=>{
    res.status(400).send({error:error.message})
})
//DeletePhoto
router.delete('/users/me/avatar/delete',auth,upload.single('avatar'), async(req,res)=>{
    req.user.avatar = undefined
    
    await req.user.save()
    res.send()
})
//Get Photo
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
//LOGOUT
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
//LOGOUT ALL
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
//DELETE USER SELF
router.delete('/users/me',auth ,async(req,res)=>{
    try{
            // const user = await User.findByIdAndDelete(req.params.id)
            // if(!user){res.status(404).send()}
            //console.log('Delete Use 1')
            //sendCancellationEmail(req.user.email,req.user.name)
            await req.user.remove()
            res.send(req.user)
    }
    catch(e){
        res.status(400).send()
    }
})

//UPDATE USER
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

//LogOut ME
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

//Logout EveryOne
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

// AllUsersUpdateTheirTeacherID('60ad429f93141d0015f8f4e5')

// async function AllUsersUpdateTheirTeacherID(teacherID)
// {
//     const allUsers = await User.find()
//    allUsers.forEach(user=>{
//        console.log(user.id)
//        OneUserUpdateTheirTeacherID(user.id,teacherID)

//     })
// }
// async function OneUserUpdateTheirTeacherID(id,teacherID)
// {
//     const user = await User.findOne({_id:id})
//     if(!user) return('Cant find this user')
//     else
//     {
//         user.teachers=[]
//         user.teachers.push({'teacherID':teacherID})
//     }

//     await user.save()
// }




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