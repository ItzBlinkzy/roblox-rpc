const noblox = require("noblox.js")
const rpc = require("discord-rpc")
const {findRobloxInfo} = require("./findRobloxInfo")
const {getPlaceIcon} = require("./getPlaceIcon")
const fetch = require("node-fetch")
const {logData} = require("./logData")
/**
 * 
 * @param {rpc.Client} client 
 * @param {Number} placeId 
 * @returns {void}
 */

async function setPresence(client, placeId) {
    const {robloxUsername, robloxId} = await findRobloxInfo(client.user.id)
    const response = await fetch(`https://apis.roblox.com/universes/v1/places/${placeId}/universe`)
    const data = await response.json()
    const universeId = data.universeId

    const universeInfo = await noblox.getUniverseInfo([ universeId ])
    const {name: gameName} = universeInfo[0]
    const iconURL = await getPlaceIcon(universeId)
    const profileUrl = `https://www.roblox.com/users/${robloxId}/profile`
    const gameUrl = `https://roblox.com/games/${placeId}`
    
    placeId = placeId.toString()
    logData(`Username: ${robloxUsername}, RobloxID: ${robloxId} | GameName: ${gameName}, GameLink: ${gameUrl}`)
    const gameLabel = gameName.length < 32 ? gameName : gameName.slice(0, 29) + "..."
    await client.setActivity({
        details: "Playing...",
        state: gameName,
        startTimestamp: new Date(),
        largeImageText: "roblox-rpc, made by @bigblinkzy",
        largeImageKey: iconURL || "default",
        smallImageKey: "default",
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