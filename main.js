const { app, BrowserWindow, ipcMain, dialog, Menu, BrowserView } = require('electron');

const { fs } = require('fs');
const path = require('path')






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

    win.loadURL('file://'+ __dirname + '/index.html');


        // otherwise file exists and we can load it
    ipcMain.on('select-dirs', async (event, arg) => {
        const result = await dialog.showOpenDialog(win, {
          properties: ['openDirectory']
        })
        console.log('directories selected', result.filePaths)
        win.webContents.send('selected-dirs', result.filePaths)
      
    })
    ipcMain.on('sendToDownloadPage', (event, arg) => {
        console.log('open url', arg)
        const view = new BrowserWindow({
            width: 800,
            height: 600,
            webPreferences: { 
                nodeIntegration: false, 
                preload: path.join(__dirname + '/preload.js'),
                contextIsolation: true,
            },
            resizable:false
            
        })
        view.loadURL('file://'+ __dirname + '/goback.html')
        
        const view2 = new BrowserView({ 
            width: 200, 
            height: 200, 
            parent:view,
            frame: false,
        })
        view2.setBounds({ x: 0, y: 200, width: 800, height: 600 })
        view2.webContents.loadURL(arg)
        view.addBrowserView(view2)
        view.on('close', (e) => {
            e.preventDefault()
            view.hide()
        })
        
       
        // console.log(view2.webContents.redirect)
        ipcMain.on('closeDownloadPage', (event, arg) => {
            view.hide()
        })
    })
    ipcMain.on('setMainExecuteable', async (event, arg) => {
        const result = await dialog.showOpenDialog(win, {
            properties: ['openFile'],
            filters: [
                { name: 'Executable', extensions: ['exe', 'app'] }
            ], 
            title: "choose main executeable"
        })
        
        win.webContents.send('main-executeable', result.filePaths)

    })
   
    ipcMain.on('showProgress', async(event, arg) => { 
        console.log(arg)
        win.webContents.send('showProgress', arg)
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




