const express = require('express')
const router = express.Router()
const Question = require('./models/QuestionModel')
const auth = require('./middleware/auth')
const multer = require('multer')
var bodyParser = require('body-parser');
var mongoose = require('mongoose')
const fileUpload = require('express-fileupload')
 
var fs = require('fs');

router.use(fileUpload({
    createParentPath: true
}))

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

// get one quiz question by id
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

//post question image by id
router.post('/questions/:id/image', async (req, res) => {
    try {
        if(!req.files) {
            res.send({
                status: false,
                message: 'No file uploaded'
            });
        } else {
            //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
            let avatar = req.files.avatar;
            console.log('Picture Uploading....')
            //Use the mv() method to place the file in upload directory (i.e. "uploads")
            avatar.mv('./src/uploads/' + req.params.id+'.png');
            console.log('Picture Uploaded')
            //send response
            res.send({
                status: true,
                message: 'File is uploaded',
                data: {
                    name: avatar.name,
                    mimetype: avatar.mimetype,
                    size: avatar.size
                }
            });
        }
    } catch (err) {
        res.status(500).send(err);
    }
});


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
       //     console.log(req.body[update])
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

// this one is just a test
router.get('/', (req, res) => {
    res.send('H3ll0 W0RlD')
})


module.exports = router