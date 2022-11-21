
const { app, BrowserWindow, ipcMain, dialog, ipcRenderer, } = require('electron');
const fs = require('fs-extra');
const path = require('path')
const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2
const drive = google.drive('v3')
const credentials = require('./credentials.json')
const http = require('http');
const URL = require('url');
const child_process = require('child_process');
const unzipper = require('unzipper')
const TOKEN_PATH = './token.json';
const os = require('node:os')
require('dotenv').config()
if(require('electron-squirrel-startup')) app.quit();

console.log(app.getAppPath())

const oauth2Client = new OAuth2({ 
    clientId: credentials.client_id,
    clientSecret: credentials.client_secret,
    redirectUri: credentials.redirect_uris,
})

const url = oauth2Client.generateAuthUrl({ 
    access_type: 'offline',
    scope: 'https://www.googleapis.com/auth/drive'
})




let unzipProgress = 0
let progressValue = 0


const createWindow = () => {
    // Create the browser window.
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true, 
            preload: path.join(__dirname + '/preload.js'),
            contextIsolation: true,
            
        },
        roundedCorners: true,
        resizable: true,


    });
    
    win.loadURL('file://'+ __dirname + '/index.html');
   
}

app.whenReady().then(() => { 
    const win = new BrowserWindow({
        resizable: false,
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: false, 
            preload: path.join(__dirname + '/preload.js'),
            contextIsolation: true,

        },
        icon: './assets/icons.png'
    });
    win.on('close', () => { 
        app.quit()
    })

    const tokenBrowser = new BrowserWindow({ 
        width: 800,
        height: 600,
        show: false,
    })

    
    
    win.loadURL('file://'+ __dirname + '/index.html');

    // ipcMain.on('launched-game', () => { 
    //     win.close()
    // })

    ipcMain.on('game exe not found', async (event) => { 
        const path = await dialog.showOpenDialog(win, { 
            properties: ['openFile'], 
            filters: [{ name: 'Executable', extensions: ['exe'] }], 
            title: 'Select Executeable file'})
            if(path.canceled){ 
                return
            } else { 
               event.reply('Pointed to exe file', `${path.filePaths[0]}`)
            }
        })

        ipcMain.on('update game files directory', async () => { 
            const path = await dialog.showOpenDialog(win, { 
                properties: ['openDirectory'], 
                title: 'Select Game Files Directory'})
                if(path.canceled){ 
                    return
                } else { 
                   win.webContents.send('updated game files directory',  `${path.filePaths[0]}`)
                }
            })


    ipcMain.on('download-file', async (event) => {

        
        const result = await dialog.showOpenDialog(win, {properties: ['openDirectory']})
                if(result.canceled) {
                    return
                } else { 
                win.webContents.send('downloading')
                fs.readFile(TOKEN_PATH, (err, token) => {
                    if (err) {
                        getNewToken(oauth2Client, callback)
                    } else { 
                        oauth2Client.credentials = JSON.parse(token)
                        callback(oauth2Client)
                       
                    }
                })
                

            

        
        
            
        
           async function callback(auth){ 
                
                    
               console.log(result.filePaths[0])
                const destination = fs.createWriteStream(`${result.filePaths[0]}/daggerfall.zip`)
                drive.files.get({ 
                    fileId: "0B0i8ZocaUWLGWHc1WlF3dHNUNTQ",
                    alt: 'media',
                    auth: auth,
                },
                {responseType: 'stream'}, (err, response ) => { 
                    
                    
                    if(err){
                        console.log(err)
                        return
                    }
                    let downloadSize = response.headers['content-length']
                    response.data
                    .on('data', (chunk) => {
                       
                        // size = 152372819
                        // chunk.length = 16384
                        // size = `
                        progressValue += chunk.length 

                        win.webContents.send('download-progress', (progressValue/downloadSize * 100).toFixed(2))
                    })
                    .on('finish', () => {
                     
                        win.webContents.send('download-complete')
                        const unzip = fs.createReadStream(`${result.filePaths[0]}/daggerfall.zip`)
                       
                        unzip.pipe(unzipper.Extract({ path: `${result.filePaths[0]}` }));
                        let { size } = fs.statSync(`${result.filePaths[0]}/daggerfall.zip`);
                        unzip.on('data', (data) => { 
                            unzipProgress += data.length
                            
                            win.webContents.send('show-unzip-progress', (unzipProgress/size*100).toFixed(2))
                            // ipcRenderer.on('showProgress', (event, progress) => (progress/size*100).toFixed(2))
                            // `written ${written} of ${size} bytes (${(written/size*100).toFixed(2)}%)`
                        })
                        unzip.on('end', () => {
                           
                            fs.unlink(`${result.filePaths[0]}/daggerfall.zip`, (err) => {
                                if (err) throw err;
                             
                            })
                            
                            win.webContents.send('unzip-complete', result.filePaths[0])
                        })
                    })
                    .on('error', (err) => {
                        console.log(err)
                })
                .pipe(destination)
                
                })
               
            }
            win.webContents.send('downloaded', result.filePaths[0])

            
            }
            function getNewToken(oauth2client, callback) {
                function storeToken(token) {
                    fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                        if (err) console.error(err)
                    })
                }
                

                function handler(request, response, server, callback) {
                    const query = URL.parse(request.url, true).query
                    oauth2client.getToken(query.code, (err, token) => {
                        if(err){ 
                            console.log('error getting OAuth token ' + err)
                        }
                        oauth2client.credentials = token
                        storeToken(token)
                        win.webContents.send('token-received')
                        callback(oauth2client)
                        tokenBrowser.close()
                        server.close()
                    })
        
                    
                    
                }
                const server = http.createServer(function (req, res) {
                    handler(req, res, server, callback)
                }).listen(8080, () => { 
                    tokenBrowser.show()
                    tokenBrowser.loadURL(url)
                })
            }
        })

        


   
    ipcMain.on('showProgress', async(event, arg) => { 
        win.webContents.send('showProgress', arg)
    })
    ipcMain.on('doneDownloading', async(event, arg) => {
        win.webContents.send('doneDownloading', arg)
    })
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
      })

    });
    
    
    app.on('window-all-closed', () => { 
        if (process.platform !== 'darwin') {
            app.quit();
        }
    })



