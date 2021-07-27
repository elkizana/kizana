const { app, BrowserWindow } = require('electron');
const { cpuUsage } = require('process');
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

  win.loadFile('kizana_resources/html/main.html')
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



 /* try {
  require('electron-reloader')(module);
} catch (_) { }
 */
const kizana_version =  2222

function upadte() {
  
var AdmZip =   require('adm-zip');
const https = require('https'); // or 'https' for https:// URLs
const fs = require('fs');

const file = fs.createWriteStream("update.zip");

  const request = https.get("https://elkizana.github.io/update.zip", function(response) {
    response.pipe(file)
    response.on('end', function () {
      setTimeout(() => {
        var zip = new AdmZip("update.zip")
        zip.extractAllTo("./kizana_resources",  overwrite = true)   
      }, 2000);
      })
  })

}   // end update function 


  var request = require('request');
request.get('https://elkizana.github.io/test.txt', function (error, response, body) {

if (!error && response.statusCode == 200) {
        console.log(body)
        if ( body !== kizana_version ) { 

          upadte()
        }

        else { 
          console.log("bbb")

}




    }
    


  })