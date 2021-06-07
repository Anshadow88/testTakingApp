
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
    studentData = MYSTUDENTS
    addOldStudentsToList(studentData)
}


function addOldStudentsToList(data){
    allBatches = []
    
    data.forEach(student =>{
        if(allBatches.indexOf(student.batch)==-1)
        allBatches.push(student.batch)
    })
    
    
    let $myStudentTable = document.getElementById('myStudentTable')
    while($myStudentTable.hasChildNodes())
        {
            $myStudentTable.removeChild($myStudentTable.firstChild);
        }
    allBatches.forEach(batch=>{
        let count =0
        let tr = document.createElement('tr')
        $myStudentTable.appendChild(tr)
        var td = document.createElement('TD')
        td.appendChild(document.createTextNode('Liist of all Students in '+batch))
        tr.appendChild(td)

        for(i=0;i<data.length;i++)
        {   
            if(data[i].batch == batch)
            {
                count++
                let tr = document.createElement('tr')
                $myStudentTable.appendChild(tr)
                
                for (var j = 0; j < 4; j++) {
                    var td = document.createElement('TD')        
                    if(j==0)
                    td.appendChild(document.createTextNode(count))
                    if(j==1)
                    td.appendChild(document.createTextNode(data[i].studentName))
                    else if(j==2)
                    td.appendChild(document.createTextNode(data[i].studentID))
                    else if(j==3)
                    td.appendChild(document.createTextNode(data[i].batch))

                    
                    tr.appendChild(td)
                    }
            }
        }

    })
    

}



//MY STUDENT RESULT SECTION

   
let AllTestResults
let AllStudentResults = []

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
    const response  = await fetch("/teacherGetTestResults/"+USERID, {          
    // Adding method type
    method: "POST",
      
    header: {
        // "Authorization": "Bearer " + TOKEN
    },
    body: JSON.stringify({
        
        
    }),
    headers: {
        "Content-type": "application/json; charset=UTF-8"
    }
    }).then().then()

    var data = await response.json()   
    console.log(data)
    allBatches = []
    data.forEach(result =>{
        if(allBatches.indexOf(result.batch)==-1)
        allBatches.push(result.batch)
    })

    let $AllResultTableDiv = document.getElementById("AllResultTableDiv");
    while($AllResultTableDiv.hasChildNodes())
  {
    $AllResultTableDiv.removeChild($AllResultTableDiv.firstChild);
  }

    allBatches.forEach(batch=>{
            const batchData = []
            data.forEach(student=>{
                if(student.batch==batch)
                batchData.push(student)
            })
            console.log(batchData)
            DisplayAllResult(batchData,batch)
    })

    

}
function DisplayAllResult(allResults,batchName){
    allUniqueTestName = []
    allResults.forEach(result =>{
        if(allUniqueTestName.indexOf(result.testName)==-1)
        allUniqueTestName.push(result.testName)
    })

    allUniqueStudentName = []
    allResults.forEach(result =>{
        if(allUniqueStudentName.indexOf(result.student)==-1)
        allUniqueStudentName.push(result.student)
    })

    

    let $AllResultTableDiv = document.getElementById("AllResultTableDiv");
    
    let table = document.createElement('TABLE');
     table.className ='table'

    let tableHead = document.createElement('thead')
    table.appendChild(tableHead)
    var headRow = document.createElement('tr')
    tableHead.appendChild(headRow)

    for (var i = 0; i < allUniqueStudentName.length+1; i++) {
        var td = document.createElement('TD') 
        
        if(i==0)         
        td.appendChild(document.createTextNode(batchName))
        else {
        let studentName = (allUniqueStudentName[i-1])
        td.appendChild(document.createTextNode(studentName))
        }
        
        headRow.appendChild(td)
    } 

        var tableBody = document.createElement('TBODY');
        table.appendChild(tableBody);
        for(j=0;j<allUniqueTestName.length;j++){    
            var tr = document.createElement('TR');
            tableBody.appendChild(tr);
            let testName = allUniqueTestName[j]   
                for (var k = 0; k< allUniqueStudentName.length+1; k++) {
                    var td = document.createElement('TD');                                        
                    if(k==0){
                         td.appendChild(document.createTextNode(testName));
                    }
                    else
                    {
                        allResults.forEach(result=>{
                            if(result.student==allUniqueStudentName[k-1]){
                                if(result.testName==testName){ 
                                td.appendChild(document.createTextNode(result.marks+'/'+result.maxMarks));
                            }
                        }
                    })
                }
                tr.appendChild(td)
        }
        $AllResultTableDiv.appendChild(table);  }  
}

function hideAllTestResult(){
    let $AllResultTableDiv = document.getElementById("AllResultTableDiv");
    while($AllResultTableDiv.hasChildNodes())
  {
    $AllResultTableDiv.removeChild($AllResultTableDiv.firstChild);
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

window.ALLMYTESTS = []
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
    ALLMYTESTS = data
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
                let batchNameInput = document.createElement('input')
                batchNameInput.type = 'text'
                
              //  console.log(newButton+'  '+myExams[j]._id)     
                let id =  myExams[j]._id  
                newButton.addEventListener('click',e=>{SendTestToMyBatch(id,batchNameInput.value)})
                td.appendChild(batchNameInput)
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

async function SendTestToMyBatch(testID,batchName){
    console.log(testID+'  '+batchName)
    const response  = await fetch("/teacherSendTestToBatch/"+USERID, {          
    // Adding method type
    method: "POST",

    body: JSON.stringify({
        testID: testID,
        batch:batchName
    }),
    // Adding headers to the request
    headers: {
        "Content-type": "application/json; charset=UTF-8"
    }
    }).then().then()


}


async function RemoveTestFromMyBatch(testID,batchName){
    console.log(testID+'  '+batchName)
    const response  = await fetch("/teacherSendTestToBatch/"+USERID, {          
    // Adding method type
    method: "POST",

    body: JSON.stringify({
        testID: testID,
        batch:batchName
    }),
    // Adding headers to the request
    headers: {
        "Content-type": "application/json; charset=UTF-8"
    }
    }).then().then()


}







