const noblox = require("noblox.js")
const rpc = require("discord-rpc")
const {findRobloxInfo} = require("./findRobloxInfo")
const {logData} = require("./logData")
/**
 * 
 * @param {rpc.Client} client 
 * @param {Number} placeId 
 * @returns {void}
 */

async function setPresence(client, placeId) {
    const {robloxUsername, robloxId} = await findRobloxInfo(client.user.id)
    const {Name: gameName, Url: gameUrl} = await noblox.getPlaceInfo(placeId)

    // console.log(gameName, gameUrl)
    const profileUrl = `https://www.roblox.com/users/${robloxId}/profile`
    
    placeId = placeId.toString()
    logData(`Username: ${robloxUsername}, RobloxID: ${robloxId} | GameName: ${gameName}, GameLink: ${gameUrl}`)
    const gameLabel = gameName.length < 32 ? gameName : gameName.slice(0, 29) + "..."
    await client.setActivity({
        details: "Playing...",
        state: gameName,
        startTimestamp: new Date(),
        largeImageText: "roblox-rpc, made by Blinkzy#3924",
        largeImageKey: "default",
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