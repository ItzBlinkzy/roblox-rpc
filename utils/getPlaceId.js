const noblox = require("noblox.js")

/**
 * 
 * @param {Number} userId 
 * @returns {Promise<Number>}
 */

async function getPlaceId(userId) {
  try {
    const presenceData = await noblox.getPresences([userId])
    const placeId = presenceData?.userPresences[0]?.rootPlaceId // optional chaining
    if (!placeId) return -1
    return placeId
    }
  catch (err) {
    console.error(err)
    return -1
  }
}

module.exports.getPlaceId = getPlaceId
