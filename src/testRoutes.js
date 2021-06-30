const express = require('express')
const router = express.Router()

const TestPaper = require('./models/testPaperModel')
const Question = require('./models/QuestionModel')
const User = require('./models/userModel')

//GET ALL TESTS
router.get('/allTests', async (req, res) => {
    //console.log('Hello')
    try {
        
        const allTests = await TestPaper.find()  
        return res.status(201).json(allTests)
    } catch (error) {
        return res.status(500).json({"error":error})
    }
})
//Add New Test
router.post('/testPaper', async (req, res) => {
    console.log(req.body)
    try {
        const test = new TestPaper(req.body)
        await test.save()
        const user = await User.findOne({_id:req.body.author})
        
        user.testPaper.push({'testName':test.name,'testID':test.id,'visibility':'0'})
        await user.save()
        return res.status(201).json(test)
    } catch (error) {
        return res.status(500).json({"error":error})
    }
})

//get Test for DPP MAking
router.get('/test/:name',async (req,res)=>{
    try{
    const test = await TestPaper.findOne({name:req.params.name})
  //  console.log(test)

    return res.render('test',{
        testName: req.params.name,
        testQuesIDs : test.questions

        })
    }
    catch{}
})
// get One Test For QUESTION Editing
router.post('/testPaperWithNameForEditing', async (req, res) => {
    try {
     //  //console.log(req.body)
        const testName = req.body.testName 
        const testPaper = await TestPaper.findOne({name:testName})  
        
        let allQuestionsIDs=[]
        for(i=0;i<testPaper.questions.length;i++)
        {
               allQuestionsIDs.push(testPaper.questions[i].questionID)
               
        }        
        let questionsOfChapter = await Question.find({ _id:{$in: allQuestionsIDs}}).exec()
      //  //console.log(questionsOfChapter)
        if(!testPaper){
            return res.status(404).json({})
        }else{
            return res.status(200).json({questionsOfChapter})
        }
    } catch (error) {
        return res.status(500).json({"error":error})
    }
})

//get Test Paper for PAPER Editing
router.post('/LoadOldTestPaperForPaperEditing/:id', async (req, res) => {
    try {
        const teacher = await User.findOne({_id:req.params.id})
        //console.log(teacher.id)
        const testPaper = await TestPaper.findOne({name:req.body.testName})
        //console.log(testPaper.author)
        if(testPaper.author!=teacher.id)
        {
            return res.status(400).send()
        }
        

        if(!testPaper){
            return res.status(404).json({})
        }else{
            return res.status(200).json(testPaper)
        }
    } catch (error) {
        return res.status(500).json({"error":error})
    }
})

//Get One Test For Student Sovling DO NOT CHANGE THIS
router.post('/testPaperWithName/:id', async (req, res) => {
    console.log(req)
    try {
        const student = await User.findOne({_id:req.params.id})
        const testName = req.body.name 
        const testPaper = await TestPaper.findOne({name:testName})   
        const testtime = testPaper.time
        let isGiven = false
        
            const previousAttempt=[]
            student.result.forEach(result=>{
                console.log(result.testID+' == '+testPaper.id)
                if(result.testID==testPaper.id)
                {   
                    isGiven = true
                    result.questions.forEach(q=>{
                        previousAttempt.push(q.status)
                        //console.log(q)
                    })
                }
                console.log(previousAttempt)                   

            })
        

        let allQuestionsIDs=[]
        for(i=0;i<testPaper.questions.length;i++)
        {
               allQuestionsIDs.push(testPaper.questions[i].questionID)
        }
        let questionsOfChapter = await Question.find({ _id:{$in: allQuestionsIDs}}).exec()
        let testPaperID = testPaper.id
        if(!testPaper){
            return res.status(404).json({})
        }else{
            return res.status(200).json({questionsOfChapter,testPaperID,testtime,isGiven,previousAttempt})
        }
    } catch (error) {
        return res.status(500).json({"error":error})
    }
})

router.post('/getTestForGuest', async (req, res) => {
    console.log(req.body)
    try {
        const temp = req.body.name.replace(/&amp;/,'&')
        console.log('Trimmed Name: '+temp)
        const testName = temp
        const testPaper = await TestPaper.findOne({name:testName})   
        console.log('Found Paper: '+testPaper)
        const testtime = testPaper.time
        const testDescription = testPaper.description
       
        
        let allQuestionsIDs=[]
        for(i=0;i<testPaper.questions.length;i++)
        {
               allQuestionsIDs.push(testPaper.questions[i].questionID)
        }

        let questionsOfChapter = await Question.find({ _id:{$in: allQuestionsIDs}}).exec()
        let testPaperID = testPaper.id
        if(!testPaper){
            return res.status(404).json({})
        }else{
            return res.status(200).json({allQuestionsIDs,questionsOfChapter,testPaperID,testtime,testDescription})
        }
    } catch (error) {
        return res.status(500).json({"error":error})
    }
})

//GET Test Paper Details
router.post('/testPaperDetails', async (req, res) => {
    console.log(req.body)
    try {
        const testName = req.body.name 
        const testPaper = await TestPaper.findOne({name:testName})   
        const testTime = testPaper.time
        const testDescription = testPaper.description
        const questionCount = testPaper.questions.length
        
        let testPaperID = testPaper.id
        if(!testPaper){
            return res.status(404).json({})
        }else{
            return res.status(200).json({testName,testPaperID,testTime,testDescription,questionCount})
        }
    } catch (error) {
        return res.status(500).json({"error":error})
    }
})


//Get RESULT Of All Students
router.post('/testPaperNameResult', async (req, res) => {
    try {
       // //console.log(req.body)
        const testName = req.body.name 
        const testPaper = await TestPaper.findOne({name:testName})  

              
        let allStudentNames=[]
        let allStudentsMarks=[]
        let maxMarks = testPaper['result'][0].maxMarks
        for(i=0;i<testPaper.result.length;i++)
        {
               allStudentNames.push(testPaper['result'][i].userName)
               allStudentsMarks.push(testPaper['result'][i].marksObtained)
        }
        
      

        if(!testPaper){
            return res.status(404).json({})
        }else{
            return res.status(200).json({allStudentNames,allStudentsMarks,maxMarks})
        }
    } catch (error) {
        return res.status(500).json({"error":error})
    }
})

//Get Result Of One Student :ID of User

router.post('/testPaperName/:id', async (req, res) => {
    try {
       // //console.log(req.body)
        const testName = req.body.name 
        const testPaper = await TestPaper.findOne({name:testName})  

        if(!testPaper){
            return res.status(404).json('Test Not Found')
        }

        let userResult = []
        testPaper.results.forEach(result=>{
            if(result.userID==req.params.id)
            userResult=result
            return res.status(200).json(userResult)
        })

        return res.status(404).json('User havent taken this test')
        
        
        
    } catch (error) {
        return res.status(500).json({"error":error})
    }
})

//Updating Result Of One Student
router.patch('/testPaper/:id',async(req,res)=>{
    const updates = Object.keys(req.body)
   // //console.log("101"+updates)
    try{
        const testPaper = await TestPaper.findOne({_id: req.params.id})
        if(!testPaper){return res.status(404).send()}
        testPaper['result'].push(req.body['result'][0])        

        await testPaper.save()
        
        const user = await User.findOne({_id: req.body['result'][0].userID})
        user.testsTaken.push({testID: testPaper.id,testName: testPaper.name,marks:req.body['result'][0].marksObtained, maxMarks:req.body['result'][0].maxMarks})
        await user.save()

        res.send(testPaper)

    }
    catch(e)
    {
        res.status(400).send(e)
    }

})

//Update A Test Paper
router.patch('/EditOldNewTestPaper',async(req,res)=>{
    const updates = Object.keys(req.body)
    console.log("101"+updates)
    try{
        const test = await TestPaper.findOne({name: req.body.name})
        console.log('102'+test.name)
        updates.forEach((update)=> {
            test[update] = req.body[update]
            console.log(update)  
        })
        console.log('103')
        await test.save()     
        res.status(200).send(test)

    }
    catch(e)
    {
        res.status(400).send(e)
    }

})

//Get All Test of One Teacher Sovling
router.get('/testTestsOfTeacher/:id', async (req, res) => {
    ////console.log('1')
    try {
        const allTestsOfTeacher = await TestPaper.find({author:req.params.id})       
        
        
       return res.json(allTestsOfTeacher)
 
     } catch (error) {
         return res.status(500).json({"error":error})
     }
})


//Get All Test of One Teacher Sovling
router.get('/testTestsOfAdmin', async (req, res) => {
    ////console.log('1')
    try {
       const allTestsOfTeacher = await TestPaper.find({author:'60b3cba514a1d30015a8d0de'})
       
       
      return res.json(allTestsOfTeacher)

    } catch (error) {
        return res.status(500).json({"error":error})
    }
})












// MakeNewTest('IITJEE2013.pdf','IIT JEE mains 2013','30 Questions in 90 minutes',90)


async function AddExamNameandYearToQuestion(){
    const allTests = await TestPaper.find()
    let examName //1or 2 or 3
    let examYear //2001-21
    allTests.forEach(test=>{
        if(test.name.includes('Main')){examName = '2',parseInt(examYear=(test.name.substr(8,4)))}

        else if(test.name.includes('NEET')){examName = '1',parseInt(examYear=(test.name.substr(4,4)))}
        else if(test.name.includes('Advance')){examName = '3',parseInt(examYear=(test.name.substr(11,4)))}
        //else console.log(test.name+' NOT IDENTIFIED')
        console.log(test.name+' '+examYear)
        EditAllTests(test.name,examName,examYear)
    })
    
    
        
}

async function EditAllTests(testName,exam,examYear,examDescription,time){
    
    const test = await TestPaper.findOne({name:testName})
    test.description = examDescription
    test.time = time
    test.exam = exam
    test.year = examYear

    await test.save() 
        
}

async function EditAllQuestionsOfATest(){
    
    const allTests = await TestPaper.find({author:'60b3cba514a1d30015a8d0de'})
    allTests.forEach(test=>{
        test.questions.forEach(ques=>{
            EditOneQuestion(ques.questionID,test.name,test.year)
        })
    })

    
        
}

async function EditOneQuestion(questionID,exam,year){
    
    const ques = await Question.findOne({_id:questionID})
    if(ques){
    ques.exam = exam
    ques.year = year
    console.log('1')
    await ques.save()
    }
    

    
        
}

 




module.exports = router