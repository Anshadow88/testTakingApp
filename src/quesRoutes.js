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
// router.post('/questions/:id/image', async (req, res) => {
//     try {
//         if(!req.files) {
//             res.send({
//                 status: false,
//                 message: 'No file uploaded'
//             });
//         } else {
//             let avatar = req.files.avatar;
//             avatar.mv('./src/uploads/' + req.params.id+'.png');
//             console.log(avatar)
//             const result = await uploadFile(avatar)
//             console.log(result)
//             //send response
//             res.send({
//                 status: '200',
//                 message: 'File is uploaded',
//                 data: {
//                     name: avatar.name,
//                     mimetype: avatar.mimetype,
//                     size: avatar.size
//                 }

//             });
//         }
//     } catch (err) {
//         res.status(500).send(err);
//     }
// });

router.post('/questions/:id/image',upload.single('avatar'),async (req,res)=>{
        const file = req.file
        console.log(file)
        const result = await uploadFile(file)//to AWS
        
        console.log('103'+file)
        res.send(file)
})

router.get('/uploads/:id',async (req,res)=>{
    const file = await getFileStream(req.params.id)//from AWS
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

// this one is just a test
router.get('/', (req, res) => {
    res.send('H3ll0 W0RlD')
})




module.exports = router