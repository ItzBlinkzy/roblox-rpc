
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

  const input = (inputEl.value).trim();
    
    if (input === "") {
      updateNotification({data: {message: "Enter the entire cookie before sending.", type: "warning"}})
        return;
    }

    if (!input.startsWith("_|WARNING:-DO-NOT-SHARE-THIS.")) {
      updateNotification({data: {message: "Please enter the entire cookie including the warning.", type: "warning"}})
      return;
    }

    sendToMain("bot-cookie", {cookie: input})
}

const updateNotification = ({ data }) => {
  // can be "type": "error" | "type": "warning" | "type": "loading"
  const typeColors = {
    "error": "#ff9494",
    "warning": "#ffff31",
    "loading": "#9cdef1",
    "success": "#52f795"
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
  console.log(`Removing element. id: ${data.id}`)
  const element = document.getElementById(data.id)
  if (element) {
    element.remove()
  }
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

  if (!intervalId) {
    intervalId = setInterval(() => {
      const ms = Date.now() - data.currentTime
      elapsedTime.textContent = msToMinutesAndSeconds(ms)
    }, 1000)
  }
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


  const description = document.createElement('div');
  description.id = 'cookie-description';
  description.textContent = 'Enter the cookie of the bot account you created here. If you are not sure how to retrieve the cookie, refer to the README of the repository or ask in the Discord Server (https://discord.com/invite/aq9rwUCQrK).';

  const textarea = document.createElement("textarea");
  textarea.id = "input-text";
  textarea.placeholder = "_|WARNING:-DO-NOT-SHARE-THIS.";


  const cookieBtn = document.createElement("button");
  cookieBtn.addEventListener("click", handleBotCookieInput)
  cookieBtn.id = "cookie-btn";
  cookieBtn.textContent = "Send Bot Cookie";
  cookieBtn.disabled = true


  // Append the elements to the main container
  cookieContainer.appendChild(botCookieDiv);
  cookieContainer.appendChild(description);
  cookieContainer.appendChild(textarea);
  cookieContainer.appendChild(cookieBtn);

  const wrapperEl = document.getElementById("wrapper");
  wrapperEl.insertBefore(cookieContainer, wrapperEl.firstChild);
}

const enableButton = async ({retryCount}) => {
  console.log(retryCount)
  if (retryCount === 0) {
    return;
  }
  const cookieBtn = document.getElementById("cookie-btn");

  if (!cookieBtn) {
    setTimeout(() => enableButton({retryCount: retryCount - 1}), 500); // Check every half second
    return;
  }

  // If the cookie button is found, enable it
  cookieBtn.disabled = false;
};


const messageType = {
  notification: updateNotification,
  userDetails: updateUserDetails,  
  gameDetails: updateGameDetails,
  clearGameDetails: clearGameDetails,
  updateVersion: updateVersion,
  printError: printError,
  removeElement: removeElement,
  createInput: createInput,
  enableButton: enableButton
}


document.addEventListener("DOMContentLoaded", () => {
  function openModal() {
    modal.style.display = 'block';
  }
  
  // Function to close the modal
  function closeModal() {
    modal.style.display = 'none';
  }
  const gameImg = document.getElementById("game-img")
  const showProfileCheckbox = document.getElementById("profile-checkbox")

  showProfileCheckbox.addEventListener("change", () => {
    sendToMain("show-profile", showProfileCheckbox.checked)
  })

  gameImg.style.display = "none"
  const modal = document.getElementById('profileModal');
  const openModalBtn = document.getElementById('openModalBtn');
  const closeModalBtn = document.getElementById('closeModalBtn');
  
  window.electronAPI.updateData((event, data) => {
    console.log(data.label)
    if (data.label === "enableButton") {
      enableButton({retryCount: 30})
    }
    else {
      const funcToRun = messageType[data.label]
      funcToRun(data)
    }
  });
  openModalBtn.addEventListener('click', openModal);
  closeModalBtn.addEventListener('click', closeModal);

  // Close the modal if the user clicks outside of it
  window.addEventListener('click', (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });
})
