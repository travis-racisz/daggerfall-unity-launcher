const { app, BrowserWindow, ipcMain, dialog } = require('electron');
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



    });
    win.loadFile('index.html');
    // ipcMain.handle('dialog', (event, method, params) => {
    //     dialog[method](params)
    // })
    ipcMain.on('select-dirs', async (event, arg) => {
        const result = await dialog.showOpenDialog(win, {
          properties: ['openDirectory']
        })
        console.log('directories selected', result.filePaths)
        win.webContents.send('selected-dirs', result.filePaths)
      
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




