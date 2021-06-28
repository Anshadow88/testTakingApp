let TestForGuest 
let quesCount = 0

 
console.log(document.getElementById('testName').innerHTML)
const testName = document.getElementById('testName').innerHTML
getTestForGuest(testName)

async function CreateAnswerKey(){

    const testDiv = document.getElementById('testDiv')
    while(testDiv.hasChild){
      testDiv.remove(testDiv.firstChild)
    }
    //Create Answer Key
     {
      
  
      let newDiv = document.createElement('div')
      newDiv.className = "well well-sm test"
      testDiv.appendChild(newDiv)   
      
      let newP = document.createElement('h4')
      newDiv.className = "well well-sm"
      newP.appendChild(document.createTextNode('AnswerKey'))
      newDiv.appendChild(newP)   
      
      let count = -1
        TestForGuest.questionsOfChapter.forEach(ques=>{            
            count++    
            let linkToQuestion = document.createElement('a')
            var link = document.createTextNode(' Q.'+(count+1)+' '+' , '+' ');
            linkToQuestion.appendChild(link); 
            newDiv.appendChild(linkToQuestion)            
            linkToQuestion.href='/question/'+TestForGuest.allQuestionsIDs[count]
            linkToQuestion.target='_blank'
            console.log(linkToQuestion)
         })
    }
}
  
async function getTestForGuest(testName){
    const response  = await fetch("/getTestForGuest", {   
    method: "POST",          
    header: {
       // "Authorization": "Bearer " + TOKEN
    },
    body: JSON.stringify({
        name: testName 
    }),
    headers: {
        "Content-type": "application/json; charset=UTF-8"
    }
    }).then().then()
  
    var data = await response.json()   
    console.log(data)
    TestForGuest=(data)
    CreateAnswerKey()
    quesCount = 0
    ShowCurrentQuestion(quesCount)
  
}
  
  //getAllTestData(localStorage.chapterNumber-1)
 


  
  
  document.getElementById('showAnswer').addEventListener('click',e=>{
    document.getElementById('questionAnswer').innerHTML = TestForGuest.questionsOfChapter[quesCount].answer
  })
  

function ShowCurrentQuestion(){
  console.log(TestForGuest.questionsOfChapter[quesCount].image)
  document.getElementById('questionAnswer').innerHTML = ''
  document.getElementById('questionText').innerHTML = getExamName(TestForGuest.questionsOfChapter[quesCount].exam) +' '+TestForGuest.questionsOfChapter[quesCount].year+'<br>'
  document.getElementById('questionText').innerHTML += 'Q'+(quesCount+1)+': '+TestForGuest.questionsOfChapter[quesCount].question
  
  console.log('/uploads/'+TestForGuest.questionsOfChapter[quesCount].image)

  document.getElementById('questionImage').src = '/uploads/'+TestForGuest.questionsOfChapter[quesCount].image
  document.getElementById('questionImage').style.display = 'block'
    
  
     MathJax.typeset()

}

document.getElementById('nextQuestion').addEventListener('click',e=>{
  ShowNextQuestion()
})
function ShowNextQuestion(){
  if(quesCount<TestForGuest.questionsOfChapter.length)
  {quesCount++
  ShowCurrentQuestion(quesCount)}
}

document.getElementById('previousQuestion').addEventListener('click',e=>{
  ShowNextQuestion()
})
function ShowPreviousQuestion(){
  if(quesCount>0){
  quesCount--
  ShowCurrentQuestion(quesCount)}
}
  

function getExamName(count){
  if(count=='1')return ('NEET')
  else if(count=='2')return('JEE Mains')
  else if(count=='3')return('JEE Advanced')
  else return count

}
  ///////////////////////////////TEST APP

