

function SetTestID(testName){
    localStorage.setItem('TESTNAME',testName)
    console.log(localStorage.TESTNAME)
    openInNewTab("/AllTestTaker.html")

    
}

function openInNewTab(url) {
    const win = window.open(url);
    win.focus();
  }
