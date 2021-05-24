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
  var myTableDiv = document.getElementById("myDynamicTable");
  myTableDiv.childNodes = new Array()

  var table = document.createElement('TABLE');
  table.className ='table'

  var tableHead = document.createElement('thead')
  table.appendChild(tableHead)
  var headRow = document.createElement('tr')
  tableHead.appendChild(headRow)

    for (var j = 0; j < 3; j++) {
      var td = document.createElement('TD');
      if(j==0)
      td.appendChild(document.createTextNode('Test Code'))
      else if(j==1)
      td.appendChild(document.createTextNode('Marks'))
      else if(j==2)
      td.appendChild(document.createTextNode('Max Marks'))

      headRow.appendChild(td)
    }
  

  var tableBody = document.createElement('TBODY');
  table.appendChild(tableBody);
  

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

