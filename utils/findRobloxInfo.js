const fetch = require("node-fetch")
const noblox = require("noblox.js")

const {apiKey} = require("../config.json")

const ROBLOX_RPC_SERVER_ID = "1149469425968361523"
/**
 * 
 * @param {String} discordId 
 * @returns {boolean | object}
 */

async function findRobloxInfo(discordId) {
    const url = `https://api.blox.link/v4/public/guilds/${ROBLOX_RPC_SERVER_ID}/discord-to-roblox/${discordId}`
    
    const response = await fetch(url, {
        headers: {
            "Authorization": apiKey
        }
    })

    const data = await response.json()

    if (!data) {
      return false
    }

    if (data?.error) { 
      return false
    }

    const robloxId = data?.robloxID
    const robloxUsername = await noblox.getUsernameFromId(robloxId)

    return {robloxId, robloxUsername}
}

module.exports.findRobloxInfo = findRobloxInfo
