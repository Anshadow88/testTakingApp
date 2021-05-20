let $questionType = document.getElementById('questionType')
let questionType= 1
if(sessionStorage.questionType) questionType = sessionStorage.questionType
setQuestionTypeEverywhere()

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

let $fixExamNameButton = document.getElementById('fixExamNameButton')
var $examNameButtons = document.getElementsByName('examNameButtons')

let $chapterNumberInput = document.getElementById('chapterNumberInput')
let $fixChapterNameButton = document.getElementById('fixChapterNameButton')
let $yearOfExamInput = document.getElementById('yearOFExamInput')
let $setYearOfExamButton = document.getElementById('setYearOfExamButton')
let $setQuestionTypeButton = document.getElementById('setQuestionTypeButton')


let selectedChapter = 0
if(sessionStorage.selectedChapter) selectedChapter = sessionStorage.selectedChapter
$chapterNumberInput.value = selectedChapter
let selectedAnswer = ""
let examName=0
if(sessionStorage.examName)examName = sessionStorage.examName 
console.log($examNameButtons[examName])
$examNameButtons[examName].checked = true
let yearOfExam = 0
if(sessionStorage.yearOfExam) yearOfExam = sessionStorage.yearOfExam
$yearOfExamInput.value = yearOfExam



const $inputImage = document.getElementById('image');
let imageFile
// add event listener
$inputImage.addEventListener('change', () => {
    imageFile = $inputImage.files[0]
});

$setQuestionTypeButton.addEventListener('click',(e)=>{
    questionType = $questionType.value
    sessionStorage.questionType = questionType
    setQuestionTypeEverywhere()
})

$fixChapterNameButton.addEventListener('click',(e)=>{
    selectedChapter=$chapterNumberInput.value
    sessionStorage.setItem("selectedChapter",$chapterNumberInput.value)
 
})

$setYearOfExamButton.addEventListener('click',(e)=>{
    yearOfExam=$yearOfExamInput.value
    sessionStorage.setItem("yearOfExam",$yearOfExamInput.value)
 
})

$fixExamNameButton.addEventListener('click',(e)=>{
    for (var rc of $examNameButtons) {
        if (rc.checked) {
            examName = rc.value;
            console.log(examName)
            break;
        }
    }
    sessionStorage.setItem("examName",examName)
})

$nameOfTypistButton.addEventListener('click',(e)=>{
    sessionStorage.setItem("nameOfTypist", $nameOfTypist.value)
    nameOfTypist = $nameOfTypist.value
})


$showMathButton.addEventListener('click',(e)=>{

    inputQuestionText = $newQuestionText.value
    modifiedText = inputQuestionText.replace(/(?:\r\n|\r|\n)/g, "<br>")    
    $questionTextWithMath.innerHTML = modifiedText    

})



$postQuestionButton.addEventListener('click',(e)=>{   
    inputQuestionText = $newQuestionText.value
    modifiedText = inputQuestionText.replace(/(?:\r\n|\r|\n)/g, "<br>")

    yearOfExam = $yearOfExamInput.value
    selectedChapter = $chapterNumberInput.value
    takeInputFromCorrectTypeAnswer()
    
    for (var rc of $examNameButtons) {
        if (rc.checked) {
            examName = rc.value;
            console.log(examName)
            break;
        }
    }
    if(!modifiedText||!selectedAnswer||!selectedChapter||!nameOfTypist||!examName)
    {
        alert('Please fill all fields')
        return
    }
    
    if(imageFile)
    uploadFile(imageFile)
    else
    postQuestion()
})

function takeInputFromCorrectTypeAnswer(){
    if(questionType==1)
    {        
        let $correctAnswerButtons = document.getElementsByName('correctAnswer')
        for (var rb of $correctAnswerButtons) {
            if (rb.checked) {
                selectedAnswer = rb.value;
                console.log(selectedAnswer)
                break;
            }
        }
    }
    
    else if(questionType==2)//morethanOne
    {        
        let $multipleCorrectAnswerButtons = document.getElementsByName('multipleCorrectAnswer')
        selectedAnswerString=''
        for (var rb of $multipleCorrectAnswerButtons) {
            if (rb.checked) {
                selectedAnswerString += rb.value;                              
            }
        }
        selectedAnswer = selectedAnswerString
        console.log(selectedAnswerString)
    }
    else if(questionType==3)//integerType
    {
        selectedAnswer = document.getElementById('answerInteger').value
    }
    else if(questionType==4)//decimaltype
    {
        selectedAnswer = document.getElementById('answerDecimal').value
    }


}


function setQuestionTypeEverywhere(){    
    document.getElementById('SingleOptions').style.display='none'
    document.getElementById('MoreThanOneOptions').style.display='none'
    document.getElementById('IntegerType').style.display='none'
    document.getElementById('DecimalType').style.display='none'
    if(questionType==1){
        document.getElementById('SingleOptions').style.display=''
    }else if(questionType == 2){
        document.getElementById('MoreThanOneOptions').style.display=''
    }else if(questionType == 3){
        document.getElementById('IntegerType').style.display=''
    }else if(questionType == 4){
        document.getElementById('DecimalType').style.display=''
    }
 }


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
  
    
    const response = await fetch("/questions", {
      
    // Adding method type
    method: "POST",
      
    // Adding body or contents to send
    body: JSON.stringify({
        question: modifiedText,
        answer: selectedAnswer,
        chapter: selectedChapter,
        author: nameOfTypist,
        image: imageKeyAWS,
        exam: examName,
        year: yearOfExam

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