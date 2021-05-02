const express = require('express')
const router = express.Router()

const TestPaper = require('./models/testPaperModel')
const Question = require('./models/QuestionModel')

//ADD NEW QUESTIONS
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
router.post('/testPaperWithName', async (req, res) => {
    try {
        console.log(req.body)
        const testName = req.body.name 
        const testPaper = await TestPaper.findOne({name:testName})  
        
        let allQuestionsIDs=[]
        for(i=0;i<testPaper.questions.length;i++)
        {//var questionsOfChapter = await Question.find({ _id:testPaper.questions[i].questionID }).exec()
            allQuestionsIDs.push(testPaper.questions[i].questionID)
        }
        //console.log(allQuestions)
        var questionsOfChapter = await Question.find({ _id:{$in: allQuestionsIDs}}).exec()
        
       // console.log(questionsOfChapter)

        if(!testPaper){
            return res.status(404).json({})
        }else{
            return res.status(200).json(questionsOfChapter)
        }
    } catch (error) {
        return res.status(500).json({"error":error})
    }
})

// delete one Test Paper

router.patch('/testPaper/:id',async(req,res)=>{
    const updates = Object.keys(req.body)
    console.log(updates)
    try{
        const testPaper = await TestPaper.findOne({_id: req.params.id})
        if(!testPaper){return res.status(404).send()}
        
        updates.forEach((update)=>{
            console.log(update)
            testPaper[update] = req.body[update]
        })

        await testPaper.save()
        //const task = await Task.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
        res.send(testPaper)

    }
    catch(e)
    {
        res.status(400).send(e)
    }

})




module.exports = router