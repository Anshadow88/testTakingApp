let TestForGuest 
let quesCount = 0

 
var url = window.location.pathname;
    var testNameFromURL = url.substring(url.lastIndexOf('/') + 1)
    let testName = testNameFromURL.replaceAll("%20"," " )
    
getTestForGuest(testName)

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
    quesCount = 0
    ShowCurrentQuestion(quesCount)
  
}
  
  
  
document.getElementById('showAnswerButton').addEventListener('click',e=>{
    document.getElementById('questionAnswer').innerHTML = 'Answer: '+TestForGuest.questionsOfChapter[quesCount].answer
})
  

function ShowCurrentQuestion(){
  console.log(TestForGuest.questionsOfChapter[quesCount].image)
  document.getElementById('questionAnswer').innerHTML = ''
  document.getElementById('questionText').innerHTML = getExamName(TestForGuest.questionsOfChapter[quesCount].exam) +' '+TestForGuest.questionsOfChapter[quesCount].year+'<br><br>'
  document.getElementById('questionText').innerHTML += 'Q'+(quesCount+1)+': '+TestForGuest.questionsOfChapter[quesCount].question
  
  console.log('/uploads/'+TestForGuest.questionsOfChapter[quesCount].image)

  if(TestForGuest.questionsOfChapter[quesCount].image)
  {document.getElementById('questionImage').src = '/uploads/'+TestForGuest.questionsOfChapter[quesCount].image
  document.getElementById('questionImage').style.display = 'block'}
  else
  {
    document.getElementById('questionImage').style.display = 'none'
  }
    
  
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

