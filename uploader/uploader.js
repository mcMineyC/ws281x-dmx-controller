var lastFlash = {};
let avrgirl = new AvrgirlArduino({
  board: "uno",
  debug: true,
  timeout: 1000,
});
var testbin = null;
async function fetchTest() {
  if (testbin !== null) return testbin;

  var url = `https://raw.githubusercontent.com/noopkat/avrgirl-arduino/refs/heads/master/junk/hex/uno/Blink.cpp.hex`;
  const response = await axios.get("https://proxy.corsfix.com/?" + url, {
    responseType: "arraybuffer", // Request the response as an ArrayBuffer
  });
  testbin = response.data;
  return response.data;
}
async function fetchBinary(dmxstart, pixeltype, numled) {
  if (
    lastFlash.dmxstart == dmxstart &&
    lastFlash.pixeltype == pixeltype &&
    lastFlash.numled == numled
  )
    return lastFlash.buffer;

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
async function testClicked() {
  console.log("test clicked");
  var binary = await fetchTest();
  try {
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
async function flashClicked() {
  console.log("Flash clicked");
  document.querySelector("#flash-button").style.display = "none";
  document.querySelector("#progress-container").style.display = "flex";
  window.hideAvrgirlError();
  const address = document.querySelector("#dmxstart").value;
  const numled = document.querySelector("#numled").value;
  const pixelType = document.querySelector("#pixel-type-select").value;
  var binary = await fetchBinary(address, pixelType, numled);
  try {
    avrgirl.flash(binary, (error) => {
      document.querySelector("#flash-button").style.display = "flex";
      document.querySelector("#progress-container").style.display = "none";
      if (error) {
        window.showAvrgirlError(error.toString().substring(0, 42));
        // setTimeout(() => window.hideAvrgirlError(), 1000);
        console.log(error);
      } else {
        window.hideAvrgirlError();
        console.info("done correctly.");
      }
    });
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
