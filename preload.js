

const pathToConfig = `${__dirname}/config.json`
const configFile = require(`${__dirname}/config.json`)
const { contextBridge, ipcRenderer, } = require('electron');
const { Octokit } = require("@octokit/core")
const progress = require('request-progress');
const child_process = require('child_process');
const unzipper = require('unzipper')
const octokit = new Octokit();
const os = require('node:os')
const path = require('path')
const fs = require('fs-extra');
const request = require('request')
const defaultConfig = { 
    gamePath: "", 
    modsPath: "", 
    executeable: "",
}



let progressValue = 0;
let unzipProgress = 0
const oldFileDirecotry =  [ 
    "DaggerfallUnity_Data", 
    "MonoBleedingEdge"
]








function handleUnzip(unzip, isUpdate, dir, file){ 
    if(isUpdate){
       
    } else { 
        
    }
}

    





  contextBridge.exposeInMainWorld('electron', {
    launchGame: () => { 
        if(configFile.defaultConfig.executeable){ 
            
        }
        if(!configFile.defaultConfig.gamePath) {
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
                const platform = process.platform
            switch(platform){ 
                case("win32"):
                    child_process.exec(`START ${configFile.defaultConfig.executeable}`, {shell: process.env.ComSpec || 'cmd.exe'}, function(err, stdout, stderr) { 
                        if (!err) {
                            console.log(err)
                        }
                        ipcRenderer.send('launched-game')
                        window.postMessage('launched-game')
                        
                    })
                    break 
                case("darwin"): 
                    child_process.exec(`open -a ${configFile.defaultConfig.gamePath}/DaggerFallUnity.app/Contents/MacOS/'Daggerfall Unity'`, ((err) => { 
                        if(err){ 
                            console.error(err)
                        }
                    }))
                    break
                    
                    

            }
            
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
    getRemoteFile: (file, url, dir) =>{  
        // gets the file from the url
        progress(request.get(url))
            .on('progress', (state) => {
               
                progressValue = (state.percent * 100).toFixed(2)
                window.postMessage(['showProgress', progressValue])
            })
            .pipe(fs.createWriteStream(`${dir}/${file}`))
            .on('finish', () => { 
                window.postMessage('download-complete')

                    const unzip = fs.createReadStream(`${dir}/${file}`)
                    unzip.pipe(unzipper.Extract({ path: `${dir}` }));
                    let { size } = fs.statSync(`${dir}/${file}`);
                    unzip.on('data', (data) => { 
                        unzipProgress += data.length
                        
                        window.postMessage(['showProgress', (unzipProgress/size*100).toFixed(2)])
                        
                        

                      
                    })
                    unzip.on('end', () => {
                        fs.unlink(`${dir}/${file}`)
                        defaultConfig.gamePath = dir
                        fs.writeFile(pathToConfig, JSON.stringify({defaultConfig}, null, 2), (err) => {
                            if(err) throw err;
                    
                        })  
                        window.postMessage(['doneDownloading'])
                    })
                    
                })
                
    },
    changePermissions: () => { 
        const platform = os.platform()
        console.log(platform)
            if(platform === 'darwin'){ 
                const path = `${defaultConfig.gamePath}/DaggerfallUnity.app/Contents/MacOS/'Daggerfall Unity'`
                    child_process.exec(`chmod u+x ${path}`, ((err) => { 
                        if(err){ 
                            console.log(err)
                        }
                    }))
            }
                        
    },
    updateRemoteFile: (file, url, dir) =>{  
        if(!fs.existsSync(`${dir}/daggerfall-update`)){ 
            fs.mkdirSync(`${dir}/daggerfall-update`)
        }
        // gets the file from the url
        progress(request.get(url))
            .on('progress', (state) => {
               
                progressValue = (state.percent * 100).toFixed(2)
                window.postMessage(['showProgress', progressValue])
            })
            .pipe(fs.createWriteStream(`${dir}/daggerfall-update/${file}`))
            .on('finish', () => { 
                window.postMessage('download-complete')

                const unzip = fs.createReadStream(`${dir}/daggerfall-update/${file}`)
                unzip.pipe(unzipper.Extract({ path: `${dir}/daggerfall-update` }));
                let { size } = fs.statSync(`${dir}/daggerfall-update/${file}`);
                unzip.on('data', (data) => { 
                    unzipProgress += data.length
                    
                    window.postMessage(['showProgress', (unzipProgress/size*100).toFixed(2)])
                })
                unzip.on('end', () => {
                    
                    const files = fs.readdirSync(`${dir}/DaggerfallUnity_Data/StreamingAssets/Mods`, {encoding: 'utf8', withFileTypes: true})
                    console.log(files)
                    // moves all the mods from old dir to new one
                    if(files){ 
                        for (const file of files){ 
                            fs.renameSync(`${dir}/DaggerfallUnity_Data/StreamingAssets/Mods/${file.name}`, `${dir}/daggerfall-update/DaggerfallUnity_Data/StreamingAssets/Mods/${file.name}`, (err) => { 
                                if(err) console.log(err)
                            })
                        }
                    }
                 
                    // oldFileDirecotry.forEach(directory => { 
                    //     fs.rmSync(`${dir}/${directory}`, { recursive: true })
                    // })
                    
                    // const files = fs.readdirSync(dir, {encoding: 'utf8', withFileTypes: true})
                    //     console.log(files)    
                    const baseFiles = fs.readdirSync(dir, {encoding: 'utf8', withFileTypes: true})
                    if(baseFiles){ 
                            for (const file of baseFiles) {
                                console.log(file)
                                if(file.name === 'arena2'){ 
                                    continue
                                }
                                if(file.name === 'daggerfall-update'){ 
                                    continue
                                }
                                const isDirectory = fs.lstatSync(`${dir}/${file.name}`).isDirectory() 
                                if(isDirectory){
                                    fs.rmdirSync(`${dir}/${file.name}`, { recursive: true })
                                } else {
                                    fs.rmSync(path.join(dir, file.name))
                                }
                            }
                        }
            
                        // moves all of the update files to the parent folder
                       const moveFilesToParentDir = fs.readdirSync(`${dir}/daggerfall-update`, {encoding: 'utf8', withFileTypes: true})
                       if(moveFilesToParentDir){
                            for (const file of moveFilesToParentDir) {
                                fs.moveSync(`${dir}/daggerfall-update/${file.name}`, `${dir}/${file.name}`, { overwrite: true })
                            }
                        }
                      
                      // remove the update folder
                    fs.rmdirSync(`${dir}/daggerfall-update`)
            
                    // remove the zip folder
                    fs.unlinkSync(`${dir}/${file}`)
            
                window.postMessage(['doneDownloading'])
            })
            defaultConfig.gamePath = dir
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

