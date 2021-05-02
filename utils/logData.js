const fs = require("fs")


/**
 * 
 * @param {String} txtData 
 * @returns {void}
 */

function logData(txtData) {
    fs.appendFile("roblox-rpc-log.txt", txtData + "\n", err => {})
}

module.exports.logData = logData