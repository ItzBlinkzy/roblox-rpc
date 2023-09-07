const fetch = require("node-fetch")
const semver = require("semver")
const packageJson = require("../package.json")


async function getLatestVersion(retryCount = 3) {
  try {
    const response = await fetch("https://api.github.com/repos/ItzBlinkzy/roblox-rpc/releases/latest")
    const data = await response.json()
    return data?.tag_name
  }

  catch (e) {
    if (retryCount > 0) {
      return getLatestVersion(retryCount - 1)
    }
    else {
      console.error("Maximum retry count reached. Giving up.");
    }
  }
}

async function getClientVersion() {
  return `v${packageJson.version}`
}

function isOutdatedVersion(latestVersion, clientVersion) {
  if (semver.gt(latestVersion, clientVersion)) {
    return true
  }
  return false
}

module.exports = {
  isOutdatedVersion,
  getClientVersion,
  getLatestVersion
}