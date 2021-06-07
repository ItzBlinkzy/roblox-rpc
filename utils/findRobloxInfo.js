const fetch = require("node-fetch")

/**
 * 
 * @param {String} discordId 
 * @returns {boolean | object}
 */

async function findRobloxInfo(discordId) {
    const url = `https://verify.eryn.io/api/user/${discordId}`
    const response = await fetch(url)
    const data = await response.json()
    
    if (data.errorCode === 404) {
        return false
    }

    return data
}

module.exports.findRobloxInfo = findRobloxInfo
