const $QuestionID = document.getElementById('QuestionID')
const $FindQuestionByIDButton = document.getElementById('FindQuestionByIDButton')

const $FindChapterName = document.getElementById('FindChapterName')
const $FindChapterButton = document.getElementById('FindChapterButton')

const $questionNumber = document.getElementById('questionNumber')
const $newQuestionText = document.querySelector('#newQuestionTyped')
const $correctAnswer = document.querySelector('#correctAnswer')
const $chapterNumber = document.querySelector('#chapterNumber')



const $previousButton = document.querySelector('#previousButton')
const $nextButton = document.querySelector('#nextButton')


const $showMathButton = document.querySelector('#showMathButton')
const $writeMathsButton = document.querySelector('#writeMathsButton')
const $postQuestionButton = document.querySelector('#postQuestionButton')

let QUESID
let QuestionsOFChapters
let QuestionCount=0
let imageKeyAWS
const $questionTextWithMath = document.querySelector('#newQuestionWithMaths')


let selectedChapter = ""
let selectedAnswer = ""

let $image = document.getElementById('image')
const inputImage = document.getElementById('imageInput');
let imageFile
// add event listener
inputImage.addEventListener('change', () => {
    imageFile = inputImage.files[0]
});


$FindQuestionByIDButton.addEventListener('click',(e)=>{
    QUESID = $QuestionID.value
    getQuestion(QUESID)
})

$FindChapterButton.addEventListener('click',(e)=>{
    chapterName = $FindChapterName.value
    getQuestionOfChapter(chapterName)
})

$showMathButton.addEventListener('click',(e)=>{

   modifiedText = $newQuestionText.value.replace(/(?:\r\n|\r|\n)/g, "<br>")    
   $questionTextWithMath.innerHTML = modifiedText   


})


$nextButton.addEventListener('click',(e)=>{
    QuestionCount++
    showCurrentQuestion()
    
})

$previousButton.addEventListener('click',(e)=>{
    QuestionCount--
    showCurrentQuestion()
})
$postQuestionButton.addEventListener('click',(e)=>{    
    if(imageFile)
    uploadFile(imageFile)
    else
    UpdateAQuestion()
})

async function getQuestion(quesID){     
    //console.log("Global: "+TOKEN)
    const response  = await fetch("/questions/"+quesID, {          
    // Adding method type
    method: "GET",
      
    header: {
    },

    
    // Adding body or contents to send
        // Adding headers to the request
    headers: {
        "Content-type": "application/json; charset=UTF-8"
    }
    }).then().then()

    var data = await response.json()   
    console.log(data)
    $newQuestionText.append(data.question)
    $image.src = '/uploads/'+QUESID+'.png'
    
}

async function getQuestionOfChapter(chapter){     
    //console.log("Global: "+TOKEN)
    const response  = await fetch("/questions/chapter", {          
    // Adding method type
    method: "POST",
      
    header: {
    },

    body: JSON.stringify({
        chapter : chapter
    }),
    // Adding body or contents to send
        // Adding headers to the request
    headers: {
        "Content-type": "application/json; charset=UTF-8"
    }
    }).then().then()

    var data = await response.json()   
    QuestionsOFChapters = data
    console.log(data)
    QuestionCount = QuestionsOFChapters.length-1
    showCurrentQuestion()
    
}

async function showCurrentQuestion(){
    //Remove Selected image for last update  
    inputImage.value=''    
    if(QuestionCount>=QuestionsOFChapters.length)QuestionCount=QuestionsOFChapters.length-1
    if(QuestionCount<0) QuestionCount=0
    $questionNumber.innerHTML = 'No.&nbsp'+(QuestionCount+1)+ '&nbsp&nbsp&nbspID:'+QuestionsOFChapters[QuestionCount]._id
    $newQuestionText.value = (QuestionsOFChapters[QuestionCount].question);
    $correctAnswer.value= (QuestionsOFChapters[QuestionCount].answer);
    $chapterNumber.value = (QuestionsOFChapters[QuestionCount].chapter);
    
    $image.style.display='none'
    console.log(QuestionsOFChapters[QuestionCount].image)
    if(QuestionsOFChapters[QuestionCount].image&&QuestionsOFChapters[QuestionCount].image!='')
    {
     console.log('ARE WE LOOKING FOR AWS')
     $image.style.display=''
     image.src = ('/uploads/'+QuestionsOFChapters[QuestionCount].image)  
     
    }

    modifiedText = $newQuestionText.value.replace(/(?:\r\n|\r|\n)/g, "<br>")    
    $questionTextWithMath.innerHTML = modifiedText   

}



// const uploadFile = (file) => {

//     // add file to FormData object
//     const fd = new FormData();
//     fd.append('avatar', file);

//     // send `POST` request
//     fetch('/questions/'+QuestionsOFChapters[QuestionCount]._id+'/image', {
//         method: 'POST',
//         body: fd
//     })
//     .then(res => res.json())
//     .then(json => console.log(json))
//     .catch(err => console.error(err));
//     alert('Successfully updated the question')
// }


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
    UpdateAQuestion()

}


async function UpdateAQuestion(){     
    
        //console.log(questionwiseResut)
        const response  = await fetch("/questionUpdate/"+QuestionsOFChapters[QuestionCount]._id, {          
        // Adding method type
        method: "PATCH",
          
        header: {
            //"Authorization": "Bearer " + TOKEN
        },
        // Adding body or contents to send
        body: JSON.stringify({
            question: $newQuestionText.value,
            answer: $correctAnswer.value,
            chapter: $chapterNumber.value,
            image : imageKeyAWS
        }),
        // Adding headers to the request
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
        }).then().then()

        var data = await response.json()   
        console.log(data)
    }
    