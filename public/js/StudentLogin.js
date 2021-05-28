
const $testApp = document.querySelector('#testApp')
$testApp.style.display = "none"

window.USERID= ""
window.TOKEN=""
window.USERNAME=""
window.TESTSTAKEN=[]

const $studentLoginButton = document.querySelector('#studentLoginButton')
const $teacherLoginButton = document.querySelector('#teacherLoginButton')


$studentLoginButton.addEventListener('click',(e)=>{
    const $Email = document.querySelector('#studentEmail')
    const $Password = document.querySelector('#studentPassword')
    const role = 'student'
    loginUser($Email.value, $Password.value, role)   
})

async function loginUser(email,password,userRole){   
   var response = await fetch("/users/login", {      
    method: "POST",
      
    body: JSON.stringify({
        email: email,
        password: password,
        role: userRole
    }),
    headers: {
        "Content-type": "application/json; charset=UTF-8"
    }
    })
    .then(
    ).then()
    if(response.status==200)
    {
        var data = await response.json()
       // console.log(data.user.testsTaken[0].testID+' marks '+data.user.testsTaken[0].marks + ' out of '+data.user.testsTaken[0].maxMarks)
        USERID = data.user._id
        TOKEN = data.token
        USERNAME = data.user.name
        console.log('User :'+USERID+' is a '+data.user.role)


        data.user.testsTaken.forEach(testdata => {
            TESTSTAKEN.push(testdata)

        });
        if(data.user.role=='student')
        showStudentSection() 
    }
}

function showStudentSection(){
    const $loginForm = document.querySelector('#loginForm')
    const $intro = document.querySelector('#intro')
    $loginForm.style.display = "none"  
    document.getElementById('studentMenu').style.display = 'block'       
    $intro.innerHTML = 'Hello! <b>'+USERNAME+'</b> Welcome Back!'

}




