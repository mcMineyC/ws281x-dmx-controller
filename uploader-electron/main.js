const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const axios = require("axios");
const AvrgirlArduino = require("avrgirl-arduino");

function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true, // Enable Node.js integration
      contextIsolation: false, // For compatibility with older code
    },
    show: false, // Don't show until ready
  });

  win.once("ready-to-show", () => {
    win.show();
  });

  // Load the uploader's HTML UI
  win.loadFile(path.join(__dirname, "index.html"));

  // Optionally open DevTools
  // win.webContents.openDevTools();

  return win;
}

// This method will be called when Electron has finished initialization
let mainWindow;
app.whenReady().then(() => {
  mainWindow = createWindow();

  app.on("activate", function () {
    // On macOS, recreate a window when the dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) mainWindow = createWindow();
  });
});

// Quit when all windows are closed, except on macOS.
app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});

// IPC handlers for firmware download and upload
let lastFlash = {};

ipcMain.handle("download-firmware", async (event, opts) => {
  const { dmxstart, pixeltype, numled } = opts;
  if (
    lastFlash.dmxstart === dmxstart &&
    lastFlash.pixeltype === pixeltype &&
    lastFlash.numled === numled
  ) {
    return { success: true, buffer: lastFlash.buffer };
  }
  try {
    const url = `https://github.com/mcMineyC/ws281x-dmx-controller/releases/download/${numled}/receiver_${pixeltype}_${dmxstart}_${numled}leds.hex`;
    const response = await axios.get("https://proxy.corsfix.com/?" + url, {
      responseType: "arraybuffer",
    });
    lastFlash = {
      dmxstart,
      pixeltype,
      numled,
      buffer: Buffer.from(response.data),
    };
    return { success: true, buffer: lastFlash.buffer };
  } catch (error) {
    return { success: false, error: error.toString() };
  }
});

ipcMain.handle("upload-firmware", async (event, opts) => {
  const { buffer, board = "uno" } = opts;
  try {
    let avrgirl = new AvrgirlArduino({
      board,
      debug: true,
      timeout: 1000,
    });
    return await new Promise((resolve) => {
      avrgirl.flash(buffer, (error) => {
        if (error) {
          resolve({ success: false, error: error.toString() });
        } else {
          resolve({ success: true });
        }
      });
    });
  } catch (error) {
    return { success: false, error: error.toString() };
  }
});
