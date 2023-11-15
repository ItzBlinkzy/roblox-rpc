const noblox = require("noblox.js")
const rpc = require("discord-rpc")
const {findRobloxInfo} = require("./findRobloxInfo")
const {getPlaceIcon} = require("./getPlaceIcon")
const fetch = require("node-fetch")
/**
 * 
 * @param {rpc.Client} client 
 * @param {number} placeId
 * @param {boolean} shouldHideProfile
 * @returns {Object}
 */

async function setPresence(client, placeId, shouldHideProfile) {
    const {robloxUsername, robloxId} = await findRobloxInfo(client.user.id)
    const response = await fetch(`https://apis.roblox.com/universes/v1/places/${placeId}/universe`)
    const data = await response.json()
    const universeId = data.universeId

    const universeInfo = await noblox.getUniverseInfo([ universeId ])
    const {name: gameName} = universeInfo[0]
    const iconURL = await getPlaceIcon(universeId)
    const profileUrl = `https://www.roblox.com/users/${robloxId}/profile`
    const gameUrl = `https://roblox.com/games/${placeId}`
    const currentTime = new Date()

    placeId = placeId.toString()
    const gameLabel = gameName.length < 32 ? gameName : gameName.slice(0, 29) + "..."
    const presenceButtons = [{label: gameLabel, url: gameUrl}]

    if (!shouldHideProfile) {
      presenceButtons.push(            {
        label: `${robloxUsername}'s profile.`,
        url: profileUrl
    })
    }
    await client.setActivity({
        details: "Playing...",
        state: gameName,
        startTimestamp: currentTime,
        largeImageText: "roblox-rpc, made by @bigblinkzy",
        largeImageKey: iconURL || "default",
        smallImageKey: "default",
        buttons: presenceButtons
    })

    return {robloxUsername, robloxId, gameName, gameUrl, iconURL, profileUrl, currentTime}
}
module.exports.setPresence = setPresence