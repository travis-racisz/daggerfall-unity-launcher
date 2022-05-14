
const body = document.querySelector('body')
const checkForUpdate = document.getElementById("update")
const downloadContainer = document.getElementById('download-container')
const dfDownload = document.getElementById('df-download')
const mods = document.getElementById('mods')
const directoryName = document.createElement("p")
const launchGameContainer = document.getElementById('launch-game-container')
const launchingGame = document.createElement("p")
const currentRelease = document.createElement("p")
const containerDiv = document.getElementsByClassName("small-col-flex")[0]



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
        



dfDownload.addEventListener('click', (e) => {
    e.preventDefault()
    const progressBar = document.getElementById('progress')
    const downloadMessage = document.getElementById('download-message')
    progressBar.classList.remove('hidden')
    downloadMessage.classList.remove('hidden')
    progressBar.classList.add('visible')
    downloadMessage.classList.add('visible')

    window.postMessage({
        type: "download-file"
    })
    window.electron.downloadFile((event, arg) => { 
        
        progressBar.value = arg
    })
    window.addEventListener('message', (event) => {
        console.log(event)
        if(event.data === 'token-recieved'){ 
            progressBar.classList.add('visible')
            downloadMessage.classList.add('visible')

        }
        if(event.data === 'downloading') { 
            downloadMessage.innerText = "Downloading Daggerfall"
            progressBar.id = "progress-bar"
            progressBar.max = 100
            progressBar.value = 0
            downloadContainer.appendChild(progressBar)
            downloadContainer.appendChild(downloadMessage)
            launchGame.disabled = true
        }
        if (event.data === 'download-complete') {
            downloadMessage.innerText = "unzipping files"
        }
        if(event.data[0] === 'unzip-complete'){ 
            downloadMessage.innerText = "downloading daggerfall unity"
                window.electron.getRelease()
                .then(res => {
                        window.electron.getRemoteFile(res.name, res.browser_download_url, event.data[1])
                    })
            launchGame.disabled = false
            
        }
        if (event.data[0] === 'showProgress') {
            progressBar.setAttribute("value", event.data[1])
            launchGame.disabled = true
            mods.disabled = true
            dfDownload.disabled = true
            
        } 
        if(event.data[0] === 'doneDownloading') {
            downloadMessage.innerText = "Download complete"
            launchGame.disabled = false
            mods.disabled = false
            dfDownload.disabled = false
            downloadContainer.removeChild(progressBar)
        }

    })
})

   
    
    launchingGame.id = 'launching-game'
    window.addEventListener('message', event => {
        console.log(event.data)
        if (event.data === 'launching-game') {
            launchingGame.innerText = "Launching game"
            launchGameContainer.appendChild(launchingGame)
            launchGame.disabled = true
        }
        if(event.data === 'launched-game') {
            launchGameContainer.removeChild(launchingGame)
            launchGame.disabled = false
        }


    })

   
    currentRelease.innerHTML = "Current Downloaded Version: " + window.electron.getCurrentRelease()
    containerDiv.appendChild(currentRelease)
    body.appendChild(directoryName)
    currentRelease.classList.add("text");
    