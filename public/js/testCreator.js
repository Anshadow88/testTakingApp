
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
let SelectedQuestions = []
let SelectedQuestionCount =0

let selectedChapter = ""
let selectedAnswer = ""

let $image = document.getElementById('image')

$NewTestButton.addEventListener('click',(e)=>{
    console.log('1001')
    TestSubject = document.querySelector('#TestSubject')
    if(!$NewTestName.value||!TestSubject.value)
    alert('Fill All Fields about New Test')    
    else
    postNewTestPaper(TestSubject.value,$NewTestName.value,'0')

})

const $FindQuestionByIDButton = document.getElementById('FindQuestionByIDButton')


const $findQuestions = document.getElementById('findQuestions')
$findQuestions.addEventListener('click',(e)=>{
    exam = document.getElementById('examName').value    
    year = document.getElementById('examYear').value
    chapterName = document.getElementById('chapterNameInput').value
    getQuestions(exam,year,chapterName)

})

const $nextBigButton = document.querySelector('#nextBigButton')
$nextBigButton.addEventListener('click',(e)=>{
    QuestionCount+=25
    showCurrentQuestion()
    
})

const $previousBigButton = document.querySelector('#previousBigButton')
$previousBigButton.addEventListener('click',(e)=>{
    QuestionCount-=25
    showCurrentQuestion()
})
const $nextButton = document.querySelector('#nextButton')
$nextButton.addEventListener('click',(e)=>{
    QuestionCount++
    showCurrentQuestion()
    
})
const $previousButton = document.querySelector('#previousButton')
$previousButton.addEventListener('click',(e)=>{
    QuestionCount--
    showCurrentQuestion()
})

$selectQuestionButton.addEventListener('click',(e)=>{    
    AddAQuestionToSelection()
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
    //console.log(data)
    const $newQuestionText = document.querySelector('#newQuestionTyped')
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

async function getQuestions(exam,year,chapter){     
    //console.log("Global: "+TOKEN)
    const response  = await fetch("/findQuestions", {          
    // Adding method type
    method: "POST",
      
    header: {
    },

    body: JSON.stringify({
        exam : exam,
        year: year,
        chapter: chapter,
        author: document.getElementById('typistName').value
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
    QuestionCount = (0)
    showCurrentQuestion()
    
}

function showCurrentQuestion(){
    const $questionNumber = document.getElementById('questionNumber')
    const $newQuestionText = document.querySelector('#newQuestionTyped')
    const $chapterNumber = document.querySelector('#chapterNumber')

    
    if(QuestionCount>=QuestionsOFChapters.length)QuestionCount=QuestionsOFChapters.length-1
    if(QuestionCount<0) QuestionCount=0
    $questionNumber.innerHTML = 'Ques. <b>'+(QuestionCount+1)+ ' / '+QuestionsOFChapters.length+'</b>'//+'        Question ID:'+QuestionsOFChapters[QuestionCount]._id
    $newQuestionText.innerHTML = (QuestionsOFChapters[QuestionCount].question)+
                                '<br/><br/> Answer: <b>'+(QuestionsOFChapters[QuestionCount].answer)+'</b>'
    $chapterNumber.innerHTML = 'Chapter Name: <b>'+getChapterName((QuestionsOFChapters[QuestionCount].chapter))+'</b>&nbsp'+
                                'Exam: <b>'+ getExamName(QuestionsOFChapters[QuestionCount].exam)+'</b>&nbsp'+
                                'Year: <b>'+ QuestionsOFChapters[QuestionCount].year+'</b>'

    
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
    SelectedQuestionIDs.forEach(e => {
            if(e == QuestionsOFChapters[QuestionCount]._id )   
            alreadySelected = true;            
    })
    if(!alreadySelected){
         SelectedQuestions.push(QuestionsOFChapters[QuestionCount])
         SelectedQuestionIDs.push({'questionID':QuestionsOFChapters[QuestionCount]._id})
    }
    ShowPaper()       
 }

 

 function RemoveThisQuestionToSelection(id){     
    
    SelectedQuestionIDs.pop({'questionID': SelectedQuestionIDs[id]})
    SelectedQuestions.pop(QuestionsOFChapters[id])
    
    ShowPaper()
       
 }

 function ShowPaper(){
    const $paper = document.getElementById('paper')
    while($paper.hasChildNodes())
        {
            $paper.removeChild($paper.firstChild);
        }
    
    for(i=0;i<SelectedQuestions.length;i++)
    {
        let newDiv = document.createElement('div')        
             newDiv.className = "well well-sm"
        $paper.appendChild(newDiv)
        let cancelBtn = document.createElement('button')
            cancelBtn.innerHTML='&#10060'
            cancelBtn.addEventListener('click', e=>{RemoveThisQuestionToSelection(i)})
        newDiv.appendChild(cancelBtn)
        let newP = document.createElement('p')
          newP.innerHTML = 'Q.'+ (i+1) +'&nbsp'+ SelectedQuestions[i].question+'<br/><br/>'
          newDiv.appendChild(newP)
    }
 }
 
async function postNewTestPaper(subject,testName,visibility){
    const response = await fetch("/testPaper", {      
    // Adding method type
    method: "POST",      
    // Adding body or contents to send
    body: JSON.stringify({
        name: testName,
        author: USERID,
        questions: SelectedQuestionIDs,
        visibility: visibility,
        subject: subject
    }),
    // Adding headers to the request
    headers: {
        "Content-type": "application/json; charset=UTF-8"
    }
})
.then().then()

var data = await response.json()
console.log(data)
}

function getChapterName(number){
    if(number==0)return ''    
    if(number==1)return 'Vectors, Maths & Errors'
    else if(number==2)return 'Kinematics'
    else if(number==3)return 'Newtons Laws'
    else if(number==4)return 'Work, Power & Energy'
    else if(number==5)return 'Conservation of Momentum'
    else if(number==6)return 'Rotational Motion'
    else if(number==7)return 'Properties of Matter'
    else if(number==8)return 'Gravitation '
    else if(number==9)return 'Fluid Mechanics'
    else if(number==10)return 'Thermodynamics'
    else if(number==11)return 'Oscillation (SHM)'
    else if(number==12)return 'Waves'
    else if(number==13)return 'Electrostatics'
    else if(number==14)return 'Current Electricity'
    else if(number==15)return 'Magnetism'
    else if(number==16)return 'EMI & AC'   
    else if(number==17)return 'Ray Optics'
    else if(number==18)return 'Wave Optics'
    else if(number==19)return 'Modern Physics'  
    else if(number==20)return 'Semiconductors'
}

function getExamName(number){
    if(number == 0)return ''
    else if(number==1) return 'NEET'
    else if(number==2) return 'JEE Mains'
    else if(number==3) return 'Advanced'
    else if(number==4) return 'State Exams'


}