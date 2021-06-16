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

router.post('/loadTestForNewUser', async (req, res) => {
    console.log(req)
    try {
        const testName = req.body.name 
        const testPaper = await TestPaper.findOne({name:testName})   
        const testtime = testPaper.time
        let isGiven = false
        
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
            return res.status(200).json({questionsOfChapter,testPaperID,testtime,isGiven})
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

async function AddQuestionOfFileNameToTest(fileName,ExamName,examDescription,time){
    
    const allQuestions = await Questions.findOne({fileName:fileName})
    const newTest = new TestPaper()
    newTest.name = ExamName
    newTest.description = examDescription
    newTest.time = time
    allQuestions.forEach(ques=>{
        newTest.questions.push({'testName':test.name,'testID':test.id,'visibility':'0'})
        
    })
    await user.save() 
        
}

async function EditAllQuestionsOfAPaper(testName,exam,ExamYear,examDescription,time){
    
    const test = await TestPaper.findOne({name:examName})
    test.description = examDescription
    test.time = time
    test.year = ExamYear
    test.exam = exam

    await test.save() 
        
}


 




module.exports = router