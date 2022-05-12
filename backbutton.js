const doneButton = document.getElementById("done")
console.log(doneButton, 'doneButton')
    doneButton.classList.add("button-color")
    doneButton.addEventListener('click', (e) => { 
        e.preventDefault()
        console.log("clicked")
        window.electron.closeDownloadPage()
    })