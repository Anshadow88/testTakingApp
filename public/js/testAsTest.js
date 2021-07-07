const $testName = document.querySelector('#testName')
const $messageReview = document.querySelector('#messageReview')
const $time = document.querySelector('#time')


const $OptionAButton = document.querySelector('#OptionAButton')
const $OptionBButton = document.querySelector('#OptionBButton')
const $OptionCButton = document.querySelector('#OptionCButton')
const $OptionDButton = document.querySelector('#OptionDButton')
const $integerButton = document.querySelector('#integerButton')

const $lastQuestionStatus = document.querySelector('#lastQuestionStatus')
const $submitTestButton = document.querySelector('#submitTestButton')
const $confirmSubmitButton = document.querySelector('#confirmSubmitButton')
const $cancelSubmitButton = document.querySelector('#cancelSubmitButton')
const $confirmationMenu = document.querySelector('#confirmationMenu')

const $questionNumber = document.querySelector('#questionNumber')
const $questionText = document.querySelector('#question')
const $image = document.querySelector('#image')

const $getQuestionButton = document.querySelector('#getQuestionButton')
const $nextQuestionButton = document.querySelector('#nextQuestionButton')
const $previousQuestionButton = document.querySelector('#previousQuestionButton')

const $testResultTemplate = document.querySelector('#testResultTemplate')

let questionCount = 0
let availableQuestions =[]
let marksFinal =0
let maxMarks = 60
let questionwiseResut = []
let isGiven = false
let timeOfTest = 60

window.TESTID =""
window.TESTNAME=""

$OptionAButton.addEventListener('click',CheckOptionA)
$OptionBButton.addEventListener('click',CheckOptionB)
$OptionCButton.addEventListener('click',CheckOptionC)
$OptionDButton.addEventListener('click',CheckOptionD)
$integerButton.addEventListener('click',CheckIntegerType)

$nextQuestionButton.addEventListener('click',(e)=>{
    DisplayNextQuestion()
})

$previousQuestionButton.addEventListener('click',(e)=>{
    DisplayPreviousQuestion()
})

$submitTestButton.addEventListener('click',(e)=>{
    $confirmationMenu.style.display=''
    $confirmationMenu.focus()
})

$confirmSubmitButton.addEventListener('click',(e)=>{
    CalculateFinalScore()
})

$cancelSubmitButton.addEventListener('click',(e)=>{
    $confirmationMenu.style.display='none'
})

function LoadTestAtStart(){
    var url = window.location.pathname;
    var testNameFromURL = url.substring(url.lastIndexOf('/') + 1)
    let testName = testNameFromURL.replaceAll("%20"," " )
    loadTest(testName)
    document.getElementById('testArea').style.display='block'    
    document.getElementById('LoadTestButton').style.display = 'none'
    document.getElementById('StartTestButton').style.display = 'block'
}



$StartTestButton= document.getElementById('LoadTestButton')
$StartTestButton.addEventListener('click',e=>{
    LoadTestAtStart()
    
    
})

$StartTestButton= document.getElementById('StartTestButton')
$StartTestButton.addEventListener('click',e=>{
    StartTestNow()    
})

function CheckOptionA(){
    MarkAnswer('A',availableQuestions[questionCount])
}
function CheckOptionB(){
    //console.log("B")
    MarkAnswer('B',availableQuestions[questionCount])
}
function CheckOptionC(){
    //console.log("C")
    MarkAnswer('C',availableQuestions[questionCount])
}
function CheckOptionD(){
    //console.log("D")
    MarkAnswer('D',availableQuestions[questionCount])
}
function CheckIntegerType(){
    integerAnswer = document.getElementById('integerAnswer')
    MarkAnswer(integerAnswer.value,availableQuestions[questionCount])
}

///VERY IMPORTANT
async function loadAvailableTests(){   
    const response  = await fetch("/studentAvailibleTests/"+USERID, {          
    // Adding method type
    method: "GET",
      
    header: {
    },
    headers: {
        "Content-type": "application/json; charset=UTF-8"
    }
    }).then().then()

    var data = await response.json()   
    console.log(data)
    makeMyTestTable(data)
}

function makeMyTestTable(myTests)
{
    console.log(myTests.length) 
    if(myTests.length==0)return
    //console.log('211')
    const myTestTableDiv  = document.getElementById('myTestTableDiv')
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
    for(j=0; j<myTests.length;j++)
    {
       // console.log('Here'+myExams[j])
            
        const tr = document.createElement('tr')
        tbody.appendChild(tr)
        for(i=0;i<4;i++)
        {
            
            const td = document.createElement('td')
            tr.appendChild(td)
            if(i==0)td.appendChild(document.createTextNode(j+1))
            if(i==1)td.appendChild(document.createTextNode(myTests[j].testName))
            if(i==2)td.appendChild(document.createTextNode(myTests[j].testDescription))            
            if(i==3){
                let newButton = document.createElement('button')
                newButton.innerHTML = 'Start Test'   
                let name =  myTests[j].testName 
                newButton.addEventListener('click',e=>{loadTest(name)})
                td.appendChild(newButton)
            }
        
        }
    }
}

async function loadTest(testName){  
    TESTNAME = testName
    document.getElementById('testApp').style.display ='block'
    console.log("Test Name: "+testName)
        availableQuestions = []
        const response  = await fetch("/testPaperWithName/"+USERID, {   
        method: "POST",          
        header: {
           // "Authorization": "Bearer " + TOKEN
        },
        body: JSON.stringify({
            name: testName ,
            userID:USERID  
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
        }).then().then()

        var data = await response.json()   
        TESTID = data.testPaperID
       // //console.log(testPaperID)
        isGiven = data.isGiven
        if(isGiven==true)
        $messageReview.innerHTML = 'This is your Re-Attempt. You can attempt the questions again and get new score but the score in report card will remain unchanged.'
        
        console.log(data)
        for(i=0;i<data.questionsOfChapter.length;i++){
            var newQues = new Quest(data.questionsOfChapter[i]._id,
                                    data.questionsOfChapter[i].question,
                                    data.questionsOfChapter[i].answer,
                                    data.questionsOfChapter[i].image,
                                    data.questionsOfChapter[i].type
                                    )
            availableQuestions.push(newQues)
            if(isGiven){
            newQues.originalAttempt(data.previousAttempt[i])        
            }    
        }   
        console.log(availableQuestions)           
       
        timeOfTest = parseInt(data.testtime)*60
                

}

function StartTestNow(){
    startTimer(timeOfTest,$time)
    DisplayCurrentQuestion()       
    document.getElementById('StartTestButton').style.display = 'none'    
}

async function loadTestForNewUser(testName){  
    TESTNAME = testName
    document.getElementById('testApp').style.display ='block'
    console.log("Test Name: "+testName)
        availableQuestions = []
        const response  = await fetch("/loadTestForNewUser", {   
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
        TESTID = data.testPaperID
       // //console.log(testPaperID)
        isGiven = data.isGiven
        if(isGiven==true)
        $messageReview.innerHTML = 'This is your Re-Attempt. You can attempt the questions again and get new score but the score in report card will remain unchanged.'
        
        console.log(data)
        for(i=0;i<data.questionsOfChapter.length;i++){
            var newQues = new Quest(data.questionsOfChapter[i]._id,
                                    data.questionsOfChapter[i].question,
                                    data.questionsOfChapter[i].answer,
                                    data.questionsOfChapter[i].image,
                                    data.questionsOfChapter[i].type
                                    )
            availableQuestions.push(newQues)
            if(isGiven){
            newQues.originalAttempt(data.previousAttempt[i])        
            }    
        }   
        console.log(availableQuestions)           
        DisplayCurrentQuestion()
        timeParsed = parseInt(data.testtime)
        console.log(data.testtime+' '+timeParsed)
        startTimer(timeParsed*60,$time)
        document.getElementById('myTestTableDiv').style.display='none'
}

async function saveTestResult(testName){     
    console.log('name1: '+USERNAME)
        for(i=0;i<availableQuestions.length;i++)
        {
            questionwiseResut.push({questionID: availableQuestions[i].id,
                                    status: availableQuestions[i].getAttempted()})
        }
        const response  = await fetch("/userTestUpdate/"+USERID, {          
        // Adding method type
        method: "PATCH",
          
        header: {
            "Authorization": "Bearer " + TOKEN
        },
        // Adding body or contents to send
        body: JSON.stringify({
                testID:TESTID,
                testName:TESTNAME,
                marks:marksFinal,
                maxMarks : maxMarks,
                questions : questionwiseResut
        }        
        ),
        // Adding headers to the request
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
        }).then().then()

        var data = await response.json()   
        //console.log(data)

       
}

function DisplayCurrentQuestion()
{
    $questionText.innerHTML = availableQuestions[questionCount].question
    MathJax.typeset()
    $questionNumber.innerHTML = 'Question '+(questionCount+1)+' out of '+availableQuestions.length
    $image.style.display='none'
    if(availableQuestions[questionCount].image&&availableQuestions[questionCount].image!='')
    {
     console.log('ARE WE LOOKING FOR AWS')
     $image.style.display=''
     image.src = ('/uploads/'+availableQuestions[questionCount].image)       
    }  
    if(availableQuestions[questionCount].getAttempted())  
    $lastQuestionStatus.innerHTML = "Marked Answer: "+availableQuestions[questionCount].getAttempted()
    else
    $lastQuestionStatus.innerHTML = "NOT Attempted"    
        
    
    ManageAnswerOptions(availableQuestions[questionCount].getType())
    if(questionCount==availableQuestions.length-1)
    $submitTestButton.style.display='block'
}

function DisplayNextQuestion()
{
    if(questionCount<availableQuestions.length-1) questionCount++

    DisplayCurrentQuestion()
}

function DisplayPreviousQuestion()
{
    if(questionCount>0) questionCount--
    DisplayCurrentQuestion()
}

function MarkAnswer(markedAnswer,question)
{
    try{
        question.markAttemped(markedAnswer)    
        if(!isGiven)    
        {if(questionCount < availableQuestions.length-1)
        $lastQuestionStatus.innerHTML = "You Marked: "+question.getAttempted()  
        
        }
        
        else
        {
        if(questionCount < availableQuestions.length-1)
        $lastQuestionStatus.innerHTML = "You Marked: "+question.getAttempted()+". Correct Answer: "+question.getCorrectAnswer()+". Your First Try was: "+question.getSavedAnswer()  
        }

        
    }
    catch(err){
        //console.log(err)
    }
}

function CalculateFinalScore()
{
    let marks=0
    let correct=0
    let incorrect=0
    let left=0
    try{
        for(i=0;i<availableQuestions.length;i++)
        {
            if(availableQuestions[i].getAttempted())
            {
             if(availableQuestions[i].getAttempted()==availableQuestions[i].getCorrectAnswer())
             {
                marks = marks+4
                correct++
             }else
                {marks =marks-1
                incorrect++}
            }

        }
      //  //console.log('Marks ='+marks+' out of '+ availableQuestions.length*4)
       // //console.log('Correct: '+correct+'. Incorrect: '+incorrect+'. UnAttemped: '+left)
        $questionNumber.innerHTML = 'RESULT: '
        $questionText.innerHTML = 'Marks ='+marks+'<br/> Out of '+ availableQuestions.length*4+'<br/> Correct: '+correct+'<br/> Incorrect: '+incorrect+'<br/> UnAttemped: '+left
        marksFinal = marks
        maxMarks = availableQuestions.length*4

        if(!isGiven){
        saveTestResult()
        isGiven=true
        }

    }
    catch(err){}
}

function startTimer(duration, display) {

    $time.style.display = ''
    var timer = duration, minutes, seconds;
    setInterval(function () {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.innerHTML = minutes + ":" + seconds;

        if (--timer < 0) {
            timer = duration;
        }

        if(minutes==0)
        {
            if(seconds%2==0)$time.style.backgroundColor = "#ff0505"
            else
            $time.style.backgroundColor = "#ffffff"


        }


        if(minutes==0&&seconds==0)
       {
            CalculateFinalScore()
             $time.style.display = 'none'
       }

    }, 1000);
}

function ManageAnswerOptions(type){
    document.getElementById('singleOptionTypeAnswer').style.display='none'
    document.getElementById('integerTypeAnswer').style.display='none'
    if(type==1)
         document.getElementById('singleOptionTypeAnswer').style.display='block'
    else if(type==3)
        document.getElementById('integerTypeAnswer').style.display='block'
}



let Quest = class{

    constructor(id,question,answer,image,type)
    {
       this.id = id
       this.question = question
       this.answer = answer
       this.image = image
       this.type = type
    }
    markAttemped(status){
        //status=true for correct,false for incorrect,undefined = unattempted
        this.status=status
    }
    originalAttempt(savedAnswer){
        this.savedAnswer = savedAnswer

    }    
    getQuestion = function()
    {
        return this.question
    }
    
    getCorrectAnswer = function()
    {
        return this.answer
    }

    getID = function()
    {
        return this.id
    }

    getAttempted = function()
    {
        return this.status
    }

    getSavedAnswer = function()
    {
        return this.savedAnswer
    }
    getImage = function()
    {
        return this.image
    }
    getType = function()
    {
        return this.type
    }
}