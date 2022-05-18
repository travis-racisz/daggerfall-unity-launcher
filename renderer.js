
const body = document.querySelector('body')
const checkForUpdate = document.getElementById("update")
const downloadContainer = document.getElementById('download-container')
const dfDownload = document.getElementById('df-download')
const mods = document.getElementById('mods')
const directoryName = document.createElement("p")
const launchGameContainer = document.getElementById('launch-game-container')
const launchingGame = document.createElement("p")
const currentRelease = document.getElementById("current-release")
const containerDiv = document.getElementsByClassName("small-col-flex")[0]
const updateText = document.createElement("p")
const updateContainer = document.getElementById('update-container')
const installedVersion = document.getElementById('currently-installed')
const folderIcon = document.createElement("i")
const folderToolTip = document.getElementById('folder-tooltip')
const tooltipText = document.createElement("span")
const announcmentElement = document.createElement('h2')

folderIcon.classList.add("fa-solid")
folderIcon.classList.add("fa-folder")
folderIcon.classList.add('margin-left')
folderIcon.setAttribute('data-toggle', "Update location of your download files")
folderIcon.addEventListener('click', () => { 
    // get directory that game files are in then write that to config.json
    window.electron.updateGameFilesDirectory()
    
})

mods.addEventListener('click', () => { 
    const downloadPath = window.electron.getDownloadPath()
    if(!downloadPath) {
        updateText.innerHTML = 'No Download detected please download the game'
        return
    }
    const progressBar = document.createElement('progress')
    progressBar.setAttribute('value', '0')
    progressBar.setAttribute('max', '100')

    updateContainer.appendChild(updateText)
    updateContainer.appendChild(progressBar)
    updateText.innerHTML = `Downloading`
    window.addEventListener('message', (event) => {
        console.log(event.data)
        if(event.data[0] === 'showProgress'){ 
            progressBar.value = event.data[1]
        }
        if(event.data === 'download-complete'){
            progressBar.value = 0 
            updateText.innerHTML = 'unzipping files'
        }
        if(event.data[0] === 'doneDownloading'){
            updateContainer.removeChild(progressBar)
            updateText.innerHTML = 'Update Complete'
        }
    })

    window.electron.getRelease()    
        .then(response => { 
            window.electron.getRemoteFile(response.name, response.browser_download_url, downloadPath)
        })
        currentRelease.innerHTML = "Current Installed: " + downloadPath
})

checkForUpdate.addEventListener('click', () => {

    console.log('checking for update')
        window.electron.checkForNewRelease('checkForUpdate')
            .then(res => { 
                if(res){
                    announcmentElement.innerText = "New release available"
                    
                } else { 
                    announcmentElement.innerText = "No new release available"
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
        if(event.data[0] === 'updated game files directory'){
            currentRelease.innerText = "Current Installed: " + event.data[1]
        }
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

    downloadContainer.appendChild(announcmentElement)
    currentRelease.innerHTML = "Current Installed: " + window.electron.getCurrentRelease()
    folderToolTip.appendChild(folderIcon)
    body.appendChild(directoryName)
    currentRelease.classList.add("text");
    