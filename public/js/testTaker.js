const $testStartbutton = document.querySelector('#getTestButton')
const $testName = document.querySelector('#testName')

const $OptionAButton = document.querySelector('#OptionAButton')
const $OptionBButton = document.querySelector('#OptionBButton')
const $OptionCButton = document.querySelector('#OptionCButton')
const $OptionDButton = document.querySelector('#OptionDButton')


const $lastQuestionStatus = document.querySelector('#lastQuestionStatus')
const $submitTestButton = document.querySelector('#submitTestButton')
const $confirmSubmitButton = document.querySelector('#confirmSubmitButton')
const $cancelSubmitButton = document.querySelector('#cancelSubmitButton')
const $confirmationMenu = document.querySelector('#confirmationMenu')


const $questionNumber = document.querySelector('#questionNumber')
const $questionText = document.querySelector('#question')

const $getQuestionButton = document.querySelector('#getQuestionButton')
const $nextQuestionButton = document.querySelector('#nextQuestionButton')
const $previousQuestionButton = document.querySelector('#previousQuestionButton')

let questionCount = 0
let availableQuestions =[]
let marksFinal =0
let maxMarks = 60
let questionwiseResut = []
let isGiven = false

window.TESTID =""
confirmationMenu.style.display ='none'
submitTestButton.style.display = 'none'

$testStartbutton.addEventListener('click',GetTest)
$OptionAButton.addEventListener('click',CheckOptionA)
$OptionBButton.addEventListener('click',CheckOptionB)
$OptionCButton.addEventListener('click',CheckOptionC)
$OptionDButton.addEventListener('click',CheckOptionD)

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

function CheckOptionA(){
    console.log("A")
    CheckAnswer('A',availableQuestions[questionCount])
}
function CheckOptionB(){
    console.log("B")
    CheckAnswer('B',availableQuestions[questionCount])
}function CheckOptionC(){
    console.log("C")
    CheckAnswer('C',availableQuestions[questionCount])
}function CheckOptionD(){
    console.log("D")
    CheckAnswer('D',availableQuestions[questionCount])
}


function GetTest()
{
    testName = $testName.value
    loadTest(testName)
}

async function loadTest(testName){     
        console.log("Global: "+TOKEN)
        const response  = await fetch("/testPaperWithName", {          
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
        console.log(data)

        TESTID = data.testPaperID
       // console.log(testPaperID)

        for(i=0;i<data.questionsOfChapter.length;i++){
            var newQues = new Quest(data.questionsOfChapter[i]._id,
                                    data.questionsOfChapter[i].question,
                                    data.questionsOfChapter[i].answer)
            availableQuestions.push(newQues)
            //console.log(newQues)
            
        }       
        isGiven = data.isGiven
        if(isGiven==true)
        console.log('This is your RE_ATTEMPT')
        

        DisplayCurrentQuestion()
    }

async function saveTestResult(testName){     
        for(i=0;i<availableQuestions.length;i++)
        {
            questionwiseResut.push({questionID: availableQuestions[i].id,
                                    status: availableQuestions[i].getAttempted()})
        }
        console.log(questionwiseResut)
        const response  = await fetch("/testPaper/"+TESTID, {          
        // Adding method type
        method: "PATCH",
          
        header: {
            "Authorization": "Bearer " + TOKEN
        },
        // Adding body or contents to send
        body: JSON.stringify({
                result:[{userID:USERID,
                marksObtained:marksFinal,
                maxMarks : maxMarks,
                questions : questionwiseResut}]
        }        
        ),
        // Adding headers to the request
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
        }).then().then()

        var data = await response.json()   
        console.log(data)

       
    }




async function getQuestion(id){  
        const response = await fetch("/questions/"+id)
        var data = await response.json();
        console.log(data)
        var modifiedString = data.toString()    
        modifiedString = inputQuestionText.replace(/(\r\n|\r|\n)/g, '<br>')
        $questionText.innerHTML = modifiedString
    }

function DisplayCurrentQuestion()
{
    $questionText.innerHTML = availableQuestions[questionCount].question
    MathJax.typeset()
    $questionNumber.innerHTML = 'Question '+(questionCount+1)+' out of '+availableQuestions.length
    
}

function DisplayNextQuestion()
{
    console.log(availableQuestions.length +">"+questionCount)
    if(questionCount<availableQuestions.length-1)
    {questionCount++
    $questionText.innerHTML = availableQuestions[questionCount].question}
    $lastQuestionStatus.innerHTML = ""
    //SWO SUBMIT BUTTON ON LAST
    if(questionCount==availableQuestions.length-1)
    {$nextQuestionButton.style.display='none'
    $submitTestButton.style.display =''}
    $questionNumber.innerHTML = 'Question '+(questionCount+1)+' out of '+availableQuestions.length
    MathJax.typeset()
}

function DisplayPreviousQuestion()
{
    console.log(0 +"<"+questionCount)
    if(questionCount>0)
    {questionCount--
    $questionText.innerHTML = availableQuestions[questionCount].question}
    $lastQuestionStatus.innerHTML = ""
    $nextQuestionButton.style.display=''    
    $questionNumber.innerHTML = 'Question '+(questionCount+1)+' out of '+availableQuestions.length
    MathJax.typeset()
}

function CheckAnswer(markedAnswer,question)
{
    try{
        question.markAttemped(markedAnswer)
        if(questionCount < availableQuestions.length-1)
        $lastQuestionStatus.innerHTML = "You Marked: "+question.getAttempted()
        else
        $lastQuestionStatus.innerHTML = "You Marked: "+question.getAttempted()+" !!!!Please Submit Answers"
        

    
    }
    catch(err){
        console.log(err)
    }
}

function CalculateFinalScore()
{
    let marks=0
    try{
        for(i=0;i<availableQuestions.length;i++)
        {
            if(availableQuestions[i].getAttempted())
            {
             if(availableQuestions[i].getAttempted()==availableQuestions[i].getAnswer())
             {
                marks = marks+4
             }else
                marks =marks-1
            }

        }
        console.log('Marks ='+marks+' out of '+ availableQuestions.length*4)
        marksFinal = marks
        maxMarks = availableQuestions.length*4


        saveTestResult()
    }
    catch(err){}
}


let Quest = class{

    constructor(id,question,answer)
    {
       this.id = id
       this.question = question
       this.answer = answer
    }
    markAttemped(status){
        //status=true for correct,false for incorrect,undefined = unattempted
        this.status=status
    }


    
    getQuestion = function()
    {
        return this.question
    }
    
    getAnswer = function()
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
}