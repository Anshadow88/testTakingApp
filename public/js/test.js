const $questionText = document.querySelector('#question')
const $getQuestionButton = document.querySelector('#getQuestionButton')
const $nextQuestionButton = document.querySelector('#nextQuestionButton')
const $previousQuestionButton = document.querySelector('#previousQuestionButton')

const $classSelect = document.querySelector("#classSelect")
var classSelected="11"
const $chapterSelect = document.querySelector("#chapterSelect")
var chapterSelected="0"


var availableQuestionsArray = []
currentQuestionCount=0

$classSelect.addEventListener('click',(e)=>{    
    classSelected = $classSelect.value
})

$chapterSelect.addEventListener('click',(e)=>{    
    chapterSelected = $chapterSelect.value
})

$getQuestionButton.addEventListener('click',(e)=>{
    getQuestionsOfChapter(chapterSelected)
    
})

$nextQuestionButton.addEventListener('click',(e)=>{
    DisplayNextQuestion()
})

$previousQuestionButton.addEventListener('click',(e)=>{
    DisplayPreviousQuestion()
})

async function getQuestion(id){  
    const response = await fetch("https://physicstree.herokuapp.com/questions/"+id)
    var data = await response.json();
    console.log(data)
    var modifiedString = data.toString()    
    modifiedString = inputQuestionText.replace(/(\r\n|\r|\n)/g, '<br>')
    $questionText.innerHTML = modifiedString
}

async function getQuestionsOfChapter(chapt){     
        console.log("Global: "+TOKEN)
        const response  = await fetch("https://physicstree.herokuapp.com/questions/chapter", {          
        // Adding method type
        method: "POST",
          
        header: {
            "Authorization": "Bearer " + TOKEN
        },
        // Adding body or contents to send
        body: JSON.stringify({
            chapter: chapt    
        }),
        // Adding headers to the request
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
        }).then().then()

        var data = await response.json()
    

        for(i=0;i<data.length;i++){
            var newQues = new Quest(data[i].question,data[i].answer)
            availableQuestionsArray.push(newQues)
            console.log(data[i].question)
        }

        DisplayCurrentQuestion()
    }

function DisplayCurrentQuestion()
{
    $questionText.innerHTML = availableQuestionsArray[currentQuestionCount].question
    MathJax.typeset()
}
function DisplayNextQuestion()
{
    console.log(availableQuestionsArray.length +">"+currentQuestionCount)
    if(currentQuestionCount<availableQuestionsArray.length-1)
    {currentQuestionCount++
    $questionText.innerHTML = availableQuestionsArray[currentQuestionCount].question}
    MathJax.typeset()
}
function DisplayPreviousQuestion()
{
    console.log(0 +"<"+currentQuestionCount)
    if(currentQuestionCount>0)
    {currentQuestionCount--
    $questionText.innerHTML = availableQuestionsArray[currentQuestionCount].question}
    MathJax.typeset()
}


var Quest = class{
     constructor(question,answer)
    {
        this.question = question
        this.answer = answer
    }
    

}



