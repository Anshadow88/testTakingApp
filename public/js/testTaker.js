const $testStartbutton = document.querySelector('#getTestButton')
const $testName = document.querySelector('#testName')
const $OptionAButton = document.querySelector('#OptionAButton')
const $OptionBButton = document.querySelector('#OptionBButton')
const $OptionCButton = document.querySelector('#OptionCButton')
const $OptionDButton = document.querySelector('#OptionDButton')
const $lastQuestionStatus = document.querySelector('#lastQuestionStatus')

const $questionText = document.querySelector('#question')
const $getQuestionButton = document.querySelector('#getQuestionButton')
const $nextQuestionButton = document.querySelector('#nextQuestionButton')
const $previousQuestionButton = document.querySelector('#previousQuestionButton')

let questionCount = 0
let availableQuestions =[]

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


function CheckOptionA(){
    console.log("A")
    CheckAnswer('A',availableQuestions[questionCount])
}
function CheckOptionB(){
    console.log("A")
    CheckAnswer('B',availableQuestions[questionCount])
}function CheckOptionC(){
    console.log("A")
    CheckAnswer('C',availableQuestions[questionCount])
}function CheckOptionD(){
    console.log("A")
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
            name: testName   
        }),
        // Adding headers to the request
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
        }).then().then()

        var data = await response.json()   
        console.log(data)

        for(i=0;i<data.length;i++){
            var newQues = new Quest(data[i].question,data[i].answer)
            availableQuestions.push(newQues)
        }       

        DisplayCurrentQuestion()
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
}

function DisplayNextQuestion()
{
    console.log(availableQuestions.length +">"+questionCount)
    if(questionCount<availableQuestions.length-1)
    {questionCount++
    $questionText.innerHTML = availableQuestions[questionCount].question}
    $lastQuestionStatus.innerHTML = ""
    
    MathJax.typeset()
}

function DisplayPreviousQuestion()
{
    console.log(0 +"<"+questionCount)
    if(questionCount>0)
    {questionCount--
    $questionText.innerHTML = availableQuestions[questionCount].question}
    $lastQuestionStatus.innerHTML = ""
    
    MathJax.typeset()
}

function CheckAnswer(markedAnswer,question)
{
    try{
    if(markedAnswer==question.getAnswer())
    {
        question.markAttemped(true)
        $lastQuestionStatus.innerHTML = "Correct"
    
    }
    else{
        question.markAttemped(false)
        $lastQuestionStatus.innerHTML = "Incorrect"
    }}
    catch(err){
        console.log(err)
    }
}


let Quest = class{

    constructor(question,answer)
    {
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
}