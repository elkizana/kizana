const { app, BrowserWindow } = require('electron')
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';

function createWindow() {
  const win = new BrowserWindow({
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      contextIsolation: false

    } , 
//    icon: __dirname + "/kizana_resources/icons/khizana_main_icon.png"
//"pack": "electron-builder --dir",
  })

  win.loadFile('main.html')
  win.maximize()
  win.setMenuBarVisibility(false)
  //win.webContents.openDevTools()
}
app.setName("الخزانة")
app.whenReady().then(createWindow)

app.on('window-all-closed', () => {



  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {

  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }

})



 try {
  require('electron-reloader')(module);
} catch (_) { }







