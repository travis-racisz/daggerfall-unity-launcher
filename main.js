const { app, BrowserWindow, ipcMain, dialog, } = require('electron');
const fs = require('fs');
const path = require('path')
const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2
const drive = google.drive('v3')
const credentials = require("./credentials.json")
const http = require('http');
const URL = require('url');
const unzipper = require('unzipper')
const SCOPES = ['https://www.googleapis.com/auth/drive'];
const TOKEN_PATH = './token.json';
require('dotenv').config()

const oauth2client = new OAuth2({ 
    clientId: credentials.client_id,
    clientSecret: credentials.client_secret,
    redirectUri: credentials.redirect_uris,
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
    const url = oauth2client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES
    })

    ipcMain.on('launched-game', () => { 
        win.close()
    })


    ipcMain.on('download-file', async (event) => {
        const result = await dialog.showOpenDialog(win, {properties: ['openDirectory']})
                if(result.canceled) {
                    return
                } else { 
                win.webContents.send('downloading')
                fs.readFile(TOKEN_PATH, (err, token) => {
                    if (err) {
                        getNewToken(oauth2client, callback)
                    } else { 
                        oauth2client.credentials = JSON.parse(token)
                        callback(oauth2client)
                       
                    }
                })
                

            

        
        
            
        
           async function callback(auth){ 
                
                    
                const destination = fs.createWriteStream(`${result.filePaths[0]}/daggerfall.zip`)
                drive.files.get({ 
                    fileId: "0B0i8ZocaUWLGWHc1WlF3dHNUNTQ",
                    alt: 'media',
                    auth: auth,
                },
                {responseType: 'stream'}, (err, response ) => { 
                    let downloadSize = response.headers['content-length']
                  
                    
                    if(err){
                        console.log(err)
                    }
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



