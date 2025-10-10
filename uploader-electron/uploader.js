let isElectron = false;

// Detect Electron and get ipcRenderer if available
if (typeof window !== "undefined" && window.require) {
  try {
    // ipcRenderer = window.require("electron").ipcRenderer;
    isElectron = true;
  } catch (e) {
    isElectron = false;
  }
}

var lastFlash = {};

async function flashClicked() {
  console.log("Flash clicked");
  document.querySelector("#flash-button").style.display = "none";
  document.querySelector("#progress-container").style.display = "flex";
  window.hideAvrgirlError();
  const address = document.querySelector("#dmxstart").value;
  const numled = document.querySelector("#numled").value;
  const pixelType = document.querySelector("#pixel-type-select").value;
  try {
    if (isElectron && ipcRenderer) {
      // Use Electron IPC to upload firmware
      const result = await ipcRenderer.invoke("upload-firmware", {
        dmxstart: address,
        pixeltype: pixelType,
        numled: numled,
      });
      document.querySelector("#flash-button").style.display = "flex";
      document.querySelector("#progress-container").style.display = "none";
      if (result.success) {
        window.hideAvrgirlError();
        console.info("done correctly.");
      } else {
        window.showAvrgirlError(result.error.toString().substring(0, 42));
        console.log(result.error);
      }
    } else {
      window.showAvrgirlError(
        "Firmware upload only supported in Electron app.",
      );
    }
  } catch (e) {
    window.showAvrgirlError(
      "Unexpected error: " + e.toString().substring(0, 42),
    );
    console.error(e);
  }
}

document.querySelector("#flash-button").addEventListener("click", flashClicked);
