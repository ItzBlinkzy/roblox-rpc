const fetch = require("node-fetch")
const semver = require("semver")
const packageJson = require("../package.json")


async function getLatestVersion() {
  const response = await fetch("https://api.github.com/repos/ItzBlinkzy/roblox-rpc/releases/latest")
  const data = await response.json()
  return data?.tag_name
}
async function getClientVersion() {
  return `v${packageJson.version}`
}

async function isOutdatedVersion() {
  const clientVersion = await getClientVersion()
  const latestVersion = await getLatestVersion()

  if (semver.gt(latestVersion, clientVersion)) {
    return true
  }
  return false
}

module.exports = {
  isOutdatedVersion,
  getLatestVersion,
  getClientVersion
}