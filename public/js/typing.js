let $nameOfTypist = document.getElementById('nameOfTypist')
const $nameOfTypistButton = document.getElementById('nameOfTypistButton')
let nameOfTypist = sessionStorage.nameOfTypist
$nameOfTypist.value = nameOfTypist
const $newQuestionText = document.querySelector('#newQuestionTyped')
let inputQuestionText =""
let modifiedText=""
let imageKeyAWS

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


$nameOfTypistButton.addEventListener('click',(e)=>{
    sessionStorage.setItem("nameOfTypist", $nameOfTypist.value)
    nameOfTypist = $nameOfTypist.value
})


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
    if(imageFile)
    uploadFile(imageFile)
    else
    postQuestion()
})

async function uploadFile(file) {
    imageKeyAWS=''
    // add file to FormData object
    const fd = new FormData();
    fd.append('avatar', file);

    // send `POST` request
    const response = await fetch('/questions/'+QUESID+'/image', {
        method: 'POST',
        body: fd
    })
    .then()
    .then()
    .catch()
    
    
    var data = await response.json()
    console.log(data.filename)
    imageKeyAWS = data.filename
    postQuestion()

}


async function postQuestion(){
  
    if(!modifiedText||!selectedAnswer||!selectedChapter||!nameOfTypist)
    {
        alert('Please fill all fields')
        return
    }
    
    const response = await fetch("/questions", {
      
    // Adding method type
    method: "POST",
      
    // Adding body or contents to send
    body: JSON.stringify({
        question: modifiedText,
        answer: selectedAnswer,
        chapter: selectedChapter,
        author: nameOfTypist,
        image: imageKeyAWS

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
location.reload()

}