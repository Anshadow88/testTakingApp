let TestForGuest 
  

  async function CreatePage(){

    const testDiv = document.getElementById('testDiv')
    while(testDiv.hasChild){
      testDiv.remove(testDiv.firstChild)
    }
    //Create Test Div
     {
      
  
      let newDiv = document.createElement('div')
      newDiv.className = "well well-sm test"
      testDiv.appendChild(newDiv)
  
       
      let row = document.createElement('div')
      row.className ="row"
      newDiv.appendChild(row)
  
      let count = -1
        TestForGuest.questionsOfChapter.forEach(ques=>{            
            count++
            if(count%4==0)
            {row = document.createElement('div')
            row.className ="row"
            newDiv.appendChild(row)}
  
            let colsm3 = document.createElement('div')
            colsm3.className ="col-sm-3"
            row.appendChild(colsm3)
            
            let newDiv2 = document.createElement('div')
            newDiv2.className ="well well-sm"
            colsm3.appendChild(newDiv2)
  
            let newh4 = document.createElement('h4')
            newDiv2.appendChild(newh4)
            newh4.innerHTML = 'Q.'+count+' '+ques.question.substring(0,50)
          
                       
            let linkToQuestion = document.createElement('a')
            var link = document.createTextNode("Show Full");
            linkToQuestion.appendChild(link); 
            newDiv2.appendChild(linkToQuestion)
            
            linkToQuestion.href='/question/'+TestForGuest.allQuestionsIDs[count]
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
    CreatePage()
  
  }
  
  //getAllTestData(localStorage.chapterNumber-1)
  
  console.log(document.getElementById('testName').innerHTML)
  const testName = document.getElementById('testName').innerHTML
  getTestForGuest(testName)
  
  
  
  
  
  
  
  
  
  
  
  //
  
  
  
  
  
  
  