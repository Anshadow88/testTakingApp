function SetChapterNumber(chapterNumber){
    localStorage.setItem('chapterNumber',chapterNumber)
    console.log(localStorage.chapterNumber)
    openInNewTab("/chapter.html")    
}

function openInNewTab(url) {
    const win = window.open(url);
    win.focus();
  }

  //WHY THE FUCK
