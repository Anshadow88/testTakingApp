$getResultButton = document.querySelector('#getResultButton')
$testName = document.querySelector('#testName')
$question = document.querySelector('#question')


$getResultButton.addEventListener('click',(e)=>{
    loadTest($testName.value)
})

let AllStudentResults = []

async function loadTest(testName){     
    //console.log("Global: "+TOKEN)
    availableQuestions = []
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
        var newStudent = new Student(data.allStudentNames[i],data.allStudentsMarks[i] )
        AllStudentResults.push(newStudent)
    }
      
       
    
    DisplayResult()
    //startTimer(900,$time)
}

function DisplayResult(){
    for(i=0;i<AllStudentResults.length;i++)
    {
        $question.innerHTML+=(AllStudentResults[i].getName()+'&nbsp got Marks: '+AllStudentResults[i].getMarks()+'<br/>')
    }

}

const Student = class{
    constructor(name,marks){
        
        this.name = name
        this.marks = marks
    }
    getName = function(){
        return this.name

    }
    getMarks = function(){
        return this.marks
        
    }

}