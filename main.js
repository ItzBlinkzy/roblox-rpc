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

async function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    icon: iconPath,
    resizable: false,
    fullscreenable: false,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
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
    const data = await findRobloxInfo(discordId)
    if (!data) {
        logData(`Attempted verification with DiscordID: ${discordId},  FAILED ❌ | ${new Date().toISOString()}`)
        new Notification({
            title: "Not verified with Bloxlink!",
            body: `Your Discord account (${discordTag}) is not verified with Bloxlink, please verify to use roblox-rpc.`,
            icon: iconPath
        }).show()

        await shell.openExternal("https://verify.eryn.io/")

        await client.destroy()
        app.quit()
        process.exit(1)
    }
    console.log("Found Bloxlink details", data)
    const robloxUsername = data.robloxUsername
    robloxId = data.robloxId
    logData(`Attempted verification with DiscordID: ${discordId}, SUCCESS ✅ | RobloxUsername: ${robloxUsername}, RobloxId: ${robloxId} | ${new Date().toISOString()}`)


    let template = [{
            label: `Verified ✅ : ${robloxUsername}`,
            type: "normal",
            click: async () => {
                new Notification({
                    title: "Verified with Bloxlink ✅",
                    body: `Account: ${robloxUsername}`, 
                    closeButtonText: "Close button",
                    icon: iconPath
                }).show()
            }
        },
        {
            label: `Discord Tag : ${discordTag}`,
            type: "normal",
            click: async () => {
                new Notification({
                    title: "Discord Info",
                    body: `Discord User: ${discordTag}\nDiscord ID: ${discordId}`, 
                    closeButtonText: "Close button",
                    icon: iconPath
                }).show()
            }
        },
        {
            label: "Quit",
            click: async () => {
                logData(`Exited application at ${new Date().toISOString()}`)
                await client.destroy()
                app.quit()
            }
        }
    ]
    const ctxMenu = Menu.buildFromTemplate(template)
    return ctxMenu
}


app.whenReady().then(async () => {
    await createMainWindow()
    console.log("Electron Ready")
    if (!gotTheLock) {
        new Notification({
                title: "Application already open",
                body: "There are already multiple processes of roblox-rpc running",
                icon: iconPath
            }).show()
        app.quit()
    }
})

client.on("ready", async () => {
    console.log("RPC Ready")
    
    tray = new Tray(iconPath)
    tray.setToolTip("ROBLOX Discord Rich Presence")
    const ctxMenu = await initData()
    tray.setContextMenu(ctxMenu)
    
    tray.on("click", () => {
      if (!mainWindow || mainWindow.isDestroyed()) {
        // Reinitialize the main window if it's null or destroyed
        createMainWindow();
      }
    });
    
    // RPC UPDATING
    await noblox.setCookie(cookie)
    setInterval(async () => {
        const placeId = await getPlaceId(robloxId)
        const isInDifferentGame = (lastId !== placeId)

        if (placeId === -1) {
            console.log("Not in a game, clearing presence.")
            await client.clearActivity()
            isPlaying = false
        }
        
        else if (!isPlaying && placeId !== -1 || isInDifferentGame) {
            console.log(placeId)
            await setPresence(client, placeId).catch(err => console.error(err))
            console.log("Updated presence")

            lastId = placeId
            isPlaying = true
        }
        
        else {
            console.log("In a game")
        }
    }, 10e3)
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
    new Notification({
        title: "Could not login", 
        body: err.message + "\nPlease restart Discord and try again if this persists.", 
        icon: iconPath
    }).show()
})
