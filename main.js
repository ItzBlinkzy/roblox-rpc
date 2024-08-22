const { app, BrowserWindow, ipcMain, Tray, Menu } = require("electron")
const noblox = require("noblox.js");
const rpc = require("discord-rpc");
const path = require("path");
const { getPlaceId } = require("./utils/getPlaceId");
const { findRobloxInfo } = require("./utils/findRobloxInfo");
const { setPresence } = require("./utils/setPresence");
const { clientId } = require("./config.json");
const { isOutdatedVersion, getClientVersion, getLatestVersion } = require("./utils/checkVersion");
const {readLocalData, writeLocalData, logError} = require("./utils/localData");
const {autoUpdater, AppUpdater} = require("electron-updater")

autoUpdater.autoDownload = false

autoUpdater.setFeedURL({
  "provider": "github",
  "owner": "ItzBlinkzy",
  "repo": "roblox-rpc"
})

const sendDataQueue = [];
const COOKIE_BOT_DEBOUNCE_TIME = 800;

let tray = null;
let shouldHideProfile = false;
let isPlaying = false;
let lastId;
let mainWindow;
let robloxId;
let robloxUsername;

const iconPath = path.join(__dirname, "./images/logo.png");
const gotTheLock = app.requestSingleInstanceLock();

const client = new rpc.Client({
    transport: "ipc",
});

const sendDataToRenderer = (label, data) => {
    return new Promise((resolve) => {
        sendDataQueue.push({ label, data, resolve });

        // If the queue only contains one item, start processing it
        if (sendDataQueue.length === 1) {
            processSendDataQueue();
        }
    });
};

const processSendDataQueue = async () => {
    while (sendDataQueue.length > 0) {
        const { label, data, resolve } = sendDataQueue[0];
        console.log("Sending data to renderer ", data);

        if (mainWindow && !mainWindow.isDestroyed()) {
            mainWindow.webContents.send("update-data", { label, data });
        }

        // Resolve the promise to signal completion
        resolve();

        // Remove the processed item from the queue
        sendDataQueue.shift();
    }
};


const rpcReadyPromise = new Promise(async (resolve, reject) => {
  // Register an event listener for the "rpc-ready" event
  try {
    console.log("Inside rpc ready promise")
    client.on("ready", async () => {
      tray = new Tray(iconPath)
      tray.setToolTip("Roblox Discord Rich Presence")
      const ctxMenu = await initCtxMenu()
      tray.setContextMenu(ctxMenu)

      tray.on("right-click", () => {
        console.log("Tray button right clicked.")
        console.log({trayType: typeof tray})
        tray.popUpContextMenu()
      })

      tray.on("click", async () => {
        await mainWindow.show()
      })


      console.log("-".repeat(30));
      console.log("Discord RPC Ready");
      console.log("-".repeat(30));
  
      resolve(); // Resolve the Promise when the event is fired
    })

    client.login({ clientId }, () => {
      console.log("client is attempting login")
    }).catch(err => {
      reject(err)
    })
  }
  catch (err) {
        reject(err)
    }
})


// Initialize Roblox presence. Returns a boolean based on a valid cookie
async function initRobloxPresence(cookie) {

  try {
      await noblox.setCookie(cookie)

      setInterval(async () => {

          if (!robloxId | !robloxUsername) {
            console.log("User ROBLOX data has not been retrieved yet.")
            return
          }

          const placeId = await getPlaceId(robloxId)
          
          const notInGame = placeId === -1
          const hasSwitchedGames = lastId !== placeId
          console.log({placeId})
          
          if (placeId === null) {
            console.log("Could not check user presence. Trying again. (error)")
            return
          } 
          
          if (notInGame) {
            console.log("Presence has not found any game data.")
            await client.clearActivity()
            isPlaying = false
            
            // they were previously in a game
            if (lastId) {
              console.log("Previously in a game, clearing browser.")
              lastId = null
              await sendDataToRenderer("clearGameDetails")
            }
            return
          }
          
  
        if (!isPlaying || hasSwitchedGames) {
              console.log(`User in ${placeId}`)
              const placeData = await setPresence(client, placeId, shouldHideProfile, robloxId, robloxUsername)
                  .catch(err => console.error(err))
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
  
  catch (err) {
    await sendDataToRenderer("printError", err)
    return false
  }

  return true
}

async function setProfileData() {
  const discordUser = `@${client.user.username}`
  const discordId = client.user.id
  const data = await findRobloxInfo(discordId)
  if (!data) {
      // This also occurs if rate limited by bloxlink
      // { success: false, reason: "You have reached your API key limit for today. Email cm@blox.link for elevated rates."}
      const notificationData = { type: "warning", message: "Please join the ROBLOX RPC server and verify with Bloxlink to use this application. (https://discord.gg/aq9rwUCQrK)" }
      await sendDataToRenderer("notification", notificationData)
  }

  else {
      console.log("Found Bloxlink details", data)
      robloxId = data.robloxId
      robloxUsername = data.robloxUsername
      
      const robloxAvatar = await noblox.getPlayerThumbnail(data.robloxId)
      const userData = { roblox: { user: data.robloxUsername, id: data.robloxId, avatar: robloxAvatar[0].imageUrl }, discord: { user: discordUser, id: discordId } }
      await sendDataToRenderer("userDetails", userData)
  }
}

// Create the main Electron window
async function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1024,
        height: 768,
        icon: iconPath,
        resizable: false,
        fullscreenable: false,
        autoHideMenuBar: true,
        webPreferences: {
            preload: path.join(__dirname, "./preload.js"),
        },
    });

    mainWindow.loadFile(path.join(__dirname, "./src/index.html"));

    mainWindow.webContents.on("did-finish-load", async () => {
      console.log("did-finish-load event fired.")

    });

    // Handle window closed event
    mainWindow.on("close", (event) => {
      // prevent default close
      event.preventDefault();
      mainWindow.hide(); 
    });
}


function debounce(func, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

// The function called when inputting cookie into text box
const debouncedBotCookieHandler = debounce(async (event, data) => {
  const isValidCookie = await initRobloxPresence(data.cookie)
  if (isValidCookie) {
    // successful login with cookie 

    // save cookie locally to stop having to send everytime on startup once
    writeLocalData({cookie: data.cookie})
    await sendDataToRenderer("removeElement", {id: "cookie-container"})
    // Start bloxlink and render discord and roblox info to page.
    setProfileData()
    return true
  }

  else {
    // cookie was invalid
    await sendDataToRenderer("notification", {
      message: "Could not login with bot account. Please ensure your cookie is valid.",
      type: "error"
    })
  }
  return false
}, COOKIE_BOT_DEBOUNCE_TIME)

const initCtxMenu = () => {
  const template = [
    {
      label: "Open ROBLOX RPC",
      click: async () => mainWindow.show()
    },
    {
      label: "❌ Quit",
      click: async () => {
          await tray.destroy()
          mainWindow.destroy()
      }
    },
  ];

  const ctxMenu = Menu.buildFromTemplate(template);

  return ctxMenu;
};



// App ready event handler
app.whenReady().then(async () => {
    console.log("-".repeat(30));
    console.log("Electron is ready.");
    console.log("-".repeat(30));

    await createWindow();

    if (!gotTheLock) {
        // "Application already open"
        return app.exit();
    }


    ipcMain.on("frontend-ready", async (event, data) => {
      isWebContentReady = true
      console.log("FRONTEND IS READY IPC EVENT FIRED.")
      
      // Initialize Discord RPC and wait for it to be ready before continuining
      console.log("Waiting for rpc ready promise")
      
      try {
        // Make sure Discord RPC is ready 
        await rpcReadyPromise
        await sendDataToRenderer("removeElement", {id: "rpc-loading"})
        await sendDataToRenderer("enableButton", {})
        // Check for new ROBLOX RPC updates from GitHub.
        await autoUpdater.checkForUpdates()
        

        const localData = readLocalData() 
        const cookie = localData?.cookie || false
        shouldHideProfile = localData?.shouldHideProfile || false;
        await sendDataToRenderer("loadSettings", {shouldHideProfile})
        console.log({cookie: cookie.length, shouldHideProfile})
        if (!cookie) {
          await sendDataToRenderer("createInput")
        }
        else {
          console.log("Trying to render profile data and roblox presence.")
          const isValidCookie = await initRobloxPresence(cookie) 
          if (isValidCookie) {
            await setProfileData() // bloxlink and discord data on screen
          }
          // previously valid cookie now expired.
          else {
            await sendDataToRenderer("notification", {type: "error", message: "Seems like your cookie expired, you will have to login to the account in an incognito window and get a new one. DM @bigblinkzy for help if needed."})
            await sendDataToRenderer("createInput")
          }
        }

        ipcMain.on("bot-cookie", async (event, data) => {
          debouncedBotCookieHandler(event, data)
        });

        ipcMain.on("show-profile", async (event, data) => {
          handleShowProfile(event, data)
        })

        ipcMain.on("save-data", async (event, data) => {
          const hideProfileChecked = data.checked
          const shouldResetCookie = data.shouldResetCookie

          try {
            let dataToWrite = {shouldHideProfile: hideProfileChecked}

            if (shouldResetCookie) {
              dataToWrite = {...dataToWrite, cookie: ""}
            }

            writeLocalData(dataToWrite)
            await sendDataToRenderer("notification", {type: "success", message: "Successfully saved settings, restart to apply changes."})
          }
          catch (err) {
            console.error(err)
            await sendDataToRenderer("printError", err)
            await sendDataToRenderer("notification", { type: "error", message: "Could not save settings, please try again, if it persists contact @bigblinkzy." })
          }
        })
      }
      catch (err) {
        console.error(err)
        logError(err)
        await sendDataToRenderer("notification", { type: "error", message: "Could not connect to client. Please try restarting discord before running this application. Contact @bigblinkzy if this persists." })
        await sendDataToRenderer("printError", err)
        await sendDataToRenderer("removeElement", {id: "rpc-loading"})
      }
      console.log("rpc ready promise finally completed")
      const clientVersion = await getClientVersion()
      const latestVersion = await getLatestVersion()
      const isOutdated = isOutdatedVersion(latestVersion, clientVersion)
      
      if (isOutdated) {
        await sendDataToRenderer("notification", { type: "error", message: `A new version is available (${latestVersion}). This version may be broken. Visit https://github.com/ItzBlinkzy/roblox-rpc` })
      }
      await sendDataToRenderer("updateVersion", { version: clientVersion })
      
      process.on("uncaughtException", async (err) => {
        await sendDataToRenderer("notification", { type: "error", message: "An uncaughtException has occured in the main process. Please try again. Contact @bigblinkzy if this persists." })
        await sendDataToRenderer("printError", err)
        logError(err)
      })
      
      process.on("unhandledRejection", async (err) => {
        await sendDataToRenderer("notification", { type: "error", message: "An unhandledRejection has occured in the main process. Please try again. Contact @bigblinkzy if this persists." })
        await sendDataToRenderer("printError", err)
        logError(err)
      })
    })  
  });
  
autoUpdater.on("error", (info) => {
  logError(info)
})

autoUpdater.on("update-available", async () => {
  await sendDataToRenderer("notification",  { type: "warning", message: "There is a new update available. Attempting to download new update." })
  autoUpdater.downloadUpdate()
  logError("update available downloading update")
})

autoUpdater.on('update-downloaded', async () => {
  await sendDataToRenderer('notification', { type: "success", message: "The new version has been downloaded, please restart the application." });
  logError("downloaded new update")
});

autoUpdater.on("download-progress", (info) => {
  logError(info.percent)
})