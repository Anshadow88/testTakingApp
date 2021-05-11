const $newQuestionText = document.querySelector('#newQuestionTyped')
let inputQuestionText =""
let modifiedText=""

const $showMathButton = document.querySelector('#showMathButton')
const $writeMathsButton = document.querySelector('#writeMathsButton')
const $postQuestionButton = document.querySelector('#postQuestionButton')

let QUESID
const $questionTextWithMath = document.querySelector('#newQuestionWithMaths')

let $chapterNumberButtons = document.getElementsByName('chapterNumber')
let $correctAnswerButtons = document.getElementsByName('correctAnswer')

let selectedChapter = ""
let selectedAnswer = ""

const inputImage = document.getElementById('image');
let imageFile
// add event listener
inputImage.addEventListener('change', () => {
    imageFile = inputImage.files[0]
});

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

const uploadFile = (file) => {

    // add file to FormData object
    const fd = new FormData();
    fd.append('avatar', file);

    // send `POST` request
    fetch('/questions/'+QUESID+'/image', {
        method: 'POST',
        body: fd
    })
    .then(res => res.json())
    .then(json => console.log(json))
    .catch(err => console.error(err));
    location.reload()
}


async function postQuestion(){
  
    if(!modifiedText||!selectedAnswer||!selectedChapter)
    return
    
    const response = await fetch("/questions", {
      
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
.then().then()

var data = await response.json()
console.log(data)
QUESID = data._id
if(data._id)
   uploadFile(imageFile)//609a7c41f7ac6623f09ec8ea
}