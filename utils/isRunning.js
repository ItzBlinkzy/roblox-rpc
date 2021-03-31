const find = require("find-process")

/**
 * @returns {Promise<Boolean>}
 */

async function isRunning() {
    const list = await find("name", "roblox-rpc.exe", true)
    if (list.length > 3) {
        return true
    }
    return false
}

module.exports.isRunning = isRunning