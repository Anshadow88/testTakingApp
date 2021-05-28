const $openProfieButton = document.getElementById('openProfieButton')
$openProfieButton.addEventListener('click',()=>{
    console.log('Profile')
    ShowProfile()
    SwitchStudentSections(1)
})
const $openResultButton = document.getElementById('openResultButton')
$openResultButton.addEventListener('click',()=>{
    console.log('Result')
    SwitchStudentSections(2)
})
const $openTestAppButton = document.getElementById('openTestAppButton')
$openTestAppButton.addEventListener('click',()=>{
    console.log('TestApp')
    SwitchStudentSections(3)
})
function ShowProfile()
{
    document.getElementById('studenName').innerHTML = USERNAME

}
function SwitchStudentSections(count){
    document.getElementById("profileSection").style.display="none";

   // document.getElementById('profileSection').style.display='none'   
    document.getElementById('resultSection').style.display='none'
    document.getElementById('testApp').style.display='none'

    if(count==1)document.getElementById('profileSection').style.display= 'block'
    else if(count==2)document.getElementById('resultSection').style.display='block'
    else if(count==3)document.getElementById('testApp').style.display='block'
}

//RESULT SECTION
let $table = document.getElementById('resultTable')

$openResultButton.addEventListener('click',(e) =>{
  
  console.log(TESTSTAKEN.length)

  TESTSTAKEN.forEach(testdata => {
    console.log('accessing test data in other file')
    console.log('TestID: '+testdata.testID+' marks '+testdata.marks+' out Of'+testdata.maxMarks) 

  })
  addTable()
})
function addTable() {
  var $myTableDiv = document.getElementById("myDynamicTable");
    
  var table = document.createElement('TABLE');
  table.className ='table'

  var tableHead = document.createElement('thead')
  table.appendChild(tableHead)
  var headRow = document.createElement('tr')
  tableHead.appendChild(headRow)


    for (var j = 0; j < 3; j++) {
      var td = document.createElement('TD');
      if(j==0)
      td.appendChild(document.createTextNode('<b>Test Code</b>'))
      else if(j==1)
      td.appendChild(document.createTextNode('<b>Marks</b>'))
      else if(j==2)
      td.appendChild(document.createTextNode('<b>Max Marks</b>'))

      headRow.appendChild(td)
    }
  

  var tableBody = document.createElement('TBODY');
  table.appendChild(tableBody);
  while(tableBody.hasChildNodes())
        {
            tableBody.removeChild(tableBody.firstChild);
        }
  

  for (var i = 0; i < TESTSTAKEN.length; i++) {
    var tr = document.createElement('TR');
    tableBody.appendChild(tr);

    for (var j = 0; j < 3; j++) {
      var td = document.createElement('TD');
      if(j==0)
      td.appendChild(document.createTextNode(TESTSTAKEN[i].testName));
      else if(j==1)
      td.appendChild(document.createTextNode(TESTSTAKEN[i].marks));
      if(j==2)
      td.appendChild(document.createTextNode(TESTSTAKEN[i].maxMarks));
      tr.appendChild(td);
    }
  }
  myTableDiv.appendChild(table);
}

addTable();



