const { clientId, cookie } = require("./config.json")
const { app, Menu, Tray, Notification, shell, BrowserWindow, ipcMain } = require("electron")
const { getPlaceId } = require("./utils/getPlaceId")
const path = require("path")
const { findRobloxInfo } = require("./utils/findRobloxInfo")
const { setPresence } = require("./utils/setPresence")
const { logData } = require("./utils/logData")
const rpc = require("discord-rpc")
const noblox = require("noblox.js")


let tray = null
let isPlaying = false
let lastId;
let robloxId;
let mainWindow;
const iconPath = path.join(__dirname, "./logo.png")
const gotTheLock = app.requestSingleInstanceLock()

const client = new rpc.Client({
    transport: "ipc"
})

async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    icon: iconPath,
    resizable: false,
    fullscreenable: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "./preload.js")
    },
  });

  mainWindow.loadFile(path.join(__dirname, "./src/index.html"));

  // Handle window closed event
  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

async function initData() {
    const discordTag = `@${client.user.username}`
    const discordId = client.user.id
    // const data = await findRobloxInfo(discordId) // prevent api spam dev purposes
    let data;
    if (!data) {
        // "Not verified with Bloxlink!", show details to window
        console.log("Not verified.")
        await shell.openExternal("https://blox.link")
        const notificationData = {label: "error", message: "Not verified with Bloxlink!" }
        mainWindow.webContents.send("update-data", notificationData)
        // app.quit()
        // process.exit(1)
    }
    console.log("Found Bloxlink details", data)
    const robloxUsername = data.robloxUsername
    robloxId = data.robloxId

    // verified show details to window
    // mainWindow.webContents.send("update-data", "HELLO FROM MAIN")

}


app.whenReady().then(async () => {
    await createWindow()
    mainWindow.webContents.send("update-data", {message: "Hello from main"})
    console.log("Electron Ready")
    if (!gotTheLock) {
      // "Application already open",
        app.quit()
    }
})

client.on("ready", async () => {
    console.log("RPC Ready")
    
    tray = new Tray(iconPath)
    tray.setToolTip("ROBLOX Discord Rich Presence")
    await initData()
    
    tray.on("click", () => {
      if (!mainWindow || mainWindow.isDestroyed()) {
        // Reinitialize the main window if it's null or destroyed
        createWindow();
      }
    });
    
    // RPC UPDATING
    await noblox.setCookie(cookie)
})

if (process.platform === "win32") {
    app.setAppUserModelId(app.name);
}

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        if (mainWindow && !mainWindow.isDestroyed()) {
          mainWindow.hide()
        }
    }
});

ipcMain.on("some-event-from-renderer", (event, data) => {
  // Handle the event from your main window
});

client.login({clientId}).catch(err => {
    console.error(err)
  // could not login restart discord show on main window
})
