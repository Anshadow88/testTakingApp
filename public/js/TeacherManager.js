let studentData = []
// $addNewStudentButton = document.getElementById('addNewStudentButton')

const $addNewStudentFormButton = document.getElementById('addNewStudentFormButton')
$addNewStudentFormButton.addEventListener('click',(e)=>{
    //console.log('Here')
    let name = document.getElementById('newStudentName') 
    let email = document.getElementById('newStudentEmail')
    let password = document.getElementById('newStudentPassword')
    addNewStudentToDatabase(name.value,email.value,password.value)
})
const $deleteOldStudentButton = document.getElementById('deleteOldStudentButton')
$deleteOldStudentButton.addEventListener('click',(e)=>{
    let name = document.getElementById('newStudentName') 
    let email = document.getElementById('newStudentEmail')
    deleteOldStudentFromDatabase(name.value,email.value)

})

const $teacherProfileSectionButton = document.getElementById('teacherProfileSectionButton')
$teacherProfileSectionButton.addEventListener('click',(e)=>{
    SwitchSections(1)
})
const $StudyMaterialSectionButton = document.getElementById('StudyMaterialSectionButton')
$StudyMaterialSectionButton.addEventListener('click',(e)=>{
    SwitchSections(2)
    
})
const $myStudentSectionButton = document.getElementById('myStudentSectionButton')
$myStudentSectionButton.addEventListener('click',(e)=>{
    SwitchSections(3)
    getAllMyStudents(USERID)
})
function SwitchSections(count){
    document.getElementById("teacherProfileSection").style.display="none";
    document.getElementById('myStudentSection').style.display='none'
    document.getElementById('StudyMaterialSection').style.display='none'

    if(count==1)document.getElementById('teacherProfileSection').style.display= 'block'
    else if(count==2)document.getElementById('StudyMaterialSection').style.display='block'
    else if(count==3)document.getElementById('myStudentSection').style.display='block'
}


//MY STUDENT SECTION
async function addNewStudentToDatabase(name, email, password){
    const response = await fetch('/addMyStudent/'+USERID,{
        method:'POST',       
      
    body: JSON.stringify({
        name: name,
        email: email,
        password: password,
        role: 'student'
    }),
    headers: {
        "Content-type": "application/json; charset=UTF-8"
    }
    })
    .then(
    ).then()
    
    const data = await response.json()
    ////console.log('Here '+data)

    getAllMyStudents(USERID)

}

async function deleteOldStudentFromDatabase(name, email){
    const response = await fetch('/removeMyStudent/'+USERID,{
        method:'POST',       
      
    body: JSON.stringify({
        name: name,
        email: email,
    }),
    headers: {
        "Content-type": "application/json; charset=UTF-8"
    }
    })
    .then(
    ).then()
    
    const data = await response.json()
   // //console.log('Here '+data)

    getAllMyStudents(USERID)

}

async function getAllMyStudents(teacherID)
{
    const response = await fetch('/getStudentsOfTeacher/'+teacherID,{
        method:'GET',     
   
    headers: {
        "Content-type": "application/json; charset=UTF-8"
    }
    })
    .then(
    ).then()    
    const data = await response.json()
  //  //console.log(data)
    studentData = data
    addOldStudentsToList(studentData)


}

function addOldStudentsToList(data){
    
    let $myStudentTable = document.getElementById('myStudentTable')
    while($myStudentTable.hasChildNodes())
        {
            $myStudentTable.removeChild($myStudentTable.firstChild);
        }
    for(i=0;i<data.length;i++)
    {
    let tr = document.createElement('tr')
    $myStudentTable.appendChild(tr)
    
    for (var j = 0; j < 4; j++) {
        var td = document.createElement('TD')        
        if(j==0)
        td.appendChild(document.createTextNode(i+1))
        if(j==1)
        td.appendChild(document.createTextNode(data[i].name))
        else if(j==2)
        td.appendChild(document.createTextNode(data[i].email))
        else if(j==3)
        td.appendChild(document.createTextNode('********'))

        tr.appendChild(td)
        }
    }

}



//MY STUDENT RESULT SECTION

   
let AllTestResults
let AllStudentResults = []

// const $getResultButton = document.querySelector('#getResultButton')
// $getResultButton.addEventListener('click',(e)=>{
//     const $testName = document.querySelector('#testName')
//     loadTestResult($testName.value)
//})
const $getAllResultButton = document.querySelector('#getAllResultButton')
$getAllResultButton.addEventListener('click',(e)=>{
    loadAllTestResult()
})
const $hideResultButton = document.querySelector('#hideResultButton')
$hideResultButton.addEventListener('click',(e)=>{
    hideAllTestResult()
})
async function loadAllTestResult(){     
    ////console.log("Global: "+TOKEN)
    AllStudentResults = []
    const response  = await fetch("/allTests", {          
    // Adding method type
    method: "GET",
      
    header: {
        // "Authorization": "Bearer " + TOKEN
    },

    headers: {
        "Content-type": "application/json; charset=UTF-8"
    }
    }).then().then()

    var data = await response.json()   
    console.log(data)
    
    DisplayAllResult(data)

}
function DisplayAllResult(allTests){
    $resultText = document.querySelector('#resultText')

    $resultText.innerHTML=''
    
    for(i=0;i<allTests.length;i++)    
    {
        $resultText.innerHTML+=((i+1)+ ' TestCode '+allTests[i].name+'<br/>')
        for(j=0;j<allTests[i].result.length;j++)
        {
            $resultText.innerHTML+=('......'+(j+1)+' '+allTests[i].result[j].userName+' got '+
            allTests[i].result[j].marksObtained+' out of '+
            allTests[i].result[j].maxMarks )+'<br/>'
        }
    }
}
function hideAllTestResult(){
    $resultText = document.querySelector('#resultText')
    $resultText.innerHTML=''
}
async function loadTestResult(testName){     
    ////console.log("Global: "+TOKEN)
    AllStudentResults = []
    const response  = await fetch("/testPaperNameResult", {          
    // Adding method type
    method: "POST",
      
    header: {
        "Authorization": "Bearer " + TOKEN
    },
    // Adding body or contents to send
    body: JSON.stringify({
        name: testName ,
        userID:USERID  
    }),
    // Adding headers to the request
    headers: {
        "Content-type": "application/json; charset=UTF-8"
    }
    }).then().then()

    var data = await response.json()   
    
    

    for(i=0;i<data.allStudentsMarks.length;i++){
        var newStudent = new Student(data.allStudentNames[i],data.allStudentsMarks[i],data.maxMarks )
        AllStudentResults.push(newStudent)
    }
      
       
    
    DisplayResult()
    //startTimer(900,$time)
}
function DisplayResult(){
    $resultText = document.querySelector('#resultText')

    $resultText.innerHTML=''
    
    for(i=0;i<AllStudentResults.length;i++)
    {
        $resultText.innerHTML+=(AllStudentResults[i].getName()+'&nbsp got Marks: '+AllStudentResults[i].getMarks()+'&nbsp out of '+AllStudentResults[i].getMaxMarks()+'<br/>')
    }


}
const Student = class{
    constructor(name,marks,maxMarks){        
        this.name = name
        this.marks = marks
        this.maxMarks = maxMarks
    }
    getName = function(){
        return this.name

    }
    getMarks = function(){
        return this.marks
        
    }
    getMaxMarks = function(){
        return this.maxMarks
    }

}

//TEST MAKER SECTION

const ShowMyTestButton = document.getElementById('ShowMyTestButton')
ShowMyTestButton.addEventListener('click',e=>{
    getAllMyTests()
    document.getElementById('MyTests').style.display='block'
    document.getElementById('PreviousYearExams').style.display='none'    
    document.getElementById('testCreatorApp').style.display='none'

   

})

const ShowreviousYearButton = document.getElementById('ShowreviousYearButton')
ShowreviousYearButton.addEventListener('click',e=>{
    document.getElementById('MyTests').style.display='none'
    document.getElementById('PreviousYearExams').style.display='block'    
    document.getElementById('testCreatorApp').style.display='none'
    getAllAdminTests()
    
})

const CreateNewButton = document.getElementById('CreateNewButton')
CreateNewButton.addEventListener('click',e=>{
    document.getElementById('MyTests').style.display='none'
    document.getElementById('PreviousYearExams').style.display='none'    
    document.getElementById('testCreatorApp').style.display='block'

})


async function getAllMyTests()
{
    const response  = await fetch("/testTestsOfTeacher/"+USERID, {          
    // Adding method type
    method: "GET",
      
    header: {
        // "Authorization": "Bearer " + TOKEN
    },

    headers: {
        "Content-type": "application/json; charset=UTF-8"
    }
    }).then().then()

    var data = await response.json()
    console.log(data)
    makeMyExamTable(data)
}

function makeMyExamTable(myExams)
{
    //console.log(myExams.length) 
    if(myExams.length==0)return
    //console.log('211')
    const myTestTableDiv  = document.getElementById('myTestTableDiv')
    while (myTestTableDiv.firstChild) {
        myTestTableDiv.removeChild(myTestTableDiv.firstChild);
    }
    
    const newTable = document.createElement('table')
    //console.log('214')
    newTable.className='table'
    //console.log('215')
    myTestTableDiv.appendChild(newTable)
    //console.log('216')
    const thead = document.createElement('thead')
    //console.log('217')
    newTable.appendChild(thead)
    
    //console.log('218')
    for(i=0;i<3;i++)
    {
        const td = document.createElement('td')
        thead.appendChild(td)
        if(i==0)td.appendChild(document.createTextNode('#'))
        if(i==1)td.appendChild(document.createTextNode('Exam Code'))
        if(i==2)td.appendChild(document.createTextNode('Availible'))
    }
    //console.log('219')
    const tbody = document.createElement('tbody')
    //console.log('220')
    newTable.appendChild(tbody)
    for(j=0; j<myExams.length;j++)
    {
       // console.log('Here'+myExams[j])
            
        const tr = document.createElement('tr')
        tbody.appendChild(tr)
        for(i=0;i<4;i++)
        {
            
            const td = document.createElement('td')
            tr.appendChild(td)
            if(i==0)td.appendChild(document.createTextNode(j+1))
            if(i==1)td.appendChild(document.createTextNode(myExams[j].name))
            if(i==2)td.appendChild(document.createTextNode(myExams[j].questions.length+' Questions'))            
            if(i==3){
                let newButton = document.createElement('button')
                newButton.innerHTML = 'Send'
              //  console.log(newButton+'  '+myExams[j]._id)     
                let id =  myExams[j]._id  
                newButton.addEventListener('click',e=>{SendThisTestToStudents(id)})
                td.appendChild(newButton)
            }
           // console.log('Heretoo'+myExams[j])
        
        }
    }
}


async function getAllAdminTests()
{
    const response  = await fetch("/testTestsOfAdmin", {          
    // Adding method type
    method: "GET",
      
    header: {
        // "Authorization": "Bearer " + TOKEN
    },

    headers: {
        "Content-type": "application/json; charset=UTF-8"
    }
    }).then().then()

    var data = await response.json()
    console.log(data)
    makeAdminExamTable(data)
}


function makeAdminExamTable(myExams)
{
    //console.log(myExams.length) 
    if(myExams.length==0)return
    //console.log('211')
    const myTestTableDiv  = document.getElementById('AdminTableDiv')
    //console.log('212')
    while (myTestTableDiv.firstChild) {
        myTestTableDiv.removeChild(myTestTableDiv.firstChild);
    }
    //console.log('213')
    const newTable = document.createElement('table')
    //console.log('214')
    newTable.className='table'
    //console.log('215')
    myTestTableDiv.appendChild(newTable)
    //console.log('216')
    const thead = document.createElement('thead')
    //console.log('217')
    newTable.appendChild(thead)
    
    //console.log('218')
    for(i=0;i<3;i++)
    {
        const td = document.createElement('td')
        thead.appendChild(td)
        if(i==0)td.appendChild(document.createTextNode('#'))
        if(i==1)td.appendChild(document.createTextNode('Exam Code'))
        if(i==2)td.appendChild(document.createTextNode('Description'))
    }
    //console.log('219')
    const tbody = document.createElement('tbody')
    //console.log('220')
    newTable.appendChild(tbody)
    for(j=0; j<myExams.length;j++)
    {
       // console.log('Here'+myExams[j])
            
        const tr = document.createElement('tr')
        tbody.appendChild(tr)
        for(i=0;i<4;i++)
        {
            
            const td = document.createElement('td')
            tr.appendChild(td)
            if(i==0)td.appendChild(document.createTextNode(j+1))
            if(i==1)td.appendChild(document.createTextNode(myExams[j].name))
            if(i==2)td.appendChild(document.createTextNode(myExams[j].questions.length+' Questions'))            
            if(i==3){
                let newButton = document.createElement('button')
                newButton.innerHTML = 'Send'
              //  console.log(newButton+'  '+myExams[j]._id)     
                let id =  myExams[j]._id  
                newButton.addEventListener('click',e=>{SendThisTestToStudents(id)})
                td.appendChild(newButton)
            }
           // console.log('Heretoo'+myExams[j])
        
        }
    }
}


async function AddTestToAvailableTests(testID,testName){
   //` console.log(testID+'  '+testName)
    const response  = await fetch("/AddThisAdminTestToTeachersTests/"+USERID, {          
    // Adding method type
    method: "PATCH",
      
    // header: {
    //     "Authorization": "Bearer " + TOKEN
    // },
    // Adding body or contents to send
    body: JSON.stringify({
        testName: testName,
        testID: testID ,
        visibility: '0'
    }),
    // Adding headers to the request
    headers: {
        "Content-type": "application/json; charset=UTF-8"
    }
    }).then().then()

    var data = await response.json()   
    console.log(data)

}

async function SendThisTestToStudents(testID){

    const response  = await fetch("/AddTestToMyList/"+USERID, {          
    // Adding method type
    method: "PATCH",
      
    // header: {
    //     "Authorization": "Bearer " + TOKEN
    // },
    // Adding body or contents to send
    body: JSON.stringify({
        testID: testID ,
        visibility: '1'
    }),
    // Adding headers to the request
    headers: {
        "Content-type": "application/json; charset=UTF-8"
    }
    }).then().then()

    var data = await response.json()   
    console.log(data)

}

async function HideThisTestToStudents(testID){

    const response  = await fetch("/changeTestVisibility/"+USERID, {          
    // Adding method type
    method: "PATCH",
      
    // header: {
    //     "Authorization": "Bearer " + TOKEN
    // },
    // Adding body or contents to send
    body: JSON.stringify({
        testID: testID ,
        visibility: '0'
    }),
    // Adding headers to the request
    headers: {
        "Content-type": "application/json; charset=UTF-8"
    }
    }).then().then()

    var data = await response.json()   
    console.log(data)

}







