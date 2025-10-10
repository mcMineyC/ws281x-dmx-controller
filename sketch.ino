// WS281x DMX Controller
// This sketch controls WS281x LED strips via DMX protocol

#include <Adafruit_NeoPixel.h>
#include <DMXUSB.h>

// Configuration placeholders
#define DMX_ADDRESS <#DMXADDRESS#>
#define PIXEL_TYPE <#PIXEL_TYPE#>

// Pin definitions
#define LED_PIN 6
#define NUM_PIXELS 150

// Initialize the pixel strip
#if PIXEL_TYPE == rgbw
Adafruit_NeoPixel strip = Adafruit_NeoPixel(NUM_PIXELS, LED_PIN, NEO_GRBW + NEO_KHZ800);
#else
Adafruit_NeoPixel strip = Adafruit_NeoPixel(NUM_PIXELS, LED_PIN, NEO_GRB + NEO_KHZ800);
#endif

void setup() {
  // Initialize DMX
  DMXUSBSerial.begin();
  
  // Initialize LED strip
  strip.begin();
  strip.show(); // Initialize all pixels to 'off'
  
  Serial.begin(9600);
  Serial.print("DMX Controller initialized at address: ");
  Serial.println(DMX_ADDRESS);
  Serial.print("Pixel type: ");
  Serial.println(#PIXEL_TYPE);
}

void loop() {
  // Read DMX data starting from DMX_ADDRESS
  for (int i = 0; i < NUM_PIXELS; i++) {
    #if PIXEL_TYPE == rgbw
      int r = DMXUSBSerial.read(DMX_ADDRESS + (i * 4));
      int g = DMXUSBSerial.read(DMX_ADDRESS + (i * 4) + 1);
      int b = DMXUSBSerial.read(DMX_ADDRESS + (i * 4) + 2);
      int w = DMXUSBSerial.read(DMX_ADDRESS + (i * 4) + 3);
      strip.setPixelColor(i, strip.Color(r, g, b, w));
    #else
      int r = DMXUSBSerial.read(DMX_ADDRESS + (i * 3));
      int g = DMXUSBSerial.read(DMX_ADDRESS + (i * 3) + 1);
      int b = DMXUSBSerial.read(DMX_ADDRESS + (i * 3) + 2);
      strip.setPixelColor(i, strip.Color(r, g, b));
    #endif
  }
  
  strip.show();
  delay(20); // Small delay for stability
}
