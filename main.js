const { app, BrowserWindow, ipcMain } = require("electron")
const noblox = require("noblox.js");
const rpc = require("discord-rpc");
const path = require("path");
const { getPlaceId } = require("./utils/getPlaceId");
const { findRobloxInfo } = require("./utils/findRobloxInfo");
const { setPresence } = require("./utils/setPresence");
const { clientId, cookie } = require("./config.json");

let isPlaying = false;
let lastId;
let mainWindow;
const globalUserData = {
  roblox: {
    user: "",
    id: -1,
    avatar: ""
  },
  discord: {
    user: "",
    id: "",
  },
};
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
  sendDataToRenderer("printMessage", "INITALIZING DATA INITDATA()")

    const discordUser = `@${client.user.username}`
    const discordId = client.user.id
    globalUserData.discord.user = discordUser
    globalUserData.discord.id = discordId
    
    const data = await findRobloxInfo(discordId)
    sendDataToRenderer("printMessage", data)
    if (!data) {
        // prevent a race condition.
        await new Promise(r => setTimeout(r, 500));
        // This also occurs if rate limited by bloxlink
        // { success: false, reason: "You have reached your API key limit for today. Email cm@blox.link for elevated rates."}
        console.log("Not verified with Bloxlink.")
        sendDataToRenderer("printMessage", "NTO VERIFIED WITH BLOXLINK")
        // await shell.openExternal("https://blox.link")
        const notificationData = {label: "notification", type: "error", message: "Not verified with Bloxlink! Please visit https://blox.link to verify." }
        console.log("SENDING NOTIFICATION DATA")
        sendDataToRenderer("printMessage", "sending notification data")
        sendDataToRenderer("notification", notificationData)
        // app.quit()
        // process.exit(1)
        return false
    }

    else {
      console.log("Found Bloxlink details", data)
      sendDataToRenderer("printMessage", "Found bloxlink details")

      globalUserData.roblox.user = data.robloxUsername
      globalUserData.roblox.id = data.robloxId
      const robloxAvatar = await noblox.getPlayerThumbnail(globalUserData.roblox.id)
      globalUserData.roblox.avatar = robloxAvatar[0].imageUrl
      console.log(globalUserData)
      // verified show details to window
      sendDataToRenderer("userDetails", globalUserData)
      return true
    }

}


app.whenReady().then(async () => {
    await createWindow()
    console.log("Electron Ready")
    sendDataToRenderer("printMessage", "ELECTRON READY")

    if (!gotTheLock) {
      // "Application already open",
        app.quit()
    }
})

client.on("ready", async () => {
    console.log("RPC Ready")
    sendDataToRenderer("printMessage", "RPC READY")

    // possibly send data to renderer here saying rpc ready and if it doesnt show on renderer
    // it means that rpc had internal error.

    const isVerified = await initData()
    
    // RPC UPDATING
    await noblox.setCookie(cookie)

    if (isVerified) {
      setInterval(async () => {
        const placeId = await getPlaceId(globalUserData.roblox.id)
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

client.login({clientId}).catch(err => {
    console.error(err)
  // could not login restart discord show on main window
})
