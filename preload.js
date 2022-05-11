const { contextBridge, ipcRenderer, dialog, ipcMain } = require('electron');
const { Octokit } = require("@octokit/core")
const path = require('path')
const unzipper = require('unzipper')
const octokit = new Octokit();
const fs = require('fs');
const request = require('request')

window.addEventListener('DOMContentLoaded', () => {
    const replaceText = (selector, text) => {
      const element = document.getElementById(selector)
      if (element) element.innerText = text
    }
  
    for (const dependency of ['chrome', 'node', 'electron']) {
      replaceText(`${dependency}-version`, process.versions[dependency])
    }
  })

    process.once('loaded', () => { 
        window.addEventListener('message', event => { 
            if (event.data.type === 'select-dirs') {
                ipcRenderer.send('select-dirs')
                ipcRenderer.on('selected-dirs', (event, arg) => {
                    ipcRenderer.send('selected-dirs', arg)

                })
            }
        })
    })

  contextBridge.exposeInMainWorld('electron', {
    // openDialog: (method, config) => { 
    //       ipcRenderer.invoke('dialog', method, config)
    //   },
    getFile: (file) => {
        ipcRenderer.send('getFile', file)
        dialog.showOpenDialog({ 
            properties: ['openDirectory'],
            title: "choose download location",

        })
            .then(result => { 
                console.log("fired")
                console.log(result)
            })
            .catch(err => { 
                console.log(err)
            })
    }, 
    getRelease: async () => { 
        // need to get current operating system and download the correct release asset
        const release = await octokit.request(`GET /repos/interkarma/daggerfall-unity/releases/latest`)
        const platform = process.platform
        if(platform === 'win32') {
            return release.data.assets.find(asset => asset.name.includes('windows'))
        }
        if(platform === 'darwin') {
            return release.data.assets.find(asset => asset.name.includes('mac'))
        }
        if(platform === 'linux') {
            return release.data.assets.find(asset => asset.name.includes('linux'))
        }
    }, 
    showProgress: (file, cur, len, total) => {
        // show the progress of the download
        console.log("Downloading " + file + " - " + (100.0 * cur / len).toFixed(2) 
            + "% (" + (cur / 1048576).toFixed(2) + " MB) of total size: " 
            + total.toFixed(2) + " MB");
    }, 
    getRemoteFile: (file, url, path) =>{ 
        console.log(file, url, path)
        // gets the file from the url
        request.get(url)
            .on('response', function(response) {
                console.log(response)
            })
            .pipe(fs.createWriteStream(`${path}/${file}`))
            .on('finish', () => { 
                console.log(path, file)
                fs.createReadStream(`${path}/${file}`)
                    .pipe(unzipper.Extract({ path: `${path}` }));
            })
            
            
    },
    getDirectory: (func) => {
        // gets the directory
       
        ipcRenderer.on('selected-dirs',(event, dir) => func(event, dir))
        
    }
    })

