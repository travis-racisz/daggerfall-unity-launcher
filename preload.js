

const pathToConfig = `${__dirname}/config.json`
const configFile = require(`${__dirname}/config.json`)
const { contextBridge, ipcRenderer, dialog, } = require('electron');
const { Octokit } = require("@octokit/core")
const progress = require('request-progress');
const child_process = require('child_process');
const unzipper = require('unzipper')
const octokit = new Octokit();
const fs = require('fs');
const request = require('request')
const defaultConfig = { 
    gamePath: "", 
    modsPath: "", 
    executeable: "",
}



let progressValue = 0;
let unzipProgress = 0










    





  contextBridge.exposeInMainWorld('electron', {
    launchGame: () => { 
        if(configFile.defaultConfig.executeable){ 
            child_process.exec(`START ${configFile.defaultConfig.executeable}`, {shell: process.env.ComSpec || 'cmd.exe'}, function(err, stdout, stderr) { 
                if (!err) {
                    console.log(err)
                }
                ipcRenderer.send('launched-game')
                window.postMessage('launched-game')
                
            })
            return
        }
        if(!configFile.defaultConfig.gamePath) {
            console.log('fired')
            ipcRenderer.send('game exe not found')
            ipcRenderer.on('Pointed to exe file', (event, path) => { 
                console.log('path', path)
                configFile.defaultConfig.executeable = path
                fs.writeFileSync(pathToConfig, JSON.stringify(configFile))
                child_process.exec(`START ${path}`, {shell: process.env.ComSpec || 'cmd.exe'}, function(err, stdout, stderr) { 
                    if (!err) {
                        console.log(err)
                    }
                    ipcRenderer.send('launched-game')
                    window.postMessage('launched-game')
                    
                })
            })
            return
        } 
        if(configFile.defaultConfig.gamePath) { 
            window.postMessage('launching-game')
                const rawData = fs.readFileSync(pathToConfig, 'utf8') 
                const data = JSON.parse(rawData)
                        child_process.exec(`START ${data?.defaultConfig.gamePath}\\DaggerfallUnity.exe`, {shell: process.env.ComSpec || 'cmd.exe'}, function(err, stdout, stderr) { 
                            if (!err) {
                                console.log(err)
                            }
                            ipcRenderer.send('launched-game')
                            window.postMessage('launched-game')
                            
                        })
                    return
            }   
    },

    getRelease: async () => { 

        const release = await octokit.request(`GET /repos/interkarma/daggerfall-unity/releases/latest`)
        const platform = process.platform
        defaultConfig.release = release.data.name
        fs.writeFile(pathToConfig, JSON.stringify({defaultConfig}, null, 2), (err) => {
            if(err) throw err;

        })
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
    getCurrentRelease: () => {
       if(!configFile.defaultConfig.gamePath){ 
              return "No download"
         } else {
                return configFile.defaultConfig.gamePath
       }
    },
    checkForNewRelease: async() => { 
        const release = await octokit.request(`GET /repos/interkarma/daggerfall-unity/releases/latest`)
        if(release.data.name !== configFile.defaultConfig.release){ 
            return true
        } else { 
            return false
        }
    },
    getRemoteFile: (file, url, path) =>{  
        // gets the file from the url
        progress(request.get(url))
            .on('progress', (state) => {
               
                progressValue = (state.percent * 100).toFixed(2)
                window.postMessage(['showProgress', progressValue])
            })
            .pipe(fs.createWriteStream(`${path}/${file}`))
            .on('finish', () => { 
                window.postMessage('download-complete')
                
                const unzip = fs.createReadStream(`${path}/${file}`)
                unzip.pipe(unzipper.Extract({ path: `${path}` }));
                let { size } = fs.statSync(`${path}/${file}`);
                unzip.on('data', (data) => { 
                    unzipProgress += data.length
                    
                    window.postMessage(['showProgress', (unzipProgress/size*100).toFixed(2)])

                })
                unzip.on('end', () => {

                    fs.unlink(`${path}/${file}`, (err) => {
                        if (err) throw err;

                    })
                    window.postMessage(['doneDownloading'])
                })
                defaultConfig.gamePath = path
                fs.writeFile(pathToConfig, JSON.stringify({defaultConfig}, null, 2), (err) => {
                    if(err) throw err;

                })
                        
                    
            })
            
            
    },
    updateGameFilesDirectory: () => { 
        ipcRenderer.send("update game files directory")
        ipcRenderer.on('updated game files directory', (event, arg) => { 
            console.log(arg)
           configFile.defaultConfig.gamePath = arg
            fs.writeFile(pathToConfig, JSON.stringify(configFile, null, 2), (err) => { 
                if(err) throw err;
            })
            window.postMessage(['updated game files directory', arg])
        })
    },
    getDownloadPath: () => { 
        return configFile.defaultConfig.gamePath
    },
    downloadFile: (func) => { 
        ipcRenderer.send('download-file')
        ipcRenderer.on('downloading', (event, arg) => {
            window.postMessage('downloading')
        })
        ipcRenderer.on('token-recieved', (event, arg) => {
            window.postMessage('token-recieved')
        })
        ipcRenderer.on('download-progress', (event, arg) => {
            func(event, arg)
        })
        ipcRenderer.on('download-complete',() => { 
            window.postMessage('download-complete')
        })

        ipcRenderer.on('show-unzip-progress', (event, arg) => { 
            func(event, arg)
        })
        ipcRenderer.on('unzip-complete', (event, arg) => { 
            window.postMessage(['unzip-complete', arg])
        })
    }
    })

