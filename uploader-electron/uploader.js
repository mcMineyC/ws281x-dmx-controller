let isElectron = false;
// let ipcRenderer = null;

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
let avrgirl = !isElectron
  ? new AvrgirlArduino({
      board: "uno",
      debug: true,
      timeout: 1000,
    })
  : null;

async function fetchBinary(dmxstart, pixeltype, numled) {
  if (
    lastFlash.dmxstart == dmxstart &&
    lastFlash.pixeltype == pixeltype &&
    lastFlash.numled == numled
  )
    return lastFlash.buffer;

  if (isElectron && ipcRenderer) {
    // Use Electron IPC to download firmware
    const result = await ipcRenderer.invoke("download-firmware", {
      dmxstart,
      pixeltype,
      numled,
    });
    if (result.success) {
      lastFlash = {
        dmxstart,
        pixeltype,
        numled,
        buffer: result.buffer,
      };
      return result.buffer;
    } else {
      window.showAvrgirlError("Firmware download failed: " + result.error);
      throw new Error(result.error);
    }
  } else {
    // Browser fallback
    var url = `https://github.com/mcMineyC/ws281x-dmx-controller/releases/download/${numled}/receiver_${pixeltype}_${dmxstart}_${numled}leds.hex`;
    const response = await axios.get("https://proxy.corsfix.com/?" + url, {
      responseType: "arraybuffer", // Request the response as an ArrayBuffer
    });
    lastFlash = {
      dmxstart,
      pixeltype,
      numled,
      buffer: response.data,
    };
    return response.data;
  }
}

async function flashClicked() {
  console.log("Flash clicked");
  document.querySelector("#flash-button").style.display = "none";
  document.querySelector("#progress-container").style.display = "flex";
  window.hideAvrgirlError();
  const address = document.querySelector("#dmxstart").value;
  const numled = document.querySelector("#numled").value;
  const pixelType = document.querySelector("#pixel-type-select").value;
  var binary = await fetchBinary(address, pixelType, numled);
  document.querySelector("#flash-button").style.display = "flex";
  document.querySelector("#progress-container").style.display = "none";
  try {
    if (isElectron && ipcRenderer) {
      // Use Electron IPC to upload firmware
      const result = await ipcRenderer.invoke("upload-firmware", {
        buffer: binary,
        board: "uno",
      });
      if (result.success) {
        window.hideAvrgirlError();
        console.info("done correctly.");
      } else {
        window.showAvrgirlError(result.error.toString().substring(0, 42));
        console.log(result.error);
      }
    } else {
      // Browser fallback
      avrgirl.flash(binary, (error) => {
        if (error) {
          window.showAvrgirlError(error.toString().substring(0, 42));
          // setTimeout(() => window.hideAvrgirlError(), 1000);
          console.log(error);
        } else {
          window.hideAvrgirlError();
          console.info("done correctly.");
        }
      });
    }
  } catch (e) {
    if (e.toString().includes("requestPort")) {
      alert(
        "Please use Chrome.\nThis tool needs WebUSB which for some reason\nis only available in Chrome-based browsers :/",
      );
    } else {
      console.error(e);
    }
  }
}

document.querySelector("#flash-button").addEventListener("click", flashClicked);
