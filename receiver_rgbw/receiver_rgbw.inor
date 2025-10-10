// DMX Receiver/Fixture Example for SK6812 RGBW LEDs
// Target Hardware:  Arduino Uno
//
// Receives individual RGBW levels for 60 SK6812 LEDs (60*4 = 240 DMX channels total)
// over an RS485 link in DMX packet format, to be decoded and sent out to a 60 LED strip.
// The test pattern is an LED chaser where two different color bars run end to end
// along the strip at different speeds, crossing over each other when they meet.
//
// The first DMX channel is 1 so the 60 LED RGBW values are sent sequentially in
// channels 1 to 240, eg:
// Ch   1: LED  0 RED   value [0-255]
// Ch   2: LED  0 GREEN value [0-255]
// Ch   3: LED  0 BLUE  value [0-255]
// Ch   4: LED  0 WHITE value [0-255]
// ...
// Ch 237: LED 59 RED   value [0-255]
// Ch 238: LED 59 GREEN value [0-255]
// Ch 239: LED 59 BLUE  value [0-255]
// Ch 240: LED 59 WHITE value [0-255]
//
// Required library:
//    DMXSerial        install from library manager or https://github.com/mathertel/DMXSerial
//
// Gadget Reboot
// https://www.youtube.com/gadgetreboot

#include <DMXSerial.h>
#include "ws2812.h"                // a specific LED controller that disables interrupts to work better

// Macros defined by script
#define NUM_LEDS <#NUMPIXELS#>                // number of RGBW LEDs on strip
#define DMXSTART <#DMXADDRESS#>                 // first DMX channel
#define DMXLENGTH (NUM_LEDS*4)+(DMXSTART-1)     // number of DMX channels used (4*NUM_LEDS)

byte blankRgbwData[DMXLENGTH];

void setup () {
  for(int i = 0; i < NUM_LEDS; i++){
    if(i < NUM_LEDS/3){
      blankRgbwData[i*4] = 255;     // R
      blankRgbwData[i*4+1] = 0;     // G
      blankRgbwData[i*4+2] = 0;     // B
      blankRgbwData[i*4+3] = 0;     // W
    }else if(i < (NUM_LEDS/3)*2){
      blankRgbwData[i*4] = 0;
      blankRgbwData[i*4+1] = 255;
      blankRgbwData[i*4+2] = 0;
      blankRgbwData[i*4+3] = 0;
    }else{
      blankRgbwData[i*4] = 0;
      blankRgbwData[i*4+1] = 0;
      blankRgbwData[i*4+2] = 255;
      blankRgbwData[i*4+3] = 0;
    }
  }

  DMXSerial.init(DMXProbe);        // initialize DMX bus in manual access mode
  DMXSerial.maxChannel(DMXLENGTH); // "onUpdate" will be called when all new ch data has arrived

  setupNeopixel();                 // setup the LED output hardcoded to pin 12 in ws2812.h
  updateNeopixel(blankRgbwData, NUM_LEDS);
  delay(1000);
}


void loop() {
  // wait for an incoming DMX packet and write
  // the RGBW data for 60 LEDs on the strip
  if (DMXSerial.receive()) {
    updateNeopixel(DMXSerial.getBuffer() + DMXSTART, NUM_LEDS);
  }
}
