const noblox = require("noblox.js")
const rpc = require("discord-rpc")
const {userId} = require("../config.json")
const images = require("../images.json")
/**
 * 
 * @param {rpc.Client} client 
 * @param {Number} placeId 
 */

async function setPresence(client, placeId) {
    const robloxUsername = await noblox.getUsernameFromId(userId) || "Unknown"
    const {Name: gameName, Url: gameUrl} = await noblox.getPlaceInfo(placeId)

    // console.log(gameName, gameUrl)
    const profileUrl = `https://www.roblox.com/users/${userId}/profile`
    
    placeId = placeId.toString()
    const gameLabel = gameName.length < 32 ? gameName : gameName.slice(0, 29) + "..."
    await client.setActivity({
        details: "Playing...",
        state: gameName,
        startTimestamp: new Date(),
        largeImageKey: images[placeId] || "default",
        buttons: [{
                label: gameLabel,
                url: gameUrl 
            },  
            {
                label: `${robloxUsername}'s profile.`,
                url: profileUrl
            }
        ],
    })
}
module.exports.setPresence = setPresence