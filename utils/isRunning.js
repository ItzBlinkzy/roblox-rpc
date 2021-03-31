const find = require("find-process")

/**
 * @returns {Promise<Boolean>}
 */

async function isRunning() {
    const list = await find("name", "roblox-rpc.exe", true)
    if (!list.length) {
        return false
    }
    return true
}

module.exports.isRunning = isRunning