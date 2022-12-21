const fetch = require("node-fetch")

/**
 * 
 * @param {Number} universeID 
 * @returns {Promise<String>}
 */

async function getPlaceIcon(universeId) {
    const response = await fetch(`https://thumbnails.roblox.com/v1/games/icons?universeIds=${universeId}&size=512x512&format=Png&isCircular=false`)
    const {data} = await response.json()

    const iconUrl = data[0]?.imageUrl

    return iconUrl
}

module.exports.getPlaceIcon = getPlaceIcon
