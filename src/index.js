const {sendToMain} = window.electronAPI

let intervalId;

const msToMinutesAndSeconds = (ms) => {
  const minutes = Math.floor(ms / 60000);
  const seconds = Number(((ms % 60000) / 1000).toFixed(0));
  // eslint-disable-next-line
  return seconds === 60 ? minutes + 1 + ':00' : minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
};

const handleBotCookieInput = () => {
  const inputEl = document.getElementById("input-text");

  const input = inputEl.value;
    
    if (input.trim() === "") {
        alert("Please enter some text before encoding.");
        return;
    }

    sendToMain("bot-cookie", {cookie: input})
}

const updateNotification = ({ data }) => {
  // can be "type": "error" | "type": "warning" | "type": "loading"
  const typeColors = {
    "error": "#ff9494",
    "warning": "#ffff31",
    "loading": "#9cdef1"
  }

  const notifEl = document.createElement("div");
  notifEl.classList.add("notif");
  notifEl.textContent = data.message;
  notifEl.style.backgroundColor = typeColors[data.type]

  const closeBtn = document.createElement("button");
  closeBtn.classList.add("close-btn");

  if (data.type !== "loading") {
    closeBtn.addEventListener("click", () => {
      const notif = closeBtn.parentElement
      notif.style.display = "none"
    })
  }

  const closeIcon = document.createElement("i");

  if (data.type !== "loading") {
    closeIcon.classList.add("fas", "fa-times");
  }
  else {
    closeIcon.classList.add("fa-solid", "fa-spinner", "fa-spin");
    notifEl.id = "rpc-loading"
  }
  closeBtn.appendChild(closeIcon);

  notifEl.appendChild(closeBtn);

  const notifWrapper = document.getElementById("notif-container");
  notifWrapper.appendChild(notifEl);
}

const removeElement = async ({data}) => {
  // needed to prevent an unknown race condition of removeElement being called before the loading notification is rendered on the html.
  // remove "sleep" then dio this
  /*

  elemnt = doc.getleemn...

  if not element
    settimouut(2000, removeelement(id passed in))

  */
  await new Promise(r => setTimeout(r, 1000))
  const element = document.getElementById(data.id)
  element.remove()
}

const updateUserDetails = ({data}) => {
  /* 
  Shape: {roblox: {user: robloxUsername, id: robloxId, avatar: avatarIcon}, discord: {user: userId, id: discordId}}

  */
  const {roblox, discord} = data
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

const printError = (data) => {
  console.log(data)
}


const closeApp = () => {
  console.log("closing app - (functionality not added)")
}

const updateVersion = ({data}) => {
  console.log(data)
  const versionNum = document.getElementById("version-number")
  versionNum.textContent = data.version
} 

const createInput = () => {
  const cookieContainer = document.createElement("div");
  cookieContainer.id = "cookie-container"

  const botCookieDiv = document.createElement("div");
  botCookieDiv.textContent = "Bot Cookie";

  const textarea = document.createElement("textarea");
  textarea.id = "input-text";
  textarea.placeholder = "_WARNINGDO-NOT-SHARE......";

  const cookieBtn = document.createElement("button");
  cookieBtn.addEventListener("click", handleBotCookieInput)
  cookieBtn.id = "cookie-btn";
  cookieBtn.textContent = "Send Bot Cookie";

  // Append the elements to the main container
  cookieContainer.appendChild(botCookieDiv);
  cookieContainer.appendChild(textarea);
  cookieContainer.appendChild(cookieBtn);

  const wrapperEl = document.getElementById("wrapper");
  wrapperEl.insertBefore(cookieContainer, wrapperEl.firstChild);
}

const messageType = {
  notification: updateNotification,
  userDetails: updateUserDetails,  
  gameDetails: updateGameDetails,
  clearGameDetails: clearGameDetails,
  updateVersion: updateVersion,
  printError: printError,
  removeElement: removeElement,
  createInput: createInput
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
