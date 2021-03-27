const {
    clientId,
    cookie,
    userId
} = require("./config.json")

const { getPlaceId } = require("./utils/getPlaceId")
const { setPresence } = require("./utils/setPresence")
const rpc = require("discord-rpc")
const noblox = require("noblox.js")
const client = new rpc.Client({
    transport: "ipc"
})

let isPlaying = false
let lastId;


client.on("ready", async () => {
    console.log("Ready.")
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

client.login({
    clientId: clientId
})


/*  

https://www.npmjs.com/package/systray i might want this
https://www.npmjs.com/package/systray2 or this
OR ELECTRON.JS MIGHT BE THE BEST OPTION FOR MINIMIZING TO SYSTEM TRAY

*/
