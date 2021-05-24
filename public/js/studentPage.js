console.log('Student Page Loaded')
const $openProfieButton = document.getElementById('openProfieButton')
const $openResultButton = document.getElementById('openResultButton')
const $openTestAppButton = document.getElementById('openTestAppButton')












$openProfieButton.addEventListener('click',()=>{
    console.log('Profile')
    ShowProfile()
    SwitchSections(1)
})
$openResultButton.addEventListener('click',()=>{
    console.log('Result')
    SwitchSections(2)
})
$openTestAppButton.addEventListener('click',()=>{
    console.log('TestApp')
    SwitchSections(3)
})


function ShowProfile()
{
    document.getElementById('studenName').innerHTML = USERNAME

}

























function SwitchSections(count){
    document.getElementById("profileSection").style.display="none";

   // document.getElementById('profileSection').style.display='none'   
    document.getElementById('resultSection').style.display='none'
    document.getElementById('testApp').style.display='none'

    if(count==1)document.getElementById('profileSection').style.display= 'block'
    else if(count==2)document.getElementById('resultSection').style.display='block'
    else if(count==3)document.getElementById('testApp').style.display='block'
}



