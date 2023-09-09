const path = require("path")
const {app} = require("electron")
const USER_DATA_PATH = path.join(app.getPath("userData"), 'local-data.json');
const fs = require("fs")

function readLocalData() {
  try {
    if (fs.existsSync(USER_DATA_PATH)) {
      const data = fs.readFileSync(USER_DATA_PATH, "utf-8")
      return JSON.parse(data)
    }
    else {
      return false
    }
  } catch(error) {
      console.log('Error retrieving user data', error);  
      // you may want to propagate the error, up to you
      return null;
  }
}

function writeLocalData(data) {
  fs.writeFileSync(USER_DATA_PATH, JSON.stringify(data));
}

module.exports = {
  readLocalData,
  writeLocalData
}