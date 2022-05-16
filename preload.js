

const pathToConfig = './config.json'
const configFile = require('./config.json')
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
        window.postMessage('launching-game')
            const rawData = fs.readFileSync('./config.json', 'utf8') 
            const data = JSON.parse(rawData)
                    fs.writeFile('./launchgame.bat', `START ${data?.defaultConfig.gamePath}\\DaggerfallUnity.exe`, (err) => {
                        if (err) throw err;
                        child_process.exec(__dirname + '/launchgame.bat', function(err, stdout, stderr) { 
                            if (!err) {
                                console.log(err)
                            }
                            ipcRenderer.send('launched-game')
                            window.postMessage('launched-game')
                            
                        })
                        
                  })
            
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
       if(!configFile.defaultConfig.release){ 
              return "No release found"
         } else {
                return configFile.defaultConfig.release
       }
    },
    checkForNewRelease: async() => { 
        const release = await octokit.request(`GET /repos/interkarma/daggerfall-unity/releases/latest`)
        if(release.data.name !== configFile?.defaultConfig.release){ 
            return true
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

