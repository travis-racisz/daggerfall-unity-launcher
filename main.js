
const { app, BrowserWindow, ipcMain, dialog, ipcRenderer, } = require('electron');
const fs = require('fs-extra');
const path = require('path')
//const { google } = require('googleapis');
//const OAuth2 = google.auth.OAuth2
//const drive = google.drive('v3')
//const credentials = require('./credentials.json')
const http = require('http');
const URL = require('url');
const unzipper = require('unzipper')
//const TOKEN_PATH = './token.json';
require('dotenv').config()
if(require('electron-squirrel-startup')) app.quit();

// TODO Change download location from google drive to offical bethesda download location
// need to gather credentials if they dont exists otherwise it will cause an error
console.log(app.getAppPath())


//function downloadDaggerfall(url){ 
//  const file = fs.createWriteStream("daggerfall.zip")
//  const request = http.get(url, (response, error) => { 
//    if(error){ 
//      console.log(error, 'error')
//
//    }
//    console.log(response, "response")
//    response.pipe(file)
//
//  })
//
//  file.on('finish', () => { 
//    file.close()
//    console.log('download complete')
//    console.log("unzipping")
//    const unzip = fs.createReadStream(`./daggerfall.zip`)
//    
//    unzip.pipe(unzipper.Extract({ path: `./` }));
//    let { size } = fs.statSync(`./daggerfall.zip`);
//    unzip.on('data', (data) => { 
//        unzipProgress += data.length
//        
//        // ipcRenderer.on('showProgress', (event, progress) => (progress/size*100).toFixed(2))
//        // `written ${written} of ${size} bytes (${(written/size*100).toFixed(2)}%)`
//    })
//    unzip.on('end', () => {
//// this actually works to get the files and unzip them, unfortunately they are missing some textures are dont work with DFU, so I need to find another download source.     
//        fs.unlink(`./daggerfall.zip`, (err) => {
//            if (err) throw err;
//          
//        })
//    })
//})
//
//}
//


//const oauth2Client = new OAuth2({ 
//    clientId: credentials.client_id,
//    clientSecret: credentials.client_secret,
//    redirectUri: credentials.redirect_uris,
//})
//
//const url = oauth2Client.generateAuthUrl({ 
//    access_type: 'offline',
//    scope: 'https://www.googleapis.com/auth/drive'
//})
//



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

    //downloadDaggerfall("http://cdnstatic.bethsoft.com/elderscrolls.com/assets/files/tes/extras/DFInstall.zip")
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

  ipcMain.on('unpack-files', async (event) => {
    console.log('unpacking files')
      const path = await dialog.showOpenDialog( win, {properties: ['openDirectory']})
      if(path.canceled){
        return 

      } else {

        const unzip = fs.createReadStream(`./DaggerfallGameFiles.zip`)
      console.log(path)
        unzip.pipe(unzipper.Extract({ path: path.filePaths[0] }));
        let { size } = fs.statSync(`./DaggerfallGameFiles.zip`);
        unzip.on('data', (data) => { 
            unzipProgress += data.length
            console.log(unzipProgress, 'unzipProgress')
           win.webContents.send('showProgress', (unzipProgress/size*100).toFixed(2))
        })
        unzip.on('end', () => {
          fs.unlink(`./DaggerfallGameFiles.zip`, (err) => {
              if (err) throw err;

          })

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

    
    app.on('window-all-closed', () => { 
        if (process.platform !== 'darwin') {
            app.quit();
        }
    })


})
