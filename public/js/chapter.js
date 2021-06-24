

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
  {name: 'Centre Of Mass & Collision 02'}],
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



chapterData = [ch1,ch2,ch3,ch4,ch5,ch6,ch7,ch8,ch9,ch10,ch11,ch12,ch13,ch14,ch15,ch16,ch17,ch18,ch19,ch20]
//////////////////
let ChapterTestDetails = []


function SetTestName(testName){
    localStorage.setItem('TESTNAME',testName)
    console.log(localStorage.TESTNAME)
    openInNewTab("/AllTestTaker.html")

    
}

function openInNewTab(url) {
    const win = window.open(url);
    win.focus();
  }

async function CreatePage(chapterNumber){
  document.getElementById('chapterName').innerHTML = chapterData[chapterNumber].name
  const testDiv = document.getElementById('testDiv')
  document.getElementById('chapterImage').src = "/img/Index/Chapterwise/"+(chapterNumber+1)+".png"
  while(testDiv.hasChild){
    testDiv.remove(testDiv.firstChild)
  }
  //Create Test Div
   {
    

    let newDiv = document.createElement('div')
    newDiv.className = "well well-sm test"
    testDiv.appendChild(newDiv)

    let testDivHead = document.createElement('h3')
    testDivHead.innerHTML = "Test Section"
    testDivHead.id = "sectionName"
    newDiv.appendChild(testDivHead)

    let row = document.createElement('div')
    row.className ="row"
    newDiv.appendChild(row)

    let count = -1
    ChapterTestDetails.forEach(test=>{
          
          count++
          if(count%4==0)
          {row = document.createElement('div')
          row.className ="row"
          newDiv.appendChild(row)}

          let colsm3 = document.createElement('div')
          colsm3.className ="col-sm-3"
          row.appendChild(colsm3)
          
          let newDiv2 = document.createElement('div')
          newDiv2.className ="well well-sm"
          colsm3.appendChild(newDiv2)

          let newh4 = document.createElement('h4')
          newDiv2.appendChild(newh4)
          newh4.innerHTML = test.testName

          let p1 = document.createElement('p')
          newDiv2.appendChild(p1)
          p1.innerHTML = test.questionCount + ' Questions'
          
          let p2 = document.createElement('p')
          newDiv2.appendChild(p2)
          p2.innerHTML = 'Time: '+test.testTime + ' Minutes'
          
          let p3 = document.createElement('p')
          newDiv2.appendChild(p3)
          p3.innerHTML = 'Details: '+test.testDescription 

          let btnDiv = document.createElement('div')
          btnDiv.className="well"
          newDiv2.appendChild(btnDiv)

          let startButton = document.createElement('button')
          startButton.innerHTML = 'Start Test'
          startButton.className="btn btn-danger centerFull"
          btnDiv.appendChild(startButton)
          startButton.addEventListener('click',e=>{
            SetTestName(test.testName)         
          })

          let tempP = document.createElement('p')
          tempP.innerHTML = ' OR<br/>'
          btnDiv.appendChild(tempP)
          tempP.style ="text-align:center"

          let linkToDPP = document.createElement('a')
          var link = document.createTextNode("Open As DPP");
          linkToDPP.appendChild(link); 
          linkToDPP.style ="text-align:center;background-color:yellow;padding:5px"
          tempP.appendChild(linkToDPP)
          linkToDPP.href='/test/'+test.testName
          linkToDPP.target='_blank'
          console.log(linkToDPP)
       })
  }
}

async function getAllTestData(chapterNumber)
{
  chapterData[chapterNumber].tests.forEach(test=>{
       getOneTestDetails(test.name)

  })

  setTimeout("CreatePage(chapterNumber-1)",3000)

}

async function getOneTestDetails(testName){
  const response  = await fetch("/testPaperDetails", {   
  method: "POST",          
  header: {
     // "Authorization": "Bearer " + TOKEN
  },
  body: JSON.stringify({
      name: testName 
  }),
  headers: {
      "Content-type": "application/json; charset=UTF-8"
  }
  }).then().then()

  var data = await response.json()   
  console.log(data)
  ChapterTestDetails.push(data)

}

//getAllTestData(localStorage.chapterNumber-1)

console.log(parseInt(document.getElementById('chapterNumber').innerHTML))
const chapterNumber = parseInt(document.getElementById('chapterNumber').innerHTML)
getAllTestData(parseInt(chapterNumber-1))











//






