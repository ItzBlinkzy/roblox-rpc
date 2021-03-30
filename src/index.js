const { clientId, cookie } = require("../config.json")
const { app, Menu, Tray, Notification } = require("electron")
const { getPlaceId } = require("../utils/getPlaceId")
const path = require("path")
const { findRobloxInfo } = require("../utils/findRobloxInfo")
const { setPresence } = require("../utils/setPresence")
const rpc = require("discord-rpc")
const noblox = require("noblox.js")


let tray = null
let isPlaying = false
let lastId;
let robloxId;
let notInGameCount = 0
const iconPath = path.join(__dirname, "../logo.png")


const client = new rpc.Client({
    transport: "ipc"
})

async function initData() {
    const discordTag = client.user.username + "#" + client.user.discriminator
    const discordId = client.user.id
    const data = await findRobloxInfo(discordId)
    if (!data) {
        new Notification({
        title: "Not verified with RoVer!", 
        body: `Your Discord account (${discordTag}) is not verified with RoVer, please verify to use roblox-rpc.`,
        icon: iconPath
        }).show()

        await client.destroy()
        app.quit()
        process.exit(1)
    }

    console.log("Found RoVer details", data)
    const robloxUsername = data.robloxUsername
    robloxId = data.robloxId


    let template = [{
            label: `Verified ✅ : ${robloxUsername}`,
            type: "normal",
            click: async () => {
                new Notification({
                    title: "Verified with Rover ✅",
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
                    body: `Discord Tag: ${discordTag}\nDiscord ID: ${discordId}`, 
                    closeButtonText: "Close button",
                    icon: iconPath
                }).show()
            }
        },
        {
            label: "Quit",
            click: async () => {
                await client.destroy()
                app.quit()
            }
        }
    ]
    const ctxMenu = Menu.buildFromTemplate(template)
    return ctxMenu
}


app.whenReady().then(async () => {
    console.log("Electron Ready")

    client.on("ready", async () => {
        console.log("RPC Ready")
        
        tray = new Tray(iconPath)
        tray.setToolTip("ROBLOX Discord Rich Presence")

        const ctxMenu = await initData()
        tray.setContextMenu(ctxMenu)
        await noblox.setCookie(cookie)

        // RPC UPDATING
        setInterval(async () => {
            const placeId = await getPlaceId(robloxId)
            if (notInGameCount >= 960) {
                new Notification({
                    title: "Not playing ROBLOX.",
                    body: "You have not played any ROBLOX game in the past 4 hours, roblox-rpc will automatically close in 10 seconds",
                    closeButtonText: "Close button",
                    timeoutType: "never",
                    icon: iconPath
                }).show()
                
                await new Promise(r => setTimeout(r, 10e3));
                await client.destroy()
                app.quit()
                process.exit(1)
            }

            else if (placeId === -1) {
                console.log("Not in a game, clearing presence.")
                notInGameCount += 1
                await client.clearActivity()
                isPlaying = false
            }
            
            else if (!isPlaying && placeId !== -1 || lastId !== placeId) {
                console.log(placeId)
                await setPresence(client, placeId).catch(err => console.error(err))
                console.log("Updated presence")

                notInGameCount = 0
                lastId = placeId
                isPlaying = true
            }
            
            else {
                console.log("In a game")
            }
        }, 15e3)
    })
})

if (process.platform === "win32") {
   app.setAppUserModelId(app.name);
}

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
});


client.login({clientId}).catch(err => {
    new Notification({
        title: "Could not login", 
        body: err.message + "\nPlease restart Discord and try again if this persists.", 
        icon: iconPath
    }).show()
})

// USE electron-builder instead of electron-packager possibly for auto updates stuff etcs and a better exe