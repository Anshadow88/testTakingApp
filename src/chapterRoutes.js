const express = require('express')
const router = express.Router()

const TestPaper = require('./models/testPaperModel')
const Question = require('./models/QuestionModel')
const User = require('./models/userModel')


const ch1 = {
    name: 'Vector, Error & Dimension',
    tests: [{name: 'Vectors, Errors & Measurement 01'},
    {name: 'Vectors, Errors & Measurement 02'},
    {name: 'Vectors, Errors & Measurement 03'},
    {name: 'Vectors, Errors & Measurement 04'},
    {name: 'Vectors, Errors & Measurement 05'}],
    posts:[{},{},{}]
    
  }
  const ch2 = {
    name: 'Kinematics',
    tests: [{name: 'Kinematics 01'},
    {name: 'Kinematics 02'},
    {name: 'Kinematics 03'},
    {name: 'Kinematics 04'},
    {name: 'Kinematics 05'}],
    posts:[{},{},{}]
    
  }
  const ch3 = {
    name: 'Newtons Laws',
    tests: [{name: 'Newtons Laws 01'},
    {name: 'Newtons Laws 02'},
    {name: 'Newtons Laws 03'}],
    posts:[{},{},{}]
    
  }
  const ch4 = {
    name: 'Work, Energy & Power',
    tests: [{name: 'Work, Energy & Power 01'},
    {name: 'Work, Energy & Power 02'},
    {name: 'Work, Energy & Power 03'},
    {name: 'Work, Energy & Power 04'}],
    posts:[{},{},{}]
    
  }
  const ch5 = {
    name: 'Centre Of Mass & Collision',
    tests: [{name: 'Centre of Mass & Collision 01'},
    {name: 'Centre of Mass & Collision 02'}],
    posts:[{},{},{}]
    
  }
  const ch6 = {
    name: 'Rotation',
    tests: [{name: 'Rotation 01'},
    {name: 'Rotation 02'},
    {name: 'Rotation 03'},
    {name: 'Rotation 04'}],
    posts:[{},{},{}]
    
  }
  const ch7 = {
    name: 'Elastic Properties of Solids',
    tests: [{name: 'Properties of Solids 01'}],
    posts:[{},{},{}]
    
  }
  const ch8 = {
    name: 'Gravitation',
    tests: [{name: 'Gravitation 01'},
    {name: 'Gravitation 02'},
    {name: 'Gravitation 03'},
    {name: 'Gravitation 04'},
    {name: 'Gravitation 05'}],
    posts:[{},{},{}]
    
  }
  const ch9 = {
    name: 'Fluid Mechanics',
    tests: [{name: 'Fluids 01'},
    {name: 'Fluids 02'},
    {name: 'Fluids 03'}],
    posts:[{},{},{}]
    
  }
  const ch10 = {
    name: 'Themodynamics & KTG',
    tests: [{name: 'Themodynamics & KTG 01'},
    {name: 'Themodynamics & KTG 02'},
    {name: 'Themodynamics & KTG 03'},
    {name: 'Themodynamics & KTG 04'},
    {name: 'Themodynamics & KTG 05'}],
    posts:[{},{},{}]
    
  }
  const ch11 = {
    name: 'Oscillation(SHM)',
    tests: [{name: 'Oscillation(SHM) 01'},
    {name: 'Oscillation(SHM) 02'},
    {name: 'Oscillation(SHM) 03'},
    {name: 'Oscillation(SHM) 04'}],
    posts:[{},{},{}]
    
  }
  const ch12 = {
    name: 'Waves',
    tests: [{name: 'Waves 01'},
    {name: 'Waves 02'},
    {name: 'Waves 03'},
    {name: 'Waves 04'}],
    posts:[{},{},{}]
    
  }
  const ch13 = {
    name: 'Electrostatics',
    tests: [{name: 'Electrostatics 01'},
    {name: 'Electrostatics 02'}],
    posts:[{name:''},
      {},
      {}]
    
  }
  const ch14 = {
    name: 'Current Electricity',
    tests: [{name: 'Current Electricity 01'},
    {name: 'Current Electricity 02'},
    {name: 'Current Electricity 03'},
    {name: 'Current Electricity 04'},
    {name: 'Current Electricity 05'},
    {name: 'Current Electricity 06'}],
    posts:[{},
      {},
      {}]
    
  }
  const ch15 = {
    name: 'Magnetism',
    tests: [{name: 'Magnetism 01'},
    {name: 'Magnetism 02'},
    {name: 'Magnetism 03'},
    {name: 'Magnetism 04'}],
    posts:[{},{},{}]
    
  }
  const ch16 = {
    name: 'EMI & AC',
    tests: [
    {name: 'EMI & AC 01'},
    {name: 'EMI & AC 02'},
    {name: 'EMI & AC 03'},
    ],
    posts:[{},{},{}]
    
  }
  
  const ch18 = {
    name: 'Ray Optics',
    tests: [{name: 'Ray Optics 01'},
    {name: 'Ray Optics 02'}],
    posts:[{},{},{}]
    
  }
  
  const ch17 = {
    name: 'Wave Optics & EM Waves',
    tests: [{name: 'Wave Optics & EM Waves 01'},
    {name: 'Wave Optics & EM Waves 02'}],
    posts:[{},{},{}]
    
  }
  const ch19 = {
    name: 'Modern Physics',
    tests: [{name: 'Modern Physics 01'},
    {name: 'Modern Physics 02'},
    {name: 'Modern Physics 03'},
    {name: 'Modern Physics 04'},
    {name: 'Modern Physics 05'}],
    posts:[{},{},{}]
    
  }
  const ch20 = {
    name: 'Semiconductors & Communication',
    tests: [{name: 'Semiconductors 01'},
    {name: 'Semiconductors 02'},
    {name: 'Semiconductors 03'},
    {name: 'Semiconductors 04'},
    {name: 'Semiconductors 05'},
    {name: 'Semiconductors 06'},
    {name: 'Semiconductors 07'},
    {name: 'Semiconductors 08'}],
    posts:[{},{},{}]
    
  }
  
  
  
  allChapterData = [ch1,ch2,ch3,ch4,ch5,ch6,ch7,ch8,ch9,ch10,ch11,ch12,ch13,ch14,ch15,ch16,ch17,ch18,ch19,ch20]
  
//GET ALL TESTS
router.get('/chapter/:number', async (req, res) => {
    try {  
        
        const number = parseInt(req.params.number)-1
        const allTestNames =[]
        allChapterData[number].tests.forEach(test=>{
            allTestNames.push(test.name)
        })
        const chapterTests = await TestPaper.find({name:{$in: allTestNames}}).exec()
        return res.render('chapter',{
            chapterNumber :number+1,
            chapterData: allChapterData[number],
            chapterTests: chapterTests
    })
    } catch (error) {
        return res.status(500).json({"error":error})
    }
})




module.exports = router