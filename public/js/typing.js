const $newQuestionText = document.querySelector('#newQuestionTyped')
const $successMessageText = document.querySelector('#successMessage')
let inputQuestionText =""
let modifiedText=""

const $showMathButton = document.querySelector('#showMathButton')
const $writeMathsButton = document.querySelector('#writeMathsButton')
const $postQuestionButton = document.querySelector('#postQuestionButton')

const $questionTextWithMath = document.querySelector('#newQuestionWithMaths')

let $chapterNumberButtons = document.getElementsByName('chapterNumber')
let $correctAnswerButtons = document.getElementsByName('correctAnswer')

var selectedChapter = ""
var selectedAnswer = ""

$showMathButton.addEventListener('click',(e)=>{

    inputQuestionText = $newQuestionText.value
   // modifiedText = inputQuestionText.replace("(a)","<br/>(a)")
   modifiedText = inputQuestionText.replace(/(?:\r\n|\r|\n)/g, "<br>")
    
    $questionTextWithMath.innerHTML = modifiedText
    
    for (var rb of $correctAnswerButtons) {
        if (rb.checked) {
            selectedAnswer = rb.value;
            console.log(selectedAnswer)
            break;
        }
    }
    for (var rc of $chapterNumberButtons) {
        if (rc.checked) {
            selectedChapter = rc.value;
            console.log(selectedChapter)
            break;
        }
    }

})

$postQuestionButton.addEventListener('click',(e)=>{    
    postQuestion()
})

async function postQuestion(){
  
    
    fetch("http://localhost:3000/questions", {
      
    // Adding method type
    method: "POST",
      
    // Adding body or contents to send
    body: JSON.stringify({
        question: modifiedText,
        answer: selectedAnswer,
        chapter: selectedChapter

    }),
    // Adding headers to the request
    headers: {
        "Content-type": "application/json; charset=UTF-8"
    }
})
  
// Converting to JSON
.then(response => {
                    response.json()
                    if(response.status==201)
                    {
                        //Show Success
                        $successMessageText.innerHTML = "SUCCESS: Please write next Question"
                    }
})
  
// Displaying results to console
.then()
}