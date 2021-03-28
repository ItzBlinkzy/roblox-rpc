const {
    clientId,
    cookie,
    userId
} = require("./config.json")
const path = require("path")
const {app, Menu, Tray} = require("electron")
const { getPlaceId } = require("./utils/getPlaceId")
const { setPresence } = require("./utils/setPresence")
const rpc = require("discord-rpc")
const noblox = require("noblox.js")

const iconPath = path.join(__dirname, "logo.png")
let tray = null
let isPlaying = false
let lastId;

const client = new rpc.Client({
    transport: "ipc"
})


async function updateTrayMenu() {
    const robloxUsername = await noblox.getUsernameFromId(userId) || "Unknown"
    let template = [{
            label: `ROBLOX Username: ${robloxUsername}`,
            type: "normal",

        },
        {
            label: `Discord ${client.user.username}#${client.user.discriminator}`,
            type: "normal"
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
        const ctxMenu = await updateTrayMenu()
        tray.setContextMenu(ctxMenu)

        tray.setToolTip("ROBLOX Discord Rich Presence")
        await noblox.setCookie(cookie)
        
        setInterval(async () => {
            const placeId = await getPlaceId(userId)
            
            if (placeId === -1) {
                console.log("Not in a game, clearing presence.")
                await client.clearActivity()
                isPlaying = false
            } 
    
            else if (!isPlaying && placeId !== -1 || lastId !== placeId) {
                await setPresence(client, placeId).catch(err => console.error(err))
                console.log("Updated presence")
                lastId = placeId
                isPlaying = true
            }
            else {
                console.log("In a game")
            }
        }, 15e3)
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
});


client.login({
    clientId: clientId
})

