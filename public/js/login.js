
const $studentEmail = document.querySelector('#studentEmail')
const $studentPassword = document.querySelector('#studentPassword')
const $loginForm = document.querySelector('#loginForm')
const $testApp = document.querySelector('#testApp')
$testApp.style.display = "none"
window.USERID= ""
window.TOKEN=""

const $teacherEmail = document.querySelector('#teacherName')
const $teacherPassword = document.querySelector('#teacherPassword')

const $studentLoginButton = document.querySelector('#studentLoginButton')


$studentLoginButton.addEventListener('click',(e)=>{
    //console.log("Clicked Login")    
    goToQuestionPage()   
})


   
async function goToQuestionPage(){
  
    
    var response = await fetch("https://physicstree.herokuapp.com/users/login", {
      
    // Adding method type
    method: "POST",
      
    // Adding body or contents to send
    body: JSON.stringify({
        email: $studentEmail.value,
        password: $studentPassword.value
    }),
    // Adding headers to the request
    headers: {
        "Content-type": "application/json; charset=UTF-8"
    }
    })
    .then(//response => {        
    //     
    // }
    ).then()
    if(response.status==200)
    {
            $testApp.style.display = "block"
            $loginForm.style.display = "none"            
    }
var data = await response.json()
USERID = data.user._id
TOKEN = data.token

}
