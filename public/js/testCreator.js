const $QuestionID = document.getElementById('QuestionID')
const $FindQuestionByIDButton = document.getElementById('FindQuestionByIDButton')

const $FindChapterName = document.getElementById('FindChapterName')
const $FindChapterButton = document.getElementById('FindChapterButton')

const $questionNumber = document.getElementById('questionNumber')
const $newQuestionText = document.querySelector('#newQuestionTyped')
//const $correctAnswer = document.querySelector('#correctAnswer')
const $chapterNumber = document.querySelector('#chapterNumber')
const $paper = document.getElementById('paper')

const $previousButton = document.querySelector('#previousButton')
const $nextButton = document.querySelector('#nextButton')


// const $showMathButton = document.querySelector('#showMathButton')
const $writeMathsButton = document.querySelector('#writeMathsButton')
const $selectQuestionButton = document.querySelector('#selectQuestionButton')
const $removeQuestionButton = document.querySelector('#removeQuestionButton')
const $NewTestButton = document.querySelector('#NewTestButton')
const $NewTestName = document.querySelector('#NewTestName')

let QUESID
let QuestionsOFChapters
let QuestionCount=0
const $questionTextWithMath = document.querySelector('#newQuestionWithMaths')
let SelectedQuestionIDs = []
let SelectedQuestionNumber = []
let SelectedQuestionCount =0

let selectedChapter = ""
let selectedAnswer = ""

let $image = document.getElementById('image')
//const inputImage = document.getElementById('imageInput');
let imageFile
// add event listener
// inputImage.addEventListener('change', () => {
//     imageFile = inputImage.files[0]
// });

$NewTestButton.addEventListener('click',(e)=>{
    console.log('1001')
    postNewTestPaper($NewTestName.value)

})

$FindQuestionByIDButton.addEventListener('click',(e)=>{
    QUESID = $QuestionID.value
    getQuestion(QUESID)
})

$FindChapterButton.addEventListener('click',(e)=>{
    chapterName = $FindChapterName.value
    getQuestionOfChapter(chapterName)
})

// $showMathButton.addEventListener('click',(e)=>{

//    modifiedText = $newQuestionText.value.replace(/(?:\r\n|\r|\n)/g, "<br>")    
//    $questionTextWithMath.innerHTML = modifiedText   


// })


$nextButton.addEventListener('click',(e)=>{
    QuestionCount++
    showCurrentQuestion()
    
})

$previousButton.addEventListener('click',(e)=>{
    QuestionCount--
    showCurrentQuestion()
})

$selectQuestionButton.addEventListener('click',(e)=>{    
    AddAQuestionToSelection()
})

$removeQuestionButton.addEventListener('click',(e)=>{    
    RemoveAQuestionToSelection()
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
    $newQuestionText.innerHTML=(data.question)
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
    QuestionCount = (QuestionsOFChapters.length-1)
    showCurrentQuestion()
    
}

function showCurrentQuestion(){

    
    if(QuestionCount>=QuestionsOFChapters.length)QuestionCount=QuestionsOFChapters.length-1
    if(QuestionCount<0) QuestionCount=0
    $questionNumber.innerHTML = 'No.&nbsp'+(QuestionCount+1)+ '&nbsp&nbsp&nbspID:'+QuestionsOFChapters[QuestionCount]._id
    $newQuestionText.innerHTML = (QuestionsOFChapters[QuestionCount].question)+'<br/><br/> Answer:'+(QuestionsOFChapters[QuestionCount].answer);
    $chapterNumber.value = (QuestionsOFChapters[QuestionCount].chapter);
    
    $image.style.display='none'
    console.log(QuestionsOFChapters[QuestionCount].image)
    if(QuestionsOFChapters[QuestionCount].image&&QuestionsOFChapters[QuestionCount].image!='')
    {
     console.log('ARE WE LOOKING FOR AWS')
     $image.style.display=''
     image.src = ('/uploads/'+QuestionsOFChapters[QuestionCount].image)  
     
    }
   
}

function AddAQuestionToSelection(){     
    let alreadySelected = false
    for(i=0;i<SelectedQuestionIDs.length;i++)
    {
        if(SelectedQuestionIDs[i]==QuestionsOFChapters[QuestionCount]._id)
        alreadySelected = true
    }
    if(alreadySelected==false&&QuestionsOFChapters[QuestionCount]._id)
    {
        SelectedQuestionIDs.push({'questionID': QuestionsOFChapters[QuestionCount]._id})
        SelectedQuestionNumber.push(QuestionCount)
        SelectedQuestionCount++
    }
    console.log(SelectedQuestionNumber)
    ShowPaper()
       
 }

 function RemoveAQuestionToSelection(){     
    
    SelectedQuestionIDs.pop({'questionID': QuestionsOFChapters[QuestionCount]._id})
    SelectedQuestionNumber.pop(QuestionCount)
    console.log(SelectedQuestionNumber)
    ShowPaper()
       
 }

 function ShowPaper(){
    let paperText=''
    for(i=0;i<SelectedQuestionNumber.length;i++)
    {
        paperText+= 'Q.'+ (i+1) +'&nbsp'+
        QuestionsOFChapters[SelectedQuestionNumber[i]].question+'<br/>'
    }
    $paper.innerHTML = paperText

 }

 
async function postNewTestPaper(testName){
    
    const response = await fetch("/testPaper", {
      
    // Adding method type
    method: "POST",
      
    // Adding body or contents to send
    body: JSON.stringify({
        name: testName,
        questions: SelectedQuestionIDs

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
}
