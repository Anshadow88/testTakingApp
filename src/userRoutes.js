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
    //console.log(user)
    //user.teachers.push({'teacherID':teacherID})
    //console.log(user)
    try{ 
        await user.save()
        //sendWelcomeEmail(user.email,user.name)
        user.teachers.push({'teacherID':teacherID})
       // console.log('29')
        const token = await user.generateAuthToken()
         //console.log(token)
        //console.log('chk40')     
       res.status(201).send({user,token})
    } catch(err){
    res.status(400).send(err)
    }
})

router.post('/removeMyStudent/:id',async (req,res)=>{   
   // console.log(req.body)
    try{ 
        const user = await User.findOne({name:req.body.name,email:req.body.email})
        const teacherID = req.params.id
       /// console.log(user)        
        user.teachers.pop({'teacherID':teacherID})
       // console.log(user)
        await user.save()
      //  console.log('chk40')     
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
       // console.log(user.students)  
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

router.get('/studentAvailibleTests/:id',async(req,res)=>{
    const user = await User.findOne({_id:req.params.id})
    if(!user) return res.status(404).send('No User')
    
    const testAvailable = user.testAvailable
    //console.log(user)
     return res.status(200).send(testAvailable)

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
    try{
        console.log(req.body)
        const user = await User.findOne({_id: req.params.id})
        if(!user){return res.status(404).send()}
        let firstTry=true
        user.result.forEach(result=>{
            //console.log(result.testID+' = '+req.body.testID)
            if(result.testID==req.body.testID)
            firstTry=false
        })

        if(firstTry)
        user.result.push({'testID':req.body.testID,'testName':req.body.testName,'marks':req.body.marks,
                        'maxMarks':req.body.maxMarks,'questions':req.body.questions})
        
        await user.save()
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
  //  console.log(updates)
    try{
        const user = await User.findOne({_id: req.params.id})
        if(!user){return res.status(404).send()}
        
        updates.forEach((update)=>{
         //   console.log(update)
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

//seend this test to all my students of BATCH
router.post('/teacherSendTestToBatch/:id',async(req,res)=>{
    console.log(req.body)
    const teacher = await User.findOne({_id:req.params.id})
    const test = await TestPaper.findOne({_id:req.body.testID})
    
    if(!teacher||!test)return res.status(404).send('No User found or No Test Found')

    teacher.students.forEach(student=>{
        console.log(student)
        if(student.batch==req.body.batch)
        {
        AddTestPaperToStudent(student.studentID,test.id,test.name,teacher.id,teacher.name,test.description)
        }
    })

    res.status(200).send('DONE')
})

async function AddTestPaperToStudent(studentID,testID,testName,teacherID,teacherName,testDescription){
    //console.log('Here: '+studentID)
    const student = await User.findOne({_id:studentID})
   
    
    
    const newTestData = {'testID':testID,'testName':testName,'teacherID':teacherID,'teacherName':teacherName,'testDescription': testDescription}

    student.testAvailable.push(newTestData)
    await student.save()
}

//seend this test to all my students of BATCH
router.post('/teacherRemoveTestToBatch/:id',async(req,res)=>{
    console.log(req.body)
    const teacher = await User.findOne({_id:req.params.id})
    const test = await TestPaper.findOne({_id:req.body.testID})
    
    if(!teacher||!test)return res.status(404).send('No User found or No Test Found')

    teacher.students.forEach(student=>{
        //console.log(student)
        if(student.batch==req.body.batch)
        {
        RemoveTestPaperToStudent(student.studentID,test.id,test.name,teacher.id,teacher.name)
        }
    })

    res.status(200).send('DONE')
})

async function RemoveTestPaperToStudent(studentID,testID,testName,teacherID,teacherName){
    console.log('Here: '+studentID)
    const student = await User.findOne({_id:studentID})

    
    student.testAvailable.forEach(test=>{
        if(test.testID==testID)
        {
            student.testAvailable.pop(test)
        }
    })
    
    await student.save()
}

//teacher get Results of His Student
router.post('/teacherGetTestResults/:id',async(req,res)=>{
    console.log(req.body)
    const teacher = await User.findOne({_id:req.params.id})
    const allStudents = await User.find({teachers:{$elemMatch:{teacherID:teacher.id}}})
   // db.users.find({awards: {$elemMatch: {award:'National Medal', year:1975}}})
    const batchWiseStudents = teacher.students
    
    if(!teacher)return res.status(404).send('No Teacher found')

    const resultdata =[]
    allStudents.forEach(student=>{
        let batch
        batchWiseStudents.forEach(myStud=>{
            if(myStud.studentID==student.id)
            batch = myStud.batch
        })
        student.result.forEach(result=>{
            resultdata.push({'student':student.name,'testName':result.testName,'marks':result.marks,'maxMarks':result.maxMarks,'batch':batch})
        })
    })
    
    res.status(200).send(resultdata)
})





//Add This Admin Test To Teachers Tests

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


// async function ALLUserFindHisResultAndSaveIt(){
//     const allUsers = await User.find()
//     allUsers.forEach(user=>{
//         OneUserFindHisResultAndSaveIt(user.id)
//     })

// }

// async function OneUserFindHisResultAndSaveIt(id)
// {
//     const user= await User.findOne({_id:id})
//     const allTests = await TestPaper.find()
//     allTests.forEach(test=>{
//         test.result.forEach(result=>{
//             console.log()
//             if(result.userID==id)
//             {
//                 user.result.push({'testID':test.id,'testName':test.name,'marks':result.marksObtained
//                                 ,'maxMarks': result.maxMarks,'questions': result.questions})
//             }
//         })
//     })
//     user.save()

// }

module.exports = router