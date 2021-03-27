const noblox = require("noblox.js")

/**
 * 
 * @param {Number} userId 
 * @returns {Promise<Number>}
 */

async function getPlaceId(userId) {
    const presenceData = await noblox.getPresences([userId])
    const placeId = presenceData?.userPresences[0]?.rootPlaceId // optional chaining
    return placeId
}

module.exports.getPlaceId = getPlaceId
