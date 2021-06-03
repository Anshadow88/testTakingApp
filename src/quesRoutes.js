const express = require('express')
const router = express.Router()
const Question = require('./models/QuestionModel')
const auth = require('./middleware/auth')
const multer = require('multer')
const upload = multer({dest:'./src/uploads/'})
const {uploadFile,getFileStream} = require('./imageRoute')
 
var fs = require('fs');



// create one quiz question
router.post('/questions', async (req, res) => {
    try {
        console.log(req.body)
        const question = new Question(req.body)
        await question.save()
        console.log(question._id)
        return res.status(201).json(question)
    } catch (error) {
        return res.status(500).json({"error":error})
    }
})

// get one question by id
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


router.post('/questions/:id/image',upload.single('avatar'),async (req,res)=>{
        const file = req.file
        console.log(file)
        const result = await uploadFile(file)//to AWS
        
        console.log('103'+file)
        res.send(file)
})

router.get('/uploads/:id',async (req,res)=>{
    const file = await getFileStream(req.params.id)//from AWS
    console.log('Failing Here')
    console.log(file)
    file.pipe(res)
})

//get all questions of a chapter
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

router.post('/questions/author',async (req, res) => {   
    try {
        console.log(req.body)
        const author = req.body.author       
        var questionsOfChapter = await Question.find({ author: author }).exec()           
        if(!questionsOfChapter){
            return res.status(404).json({})
        }else{
            return res.status(200).json(questionsOfChapter)
        }
    } catch (error) {
        return res.status(500).json({"error":error})
    }
})

router.post('/questions/examYear',async (req, res) => {   
    try {
       // console.log(req.body)
        const exam = req.body.exam  
        const year = req.body.year  
        const chapter = req.body.chapter
        var questionsOfExamYear = await Question.find({ exam: exam,year: year,chapter:chapter }).exec()   
       // console.log(questionsOfExamYear)
        if(!questionsOfExamYear){
            return res.status(404).json({})
        }else{
            return res.status(200).json(questionsOfExamYear)
        }
    } catch (error) {
        return res.status(500).json({"error":error})
    }
})

router.post('/findQuestions',async (req, res) => {   
    try {
        console.log(req.body)
        const exam = req.body.exam  
        const year = req.body.year     
        const chapter = req.body.chapter
        const author = req.body.author
        var questionsFound        
        
        if(exam!='undefined'&&year!='undefined'&&author!='')
        { questionsFound = await Question.find({author: author,exam: exam,year:year }).exec()   }
        
        else if(year!='undefined'&&author!='')
        { questionsFound = await Question.find({author: author,year:year }).exec()   }
        else  if(exam!='undefined'&&author!='')
        { questionsFound = await Question.find({author: author,exam: exam }).exec()   }
        
        else if(exam!='undefined'&&year!='undefined'&&chapter!='undefined')
        { questionsFound = await Question.find({chapter: chapter,exam: exam,year:year }).exec()   
         console.log('111')}           
        else if(exam!='undefined'&&year!='undefined')
        {questionsFound = await Question.find({exam: exam,year:year }).exec()     
        console.log('112')}
        else if(exam!='undefined'&&chapter!='undefined')
        {questionsFound = await Question.find({exam: exam,chapter:chapter }).exec()
        console.log('113')}
        else if(chapter!='undefined')
        {questionsFound = await Question.find({chapter:chapter }).exec()    
        console.log('114')}
        else 
        {questionsFound = await Question.find({exam:exam }).exec()      
        console.log('115')}
        
        
       // console.log(questionsFound[0])
        
       // console.log(questionsOfExamYear)
        if(!questionsFound){
            return res.status(404).json({})
        }else{
            return res.status(200).json(questionsFound)
        }
    } catch (error) {
        return res.status(500).json({"error":error})
    }
})


//update a question 
router.patch('/questionUpdate/:id',async(req,res)=>{
    
    const updates = Object.keys(req.body)
  //  console.log("101 ="+updates)
    try{
       // console.log("102")
        const question = await Question.findOne({_id: req.params.id})
       // console.log("103")
        if(!question){return res.status(404).send()}
      //  console.log("104")
        
        updates.forEach((update)=>{
             question[update] = req.body[update]
        })      

        await question.save()
        res.send(question)

    }
    catch(e)
    {
        res.status(400).send(e)
    }

})

router.delete('/questions/:id', (req, res) => {

})

// ALLAuthorNamesChange('unknown','anshul4275')

// async function ALLAuthorNamesChange(originalName,newName)
// {
//     const allQuestion = await Question.find({author:originalName})

//     allQuestion.forEach(ques=>{
//         OneAuthorNamesChange(ques.id,newName)

//     })

// }
// async function OneAuthorNamesChange(id,newName)
// {
//     let question = await Question.findOne({_id:id})   
//     question.author = newName

//     await question.save()   

// }



// async function ALLQuestionsSubjectChange()
// {
//     const allQuestion = await Question.find()
//     let count=0
//     allQuestion.forEach(ques=>{
//         OneQuestionsSubjectChange(ques.id)
//         count++
//         console.log(count)

//     })

// }
// async function OneQuestionsSubjectChange(id)
// {
//     let question = await Question.findOne({_id:id})   
//     if(question.subject=='')
//     question.subject = 'Physics'

//     await question.save()   

// }


module.exports = router