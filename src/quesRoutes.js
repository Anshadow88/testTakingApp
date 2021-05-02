const express = require('express')
const router = express.Router()
const Question = require('./models/QuestionModel')
const auth = require('./middleware/auth')



// create one quiz question
router.post('/questions', async (req, res) => {
    try {
        console.log(req.body)
        const question = new Question(req.body)
        await question.save()
        return res.status(201).json(question)
    } catch (error) {
        return res.status(500).json({"error":error})
    }
})

// get one quiz question
router.get('/questions/:id', async (req, res) => {
    try {
        console.log(req.params)
        const _id = req.params.id 
        const question = await Question.findOne({_id})        
        if(!question){
            return res.status(404).json({})
        }else{
            return res.status(200).json(question)
        }
    } catch (error) {
        return res.status(500).json({"error":error})
    }
})

router.post('/questions/chapter',async (req, res) => {   
    try {

        const chapter = req.body.chapter       
        var questionsOfChapter = await Question.find({ chapter: chapter }).exec()           
        if(!questionsOfChapter){
            return res.status(404).json({})
        }else{
            return res.status(200).json(questionsOfChapter)
        }
    } catch (error) {
        return res.status(500).json({"error":error})
    }
})




// delete one quiz question
router.delete('/questions/:id', (req, res) => {

})

// this one is just a test
router.get('/', (req, res) => {
    res.send('H3ll0 W0RlD')
})


module.exports = router