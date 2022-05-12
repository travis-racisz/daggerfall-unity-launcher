const { contextBridge, ipcRenderer, dialog, ipcMain, } = require('electron');
const { http } = require('http');
const { Octokit } = require("@octokit/core")
const path = require('path')
const unzipper = require('unzipper')
const octokit = new Octokit();
const fs = require('fs');
const request = require('request')
const configFile = require('./config.json')
const authFile = require("./client_secret_1020848075741-3mu6imcu0si18rc51urlb7qe1ientg8o.apps.googleusercontent.com(1).json")
const { google } = require('googleapis');
const auth = { 
    client_id: authFile.installed.client_id,
    client_secret: authFile.installed.client_secret,
    redirect_uris: authFile.installed.redirect_uris,

}
const Oauth = new google.auth.OAuth2(auth.client_id, auth.client_secret, auth.redirect_uris[0]);
const drive = google.drive({ version: 'v3', Oauth });


const getDaggerFall = async () => { 
    // const destination = fs.createWriteStream(configFile.defaultConfig.gamePath[0])
    ipcRenderer.send('download-daggerfall', "https://drive.google.com/u/0/uc?id=0B0i8ZocaUWLGWHc1WlF3dHNUNTQ&export=download")
    

    // await drive.files.get({
    //   fileId: fileId,
    //   alt: 'media'
    // })
    //     .on('end', function () {
    //       console.log('Done');
    //     })
    //     .on('error', function (err) {
    //       console.log('Error during download', err);
    //     })
    //     .pipe(dest);

    }

    getDaggerFall()
    


//     // .on('end', function () {
//     //     console.log('Done');
//     //   })
//     // .on('error', function (err) {
//     //     console.log('Error during download', err);
//     //   })
//     // .pipe(destination);
  
// }
// getDaggerFall()
let progress = 0;

const defaultConfig = { 
    gamePath: "/", 
    modsPath: "/"
}




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
    //create a config file to be read when the program is launched
    const pathToConfig = './config.json'
    fs.access(pathToConfig, fs.constants.F_OK, (err) => {
        if(err){ 
            console.log("no config file")
            fs.writeFile(pathToConfig, JSON.stringify(defaultConfig), (err) => {
                if (err) throw err;
                console.log('The file has been saved!');
            })
        }
    }) 

  contextBridge.exposeInMainWorld('electron', {
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
    closeBrowserView: () => {
        ipcRenderer.send('closeBrowserView')
    },

        getOriginalDaggerfallFiles: async () => { 
        // 0B0i8ZocaUWLGWHc1WlF3dHNUNTQ
        const result = await http.get("https://www.googleapis.com/drive/v3/files/0B0i8ZocaUWLGWHc1WlF3dHNUNTQ")
    },
    getRelease: async () => { 
        // need to get current operating system and download the correct release asset
        const release = await octokit.request(`GET /repos/interkarma/daggerfall-unity/releases/latest`)
        const platform = process.platform
        defaultConfig.release = release.data.name
        fs.writeFile(pathToConfig, JSON.stringify({defaultConfig}, null, 2), (err) => {
            if(err) throw err;
            console.log('The file has been saved!');
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
        return configFile.defaultConfig.release
    },
    checkForNewRelease: async() => { 
        const release = await octokit.request(`GET /repos/interkarma/daggerfall-unity/releases/latest`)
        if(release.data.name !== configFile.defaultConfig.release){ 
            return true
        }
    },
    showProgress: (event, progress) => {
        return progress
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
                const unzip = fs.createReadStream(`${path}/${file}`)
                unzip.pipe(unzipper.Extract({ path: `${path}` }));
                let { size } = fs.statSync(`${path}/${file}`);
                unzip.on('data', (data) => { 
                    progress += data.length;
                    window.postMessage(['showProgress', (progress/size*100).toFixed(2)])
                    // ipcRenderer.on('showProgress', (event, progress) => (progress/size*100).toFixed(2))
                    // `written ${written} of ${size} bytes (${(written/size*100).toFixed(2)}%)`
                })
                unzip.on('end', () => {
                    console.log("unzipped")
                    fs.unlink(`${path}/${file}`, (err) => {
                        if (err) throw err;
                        console.log('successfully deleted');
                    })
                })
                        
                    
            })
            
            
    },
    getDirectory: (func) => {
        // gets the directory
        
        ipcRenderer.on('selected-dirs', (event, dir) => { 
            func(event, dir)
            defaultConfig.gamePath = dir
            fs.writeFile(pathToConfig, JSON.stringify({defaultConfig}, null, 2), (err) => {
                if(err) throw err;
                console.log('The file has been saved!');
            })
        
        })
        
    }
    })
