const { app, BrowserWindow, ipcMain } = require("electron")
const noblox = require("noblox.js");
const rpc = require("discord-rpc");
const path = require("path");
const { getPlaceId } = require("./utils/getPlaceId");
const { findRobloxInfo } = require("./utils/findRobloxInfo");
const { setPresence } = require("./utils/setPresence");
const { clientId, cookie } = require("./config.json");
const { isOutdatedVersion, getClientVersion, getLatestVersion } = require("./utils/checkVersion");
const sendDataQueue = [];
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
  return new Promise((resolve) => {
    sendDataQueue.push({ label, data, resolve });

    // If the queue only contains one item, start processing it
    if (sendDataQueue.length === 1) {
      processSendDataQueue();
    }
  });
}

const processSendDataQueue = async () => {
  while (sendDataQueue.length > 0) {
    const { label, data, resolve } = sendDataQueue[0];
    console.log("Sending data to renderer", data);
    
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send("update-data", { label, data });
    }
    
    // Resolve the promise to signal completion
    resolve();
    
    // Remove the processed item from the queue
    sendDataQueue.shift();
  }
};



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

  mainWindow.webContents.on("did-finish-load", async () => {
    await sendDataToRenderer("notification", {type: "loading", message: "Discord RPC is currently initializing. Please wait."})
    const clientVersion = await getClientVersion()
    const latestVersion = await getLatestVersion()
    const isOutdated = isOutdatedVersion(latestVersion, clientVersion)
    if (isOutdated) {
      await sendDataToRenderer("notification", {type: "error", message: `A new version is available (${latestVersion}). This version may be broken. Visit https://github.com/ItzBlinkzy/roblox-rpc`})
    }
    await sendDataToRenderer("updateVersion", {version: clientVersion})
  })
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
        // This also occurs if rate limited by bloxlink
        // { success: false, reason: "You have reached your API key limit for today. Email cm@blox.link for elevated rates."}
        const notificationData = {type: "warning", message: "Please join the ROBLOX RPC server and verify with Bloxlink to use this application. (https://discord.gg/aq9rwUCQrK)"}
        await sendDataToRenderer("notification", notificationData)
        return false
    }

    else {
      console.log("Found Bloxlink details", data)
      robloxId = data.robloxId
      const robloxAvatar = await noblox.getPlayerThumbnail(data.robloxId)
      const userData = {roblox: {user: data.robloxUsername, id: data.robloxId, avatar: robloxAvatar[0].imageUrl}, discord: {user: discordUser, id: discordId}}
      await sendDataToRenderer("userDetails", userData)
      return true
    }

}

app.whenReady().then(async () => {
    console.log("-".repeat(30))
    console.log("Electron is ready.")
    console.log("-".repeat(30))
    await createWindow()
    if (!gotTheLock) {
      // "Application already open"
        app.quit()
    }
    client.on("ready", async () => {
      console.log("-".repeat(30))
      console.log("RPC Ready")
      console.log("-".repeat(30))
      await sendDataToRenderer("removeElement", {id: "rpc-loading"})
    
        const isVerified = await initData()
        
        // RPC UPDATING
        try {
          await noblox.setCookie(cookie)
        }

        catch (e) {
          await sendDataToRenderer("notification", {message: "Could not login with bot account. Please contact @bigblinkzy on Discord.", type: "error"})
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
                  await sendDataToRenderer("clearGameDetails")
                }
            }
            
            else if (!isPlaying && placeId !== -1 || isInDifferentGame) {
                console.log(placeId)
                const placeData = await setPresence(client, placeId).catch(err => console.error(err))
                console.log("Updated presence")
                lastId = placeId
                isPlaying = true
                await sendDataToRenderer("gameDetails", placeData)
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
      await sendDataToRenderer("notification", {type: "error", message: "Could not connect to client. Please ensure Discord is open before running this application. Contact @bigblinkzy if this persists."})
      await sendDataToRenderer("removeElement", {id: "rpc-loading"})

    })

    process.on("uncaughtException", async (err) => {
      await sendDataToRenderer("notification", {type: "error", message: "An uncaughtException has occured in the main process. Please try again. Contact @bigblinkzy if this persists."})
      await sendDataToRenderer("printError", err)
    })
    
    process.on("unhandledRejection", async (err) => {
      await sendDataToRenderer("notification", {type: "error", message: "An unhandledRejection has occured in the main process. Please try again. Contact @bigblinkzy if this persists."})
      await sendDataToRenderer("printError", err)
    })
})
