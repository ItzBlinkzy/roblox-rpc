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
      return {}
    }
  } catch(error) {
      console.log('Error retrieving user data', error);  
      return null;
  }
}

function writeLocalData(data) {
  const prevData = readLocalData() || {}
  fs.writeFileSync(USER_DATA_PATH, JSON.stringify({...prevData, ...data}));
}

module.exports = {
  readLocalData,
  writeLocalData
}