const express = require('express')
const router = express.Router()

const TestPaper = require('./models/testPaperModel')
const Question = require('./models/QuestionModel')
const User = require('./models/userModel')

//GET ALL TESTS
router.get('/allTests', async (req, res) => {
    console.log('Hello')
    try {
        
        const allTests = await TestPaper.find()  
        return res.status(201).json(allTests)
    } catch (error) {
        return res.status(500).json({"error":error})
    }
})

router.post('/testPaper', async (req, res) => {
    console.log('Hello')
    try {
        console.log(req.body)
        const test = new TestPaper(req.body)
        await test.save()
        return res.status(201).json(test)
    } catch (error) {
        return res.status(500).json({"error":error})
    }
})

// get one quiz 

router.post('/testPaperWithNameForEditing', async (req, res) => {
    try {
       console.log(req.body)
        const testName = req.body.name 
        const testPaper = await TestPaper.findOne({name:testName})  

        
        let allQuestionsIDs=[]
        for(i=0;i<testPaper.questions.length;i++)
        {
               allQuestionsIDs.push(testPaper.questions[i].questionID)
               
        }
       // console.log(allQuestionsIDs)
        
        let questionsOfChapter = await Question.find({ _id:{$in: allQuestionsIDs}}).exec()
       
       // console.log(questionsOfChapter)
        
       // console.log(questionsOfChapter)

        if(!testPaper){
            return res.status(404).json({})
        }else{
            return res.status(200).json({questionsOfChapter})
        }
    } catch (error) {
        return res.status(500).json({"error":error})
    }
})
router.post('/testPaperWithName', async (req, res) => {
    try {
       // console.log(req.body)
        const testName = req.body.name 
        const testPaper = await TestPaper.findOne({name:testName})  

        let isGiven = false
        let previousAttempt
        for(j=0;j<testPaper['result'].length;j++)
        {
          //  console.log("105 "+testPaper['result'][j].userID)
           if(req.body.userID==testPaper['result'][j].userID)
           {
            // console.log("106")
             //console.log("this user has alreaddy given the test")
             previousAttempt = testPaper['result'][j].questions
             isGiven = true
            }
        }
        
        let allQuestionsIDs=[]
        for(i=0;i<testPaper.questions.length;i++)
        {
               allQuestionsIDs.push(testPaper.questions[i].questionID)
        }
        let questionsOfChapter = await Question.find({ _id:{$in: allQuestionsIDs}}).exec()
        let testPaperID = testPaper.id
        
       // console.log(questionsOfChapter)

        if(!testPaper){
            return res.status(404).json({})
        }else{
            return res.status(200).json({questionsOfChapter,testPaperID,isGiven,previousAttempt})
        }
    } catch (error) {
        return res.status(500).json({"error":error})
    }
})

//RESULT
router.post('/testPaperNameResult', async (req, res) => {
    try {
       // console.log(req.body)
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
// delete one Test Paper

router.patch('/testPaper/:id',async(req,res)=>{
    const updates = Object.keys(req.body)
   // console.log("101"+updates)
    try{
        const testPaper = await TestPaper.findOne({_id: req.params.id})
        if(!testPaper){return res.status(404).send()}
        testPaper['result'].push(req.body['result'][0])        

        await testPaper.save()
        
        const user = await User.findOne({_id: req.body['result'][0].userID})
        user.testsTaken.push({testID: testPaper.id,marks:req.body['result'][0].marksObtained, maxMarks:req.body['result'][0].maxMarks})
        await user.save()

        res.send(testPaper)

    }
    catch(e)
    {
        res.status(400).send(e)
    }

})



 




module.exports = router