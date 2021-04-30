path = require('path')
const express = require('express')
const mongoose = require('mongoose')
const quesRoutes = require('./quesRoutes')
const userRoutes = require('./userRoutes')
const cors = require('cors')
const abs =""
const publicDirectoryPath = path.join(__dirname,'../public')
require('dotenv').config({path: __dirname + '/.env'})
const app = express()
app.use(express.urlencoded({extended:true}))
app.use(express.json())

const port = process.env.PORT
app.use(cors()) // We're telling express to use CORS
app.use(express.json()) // we need to tell server to use json as well

app.use(express.static(publicDirectoryPath))
app.use(quesRoutes)
app.use(userRoutes)

//mongoose.connect("mongodb+srv://Anshul:shrijibaba@cluster0.nebpp.mongodb.net/PhysicsClass11&12?retryWrites=true&w=majority",{useNewUrlParser:true,useUnifiedTopology:true})
mongoose.connect(process.env.MONGODB_URI,{useNewUrlParser:true,useUnifiedTopology:true})
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('database connected'))

app.listen(port,()=>{
    console.log(`Server is listening at port ${port}`)
})


