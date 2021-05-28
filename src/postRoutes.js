const express = require('express')
const router = express.Router()
const Question = require('./models/QuestionModel')
const auth = require('./middleware/auth')
const multer = require('multer')
const upload = multer({dest:'./src/uploads/'})
const {uploadFile,getFileStream} = require('./imageRoute')
 
var fs = require('fs');


router.post('/posts', async (req, res) => {
    try {
        console.log(req.body)
        const post = new Question(req.body)
        await post.save()
        console.log(post._id)
        return res.status(201).json(post)
    } catch (error) {
        return res.status(500).json({"error":error})
    }
})

// get one post by id
router.get('/posts/:id', async (req, res) => {
    try {
        console.log(req.params)
        const _id = req.params.id 
        const post = await Question.findOne({_id})        
        if(!post){
            return res.status(404).json({})
        }else{
            return res.status(200).json(post)
        }
    } catch (error) {
        return res.status(500).json({"error":error})
    }
})


router.post('/posts/:id/image',upload.single('avatar'),async (req,res)=>{
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

//get all posts of a chapter
router.post('/posts/chapter',async (req, res) => {   
    try {

        const chapter = req.body.chapter       
        var postsOfChapter = await Question.find({ chapter: chapter }).exec()           
        if(!postsOfChapter){
            return res.status(404).json({})
        }else{
            return res.status(200).json(postsOfChapter)
        }
    } catch (error) {
        return res.status(500).json({"error":error})
    }
})

router.post('/posts/author',async (req, res) => {   
    try {
        console.log(req.body)
        const author = req.body.author       
        var postsOfChapter = await Question.find({ author: author }).exec()           
        if(!postsOfChapter){
            return res.status(404).json({})
        }else{
            return res.status(200).json(postsOfChapter)
        }
    } catch (error) {
        return res.status(500).json({"error":error})
    }
})

router.post('/posts/examYear',async (req, res) => {   
    try {
       // console.log(req.body)
        const exam = req.body.exam  
        const year = req.body.year  
        const chapter = req.body.chapter
        var postsOfExamYear = await Question.find({ exam: exam,year: year,chapter:chapter }).exec()   
       // console.log(postsOfExamYear)
        if(!postsOfExamYear){
            return res.status(404).json({})
        }else{
            return res.status(200).json(postsOfExamYear)
        }
    } catch (error) {
        return res.status(500).json({"error":error})
    }
})

router.post('/findQuestions',async (req, res) => {   
    try {
        //console.log(req.body)
        const exam = req.body.exam  
        const year = req.body.year     
        const chapter = req.body.chapter
        var postsFound        
        if(chapter=='undefined'&&year=='undefined')
        postsFound = await Question.find({exam: exam }).exec()   
        else if(exam=='undefined')
        postsFound = await Question.find({chapter: chapter }).exec()   
        else if(year=='undefined')
        postsFound = await Question.find({chapter: chapter,exam: exam }).exec() 
        else if(chapter=='undefined')
        postsFound = await Question.find({exam: exam, year:year }).exec()           
        else
        postsFound = await Question.find({chapter: chapter,exam: exam,year:year }).exec()     
        
        //console.log(postsFound)
        
       // console.log(postsOfExamYear)
        if(!postsFound){
            return res.status(404).json({})
        }else{
            return res.status(200).json(postsFound)
        }
    } catch (error) {
        return res.status(500).json({"error":error})
    }
})


//update a post 
router.patch('/postUpdate/:id',async(req,res)=>{
    
    const updates = Object.keys(req.body)
  //  console.log("101 ="+updates)
    try{
       // console.log("102")
        const post = await Question.findOne({_id: req.params.id})
       // console.log("103")
        if(!post){return res.status(404).send()}
      //  console.log("104")
        
        updates.forEach((update)=>{
             post[update] = req.body[update]
        })      

        await post.save()
        res.send(post)

    }
    catch(e)
    {
        res.status(400).send(e)
    }

})

router.delete('/posts/:id', (req, res) => {

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
//     let post = await Question.findOne({_id:id})   
//     post.author = newName

//     await post.save()   

// }


module.exports = router