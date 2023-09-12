const { contextBridge, ipcRenderer } = require("electron")
contextBridge.exposeInMainWorld('electronAPI', {
  updateData: (callback) => ipcRenderer.on('update-data', callback),
  sendToMain: (channel, data) => ipcRenderer.send(channel, data),
});

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

document.addEventListener("DOMContentLoaded", () => {
  ipcRenderer.send("frontend-ready")
  updateNotification({data: {message: "Discord RPC is currently initializing. Please wait.", type: "loading"}})
})
window.updateNotification = updateNotification
// window.electronAPI.ipcRenderer = ipcRenderer\