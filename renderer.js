
const body = document.querySelector('body')
const checkForUpdate = document.getElementById("update")
checkForUpdate.addEventListener('click', () => {
    const announcmentElement = document.createElement('h2')
    announcmentElement.id = "new-announcement"
        if(body.contains(document.getElementById('new-announcement'))) {
            body.removeChild(document.getElementById('new-announcement'))
        }
        window.electron.checkForNewRelease('checkForUpdate')
            .then(res => { 
                if(res){
                    announcmentElement.innerText = "New release available"
                    body.appendChild(announcmentElement)
                } else { 
                    announcmentElement.innerText = "No new release available"
                    body.appendChild(announcmentElement)
                }
            })
            .catch(err => {
                console.log(err)
            })
           
        })

        const launchGame = document.getElementById("launch-game")
        launchGame.addEventListener('click', () => {
            window.electron.launchGame()
        })
        
        
    


document.getElementById('dirs').addEventListener('click', (e) => {
    e.preventDefault()
    window.postMessage({ 
            type: 'select-dirs'
        })
        containerDiv.appendChild(progressBar)
    })

    document.getElementById('df-download').addEventListener('click', (e) => {
        e.preventDefault()
        window.electron.sendToDownloadPage()
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
    currentRelease.innerHTML = "Current Downloaded Version: " + window.electron.getCurrentRelease()
    containerDiv.appendChild(currentRelease)
    body.appendChild(directoryName)
    currentRelease.classList.add("text");
    