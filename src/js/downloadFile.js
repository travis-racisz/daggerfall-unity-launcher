export function downloadFile() {
    console.log("Download File")

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
            updateGame.disabled = true
            dfDownload.disabled = true
            
        } 
        if(event.data[0] === 'doneDownloading') {
            downloadMessage.innerText = "Download complete"
            launchGame.disabled = false
            updateGame.disabled = false
            dfDownload.disabled = false
            downloadContainer.removeChild(progressBar)
        }

    })
}