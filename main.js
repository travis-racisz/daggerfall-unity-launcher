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
            javascript: true,
            
        },
        roundedCorners: true,
        resizable: true,


    });
    win.loadFile('index.html');
   
}

app.whenReady().then(() => { 
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: false, 
            preload: path.join(__dirname + '/preload.js'),
            contextIsolation: true,

            
        },
        resizable: false




    });

    win.loadFile('index.html');


        // otherwise file exists and we can load it
    ipcMain.on('select-dirs', async (event, arg) => {
        const result = await dialog.showOpenDialog(win, {
          properties: ['openDirectory']
        })
        console.log('directories selected', result.filePaths)
        win.webContents.send('selected-dirs', result.filePaths)
      
    })
    ipcMain.on('download-daggerfall', (event, arg) => {
        console.log('open url', arg)
        const view = new BrowserWindow({
            width: 800,
            height: 600,
            resizable:false
            
        })
        view.loadURL(arg)
        
        const view2 = new BrowserView({ 
            width: 200, 
            height: 200, 
            parent:view,
            frame: false,
        })
        view2.setBounds({ x: 0, y: 200, width: 800, height: 600 })
        view2.webContents.loadFile('goback.html')
        view.addBrowserView(view2)
        view.addBrowserView(view2)
        
       
        // console.log(view2.webContents.redirect)
        ipcMain.on('closeBrowserView', (event, arg) => {
            view.close()
        })
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




