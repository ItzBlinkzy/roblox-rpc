let intervalId;

const msToMinutesAndSeconds = (ms) => {
  const minutes = Math.floor(ms / 60000);
  const seconds = Number(((ms % 60000) / 1000).toFixed(0));
  // eslint-disable-next-line
  return seconds === 60 ? minutes + 1 + ':00' : minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
};

const updateNotification = ({ data }) => {
  // can be "type": "error" | "type": "notification"
   /*
  CREATES THIS ELEMENT
          <div id="noti-info">
            <p>3 mins ago - There was an error loading user details</p>
          </div>*/

  console.log("IN UPDATE NOTIFICATIOON FUNCTION", data)

  const divElement = document.createElement("div")
  const pElement = document.createElement("p")
  const notificationElement = document.getElementById("notification")
  const notificationType = data.type

  if (notificationType === "error") {
    divElement.id = "error-info"
  }

  else {
    divElement.id = "noti-info"
  }
  pElement.textContent = data.message
  divElement.appendChild(pElement)

  notificationElement.appendChild(divElement)
}

const updateUserDetails = ({data}) => {
  /* 
  Shape: {roblox: {user: robloxUsername, id: robloxId}, discord: {discordUser, discordUser}}


  */
  const {roblox, discord, avatar} = data
  console.log(roblox, discord)
  document.getElementById("roblox-user").textContent = roblox.user
  document.getElementById("roblox-id").textContent = roblox.id
  document.getElementById("roblox-avatar").src = roblox.avatar
  document.getElementById("discord-user").textContent = discord.user
  document.getElementById("discord-id").textContent = discord.id
}

const updateGameDetails = ({data}) => {
  console.log("NOW IN ROBLOX GAME", data)

  const gameImg = document.getElementById("game-img")
  const gameTitle = document.getElementById("game-title")
  const elapsedTime = document.getElementById("elapsed-time")

  gameImg.src = data.iconURL
  gameImg.style.display = "block"
  gameTitle.textContent = data.gameName

  intervalId = setInterval(() => {
    const ms = Date.now() - data.currentTime
    elapsedTime.textContent = msToMinutesAndSeconds(ms)
  }, 1000)
}


const clearGameDetails = () => {
  const gameImg = document.getElementById("game-img")
  const gameTitle = document.getElementById("game-title")
  const elapsedTime = document.getElementById("elapsed-time")
  gameImg.removeAttribute("src")
  gameTitle.textContent = "N/A"
  gameImg.style.display = "none"

  clearInterval(intervalId)
  elapsedTime.textContent = "N/A"
}


const closeApp = () => {
  console.log("closing app - (functionality not added)")
}

const printMessage = (data) => {
  console.log("FROM BACKEND", data)
}

const messageType = {
  notification: updateNotification,
  userDetails: updateUserDetails,  
  gameDetails: updateGameDetails,
  clearGameDetails: clearGameDetails,
  printMessage: printMessage
}


document.addEventListener("DOMContentLoaded", () => {
  const gameImg = document.getElementById("game-img")
  gameImg.style.display = "none"
  window.electronAPI.updateData((event, data) => {
    console.log("Event received on front end")
    const funcToRun = messageType[data.label]
    funcToRun(data)
  });
})
