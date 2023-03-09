let kizana_version = "121442"


const { app, BrowserWindow } = require('electron');

const {shell} = require('electron');

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';
function createWindow() {
  const win = new BrowserWindow({
    frame: false,
    icon : "kizana_resources/icons/kizana_icon.png",
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      contextIsolation: false
    } 
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


/* 
var request = require('request');
  request.get('https://elkizana.github.io/version.txt', function (error, response, body) {      // new update verfication 
      if (!error && response.statusCode == 200) {
        console.log(Number.isInteger(kizana_version))
              if ( toString(body) !=  toString(kizana_version)) { 
              }
    }
  })

async function upadte(ver_num) {
  
var AdmZip =   require('adm-zip')
const https = require('https')
const fs = require('fs')

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

  await  console.log(ver_num)
    var data = fs.readFileSync('kizana_resources/index.js').toString().split("\n");
    data.splice(0, 1, `let kizana_version = ${ver_num}  `);
    var text = data.join("\n");
    fs.writeFile('kizana_resources/index.js', text, function (err) {
      if (err) return console.log(err);
    })
}  



 */

