const fetch = require("node-fetch")
const noblox = require("noblox.js")

const {apiKey} = require("../config.json")
/**
 * 
 * @param {String} discordId 
 * @returns {boolean | object}
 */

async function findRobloxInfo(discordId) {
    const url = `https://v3.blox.link/developer/discord/${discordId}`
    
    const response = await fetch(url, {
        headers: {
            "api-key": apiKey
        }
    })

    const data = await response.json()
    console.log(data)
    if (data?.success) {
        const robloxId = data.user.robloxId
        const robloxUsername = await noblox.getUsernameFromId(robloxId)

        return {robloxId, robloxUsername}
    }
    return false
}

module.exports.findRobloxInfo = findRobloxInfo
