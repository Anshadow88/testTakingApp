path = require('path')
const express = require('express')

const mongoose = require('mongoose')
const quesRoutes = require('./quesRoutes')
const userRoutes = require('./userRoutes')
const testRoutes = require('./testRoutes')
const cors = require('cors')
const abs =""
const publicDirectoryPath = path.join(__dirname,'../public')

require('dotenv').config({path: __dirname + '/.env'})
const app = express()

var forceSsl = function (req, res, next) {
    if (req.headers['x-forwarded-proto'] !== 'https') {
        return res.redirect(['https://', req.get('Host'), req.url].join(''));
    }
    return next();
 };


//app.use(forceSsl)
   

app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.set('view engine','hbs')


const uploadsDirectoryPath = path.join(__dirname,'/uploads')

const port = process.env.PORT
app.use(cors()) // We're telling express to use CORS
app.use(express.json()) // we need to tell server to use json as well

app.use(express.static(publicDirectoryPath))
app.use('/uploads',express.static(uploadsDirectoryPath))
app.use(quesRoutes)
app.use(userRoutes)
app.use(testRoutes)

mongoose.connect(process.env.MONGODB_URI,{useNewUrlParser:true,useUnifiedTopology:true})
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('database connected'))


app.get('/chapter/:number',(req,res)=>{
    return res.render('chapter',{
        chapterNumber: req.params.number
})
})

app.get('/test/:name',(req,res)=>{
    return res.render('test',{
        testName: req.params.name
})
})

app.listen(port,()=>{
    console.log(`Server is listening at port ${port}`)
})


