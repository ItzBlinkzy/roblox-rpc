const { app, BrowserWindow, ipcMain } = require("electron")
const noblox = require("noblox.js");
const rpc = require("discord-rpc");
const path = require("path");
const { getPlaceId } = require("./utils/getPlaceId");
const { findRobloxInfo } = require("./utils/findRobloxInfo");
const { setPresence } = require("./utils/setPresence");
const { clientId, cookie } = require("./config.json");
const { isOutdatedVersion, getClientVersion, getLatestVersion } = require("./utils/checkVersion");
let isPlaying = false;
let lastId;
let mainWindow;
let robloxId;

const iconPath = path.join(__dirname, "./icons/logo.png")
const gotTheLock = app.requestSingleInstanceLock()

const client = new rpc.Client({
    transport: "ipc"
})

const sendDataToRenderer = (label, data) => {
  console.log("Sending data to renderer", data)
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send("update-data", {label, data});
  }
}

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
    app.quit();
  });
}

async function initData() {
  // returns boolean whether user is successfully verified with blox link or not

    const discordUser = `@${client.user.username}`
    const discordId = client.user.id
    const data = await findRobloxInfo(discordId)
    if (!data) {
        // prevent a race condition.
        // This also occurs if rate limited by bloxlink
        // { success: false, reason: "You have reached your API key limit for today. Email cm@blox.link for elevated rates."}
        console.log("Not verified with Bloxlink.")
        // await shell.openExternal("https://blox.link")
        const notificationData = {type: "warning", message: "Not verified with Bloxlink! Please visit https://blox.link to verify." }
        console.log("SENDING NOTIFICATION DATA")
        sendDataToRenderer("notification", notificationData)
        // app.quit()
        // process.exit(1)
        return false
    }

    else {
      console.log("Found Bloxlink details", data)
      robloxId = data.robloxId
      const robloxAvatar = await noblox.getPlayerThumbnail(data.robloxId)
      const userData = {roblox: {user: data.robloxUsername, id: data.robloxId, avatar: robloxAvatar[0].imageUrl}, discord: {user: discordUser, id: discordId}}
      sendDataToRenderer("userDetails", userData)
      return true
    }

}


app.whenReady().then(async () => {
    console.log("Electron Ready")
    await createWindow()
    const clientVersion = await getClientVersion()
    const latestVersion = await getLatestVersion()
    const isOutdated = isOutdatedVersion(latestVersion, clientVersion)
    if (isOutdated) {
      sendDataToRenderer("notification", {type: "error", message: `A new version is available (${latestVersion}). This version may be broken. Visit https://github.com/ItzBlinkzy/roblox-rpc`})
    }
    sendDataToRenderer("updateVersion", {version: clientVersion})
    // checkClientVersion()

    if (!gotTheLock) {
      // "Application already open",
        app.quit()
    }
    client.on("ready", async () => {
        console.log("RPC Ready")
    
        // possibly send data to renderer here saying rpc ready and if it doesnt show on renderer
        // it means that rpc had internal error.
    
        const isVerified = await initData()
        
        // RPC UPDATING
        try {
          await noblox.setCookie(cookie)
        }

        catch (e) {
          sendDataToRenderer("notification", {message: "Could not login with bot account. Please contact @bigblinkzy on Discord.", type: "error"})
        }
    
        if (isVerified) {
          setInterval(async () => {
            const placeId = await getPlaceId(robloxId)
            const isInDifferentGame = (lastId !== placeId)
      
            if (placeId === -1) {
                console.log("Not in a game, clearing presence.")
                await client.clearActivity()
                isPlaying = false
    
                // they were previously in a game
                if (lastId) {
                  console.log("PREVIOUSLY IN GAME, CLEAR THE BROWSER")
                  lastId = null
                  sendDataToRenderer("clearGameDetails")
                }
            }
            
            else if (!isPlaying && placeId !== -1 || isInDifferentGame) {
                console.log(placeId)
                const placeData = await setPresence(client, placeId).catch(err => console.error(err))
                console.log("Updated presence")
                lastId = placeId
                isPlaying = true
                sendDataToRenderer("gameDetails", placeData)
            }
            
            else {
                console.log("Still in game")
            }
        }, 5e3)
      }
    })
    
    if (process.platform === "win32") {
        app.setAppUserModelId(app.name);
    }
    
    app.on("window-all-closed", () => {
        if (process.platform !== "darwin") {
            if (mainWindow && !mainWindow.isDestroyed()) {
              mainWindow.hide()
            }
        }
    });
    
    ipcMain.on("some-event-from-renderer", (event, data) => {
      // Handle the event from your main window
    });
    
    client.login({clientId}).catch(async (err) => {
      console.error(err)
      sendDataToRenderer("notification", {type: "error", message: "Could not connect to client. Please ensure Discord is open before running this application. Contact @bigblinkzy if this persists."})
    })
})

process.on("uncaughtException", (err) => {
  sendDataToRenderer("notification", {type: "error", message: "An uncaughtException has occured in the main process. Please try again. Contact @bigblinkzy if this persists."})
  sendDataToRenderer("printError", err)
})

process.on("unhandledRejection", (err) => {
  sendDataToRenderer("notification", {type: "error", message: "An unhandledRejection has occured in the main process. Please try again. Contact @bigblinkzy if this persists."})
  sendDataToRenderer("printError", err)
})