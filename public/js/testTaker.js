
const $testStartbutton = document.querySelector('#getTestButton')
const $testName = document.querySelector('#testName')
//const $reviewButton = document.querySelector('#reviewButton')
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

window.TESTID =""
confirmationMenu.style.display ='none'
submitTestButton.style.display = 'none'



$testStartbutton.addEventListener('click',GetTest)
//$reviewButton.addEventListener('click',GetTest)
$OptionAButton.addEventListener('click',CheckOptionA)
$OptionBButton.addEventListener('click',CheckOptionB)
$OptionCButton.addEventListener('click',CheckOptionC)
$OptionDButton.addEventListener('click',CheckOptionD)
$integerButton.addEventListener('click',CheckIntegerType)

$nextQuestionButton.addEventListener('click',(e)=>{
    DisplayNextQuestion()
})

$openTestAppButton.addEventListener('click',()=>{
    console.log('TestApp')
    loadAllTestsData()
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
    //console.log("A")
    MarkAnswer('A',availableQuestions[questionCount])
}
function CheckOptionB(){
    //console.log("B")
    MarkAnswer('B',availableQuestions[questionCount])
}function CheckOptionC(){
    //console.log("C")
    MarkAnswer('C',availableQuestions[questionCount])
}function CheckOptionD(){
    //console.log("D")
    MarkAnswer('D',availableQuestions[questionCount])
}
function CheckIntegerType(){
    integerAnswer = document.getElementById('integerAnswer')
    MarkAnswer(integerAnswer.value,availableQuestions[questionCount])
}
///VERY IMPORTANT
function GetTest()
{
    $testStartbutton.style.display='none'
    testName = $testName.value
    loadTest(testName)
}

async function loadAllTestsData(){     
    //console.log("Global: "+TOKEN)
    const response  = await fetch("/allTests", {          
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
    DisplayAllTestCodes(data)
}


function DisplayAllTestCodes(allTests){
    $question = document.querySelector('#question')

    $question.innerHTML=''
    $question.innerHTML = 'Tests Given By '+USERNAME
    for(i=0;i<allTests.length;i++)    
    {
        count =1
        for(j=0;j<allTests[i].result.length;j++)
        {
            //console.log('user id in Global : .....'+USERID+' should match '+allTests[i].result[j].userID)
            
            if(USERID==allTests[i].result[j].userID)
            {
                $question.innerHTML+=('<br/>'+(count)+ ' TestCode '+allTests[i].name)
                $question.innerHTML+=('..........'+'You scored '+
                allTests[i].result[j].marksObtained+' out of '+
                allTests[i].result[j].maxMarks )
            }
            
        }    
        count++

    }
    
    $question.innerHTML += '<br/><br/><br/>Other Available Tests '+USERNAME

    for(i=0;i<allTests.length;i++)    
    {
        count =1
        attempt = false
        for(j=0;j<allTests[i].result.length;j++)
        {
            //console.log('user id in Global : .....'+USERID+' should match '+allTests[i].result[j].userID)
            
            if(USERID==allTests[i].result[j].userID)
            {
                attempt = true
                
            }              
            
        }   
        if(attempt==false)$question.innerHTML+=('<br/>'+(count)+ ' TestCode '+allTests[i].name)
             
        count++

    }
}

async function loadTest(testName){     
        //console.log("Global: "+TOKEN)
        availableQuestions = []
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
        //console.log(data)

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
            if(isGiven)
            newQues.originalAttempt(data.previousAttempt[i].status)
            
        }       
        
        DisplayFirstQuestion()
        //giving 3 minutes per question
        startTimer(availableQuestions.length*2*60,$time)
    }

async function saveTestResult(testName){     
    console.log('name1: '+USERNAME)
        for(i=0;i<availableQuestions.length;i++)
        {
            questionwiseResut.push({questionID: availableQuestions[i].id,
                                    status: availableQuestions[i].getAttempted()})
        }
        //console.log(questionwiseResut)
        const response  = await fetch("/testPaper/"+TESTID, {          
        // Adding method type
        method: "PATCH",
          
        header: {
            "Authorization": "Bearer " + TOKEN
        },
        // Adding body or contents to send
        body: JSON.stringify({
                result:[{userID:USERID,
                userName:USERNAME,
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
        //console.log(data)

       
    }


function DisplayFirstQuestion()
{
    $questionText.innerHTML = availableQuestions[questionCount].question
    MathJax.typeset()
    $questionNumber.innerHTML = 'Question '+(questionCount+1)+' out of '+availableQuestions.length
    $image.style.display='none'
    console.log(availableQuestions[questionCount].image)
    if(availableQuestions[questionCount].image&&availableQuestions[questionCount].image!='')
    {
     console.log('ARE WE LOOKING FOR AWS')
     $image.style.display=''
     image.src = ('/uploads/'+availableQuestions[questionCount].image)  
     
    }    
    ManageAnswerOptions(availableQuestions[questionCount].getType())
}



function DisplayNextQuestion()
{
    if(questionCount<availableQuestions.length-1)
    {  
         questionCount++
         $questionText.innerHTML = availableQuestions[questionCount].question
    }
    if(!availableQuestions[questionCount].getAttempted())
    $lastQuestionStatus.innerHTML = ""
    else
    $lastQuestionStatus.innerHTML = "You Marked: "+availableQuestions[questionCount].getAttempted()
    
    $questionNumber.innerHTML = 'Question '+(questionCount+1)+' out of '+availableQuestions.length
    MathJax.typeset()
    $image.style.display='none'
    console.log(availableQuestions[questionCount].image)
    if(availableQuestions[questionCount].image&&availableQuestions[questionCount].image!='')
    {
     console.log('ARE WE LOOKING FOR AWS')
     $image.style.display=''
     image.src = ('/uploads/'+availableQuestions[questionCount].image)  
     
    }
    if(questionCount==availableQuestions.length-1)
    {
        $submitTestButton.style.display =''
    }

    ManageAnswerOptions(availableQuestions[questionCount].getType())
    
   
}

function DisplayPreviousQuestion()
{
    //console.log(0 +"<"+questionCount)
    if(questionCount>0)
    {questionCount--
    $questionText.innerHTML = availableQuestions[questionCount].question}  
    
    if(!availableQuestions[questionCount].getAttempted())
    $lastQuestionStatus.innerHTML = ""
    else
    $lastQuestionStatus.innerHTML = "You Marked: "+availableQuestions[questionCount].getAttempted()
    $questionNumber.innerHTML = 'Question '+(questionCount+1)+' out of '+availableQuestions.length
    MathJax.typeset()
    $image.style.display='none'
    console.log(availableQuestions[questionCount].image)
    if(availableQuestions[questionCount].image&&availableQuestions[questionCount].image!='')
    {
     console.log('ARE WE LOOKING FOR AWS')
     $image.style.display=''
     image.src = ('/uploads/'+availableQuestions[questionCount].image)  
     
    }
    ManageAnswerOptions(availableQuestions[questionCount].getType())
}

function MarkAnswer(markedAnswer,question)
{
    try{
        question.markAttemped(markedAnswer)

        if(isGiven==false){
        if(questionCount < availableQuestions.length-1)
        $lastQuestionStatus.innerHTML = "You Marked: "+question.getAttempted()
        else
        $lastQuestionStatus.innerHTML = "You Marked: "+question.getAttempted()+". :Please Submit Answers before leaving"
        }
        if(isGiven==true){
            $lastQuestionStatus.innerHTML = "You Marked: "+question.getAttempted()+". Correct Answer: "+question.getCorrectAnswer()+". Originally Answered: "+question.getSavedAnswer()
        }

        for(i=0;i<availableQuestions.length;i++)
        {
            console.log(i+1+"th is Marked: "+availableQuestions[i].getAttempted())
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