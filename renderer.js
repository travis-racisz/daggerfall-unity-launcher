let newReleaseAvailable = false
const body = document.querySelector('body')
const checkForUpdate = document.createElement("button")
checkForUpdate.innerText = "Check for update"
checkForUpdate.addEventListener('click', () => {
        newReleaseAvailable = window.electron.checkForNewRelease('checkForUpdate')
    })

document.getElementById('dirs').addEventListener('click', (e) => {
    e.preventDefault()
    window.postMessage({ 
            type: 'select-dirs'
        })
        containerDiv.appendChild(progressBar)
    })

    const directoryName = document.createElement("p")
    window.electron.getDirectory((event, dir) => { 
        directoryName.innerHTML = dir
        window.electron.getRelease()
        .then(res => {
                window.electron.getRemoteFile(res.name, res.browser_download_url, dir)
            })
    })
    const progressBar = document.createElement("progress")
    progressBar.setAttribute("max", 100)
    progressBar.setAttribute("value", 0)
    window.addEventListener('message', event => {
        if (event.data[0] === 'showProgress') {
            progressBar.setAttribute("value", event.data[1])
        }
    })
    document.addEventListener('DOMContentLoaded', () => {
        if(progressBar.value >= 100){
            body.removeChild(progressBar)
            const success = document.createElement("p")
            success.innerHTML = "success!"
            body.appendChild(success)
        }
    })

    const currentRelease = document.createElement("p")
    const containerDiv = document.getElementsByClassName("small-col-flex")[0]
    currentRelease.innerHTML = "Current Release: " + window.electron.getCurrentRelease()
    containerDiv.appendChild(currentRelease)
    body.appendChild(directoryName)
    currentRelease.classList.add("text");
    