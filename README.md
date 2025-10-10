# WS281x DMX Controller
Supports both RGB and RGBW WS281-like (WS2812, WS2815, WS2811, etc) pixels
A project to make controllers that fix the issues with popular WS281x DMX controllers.  Many off-the-shelf controllers just don't make sense and can't expose each pixel in a WS281x strip (more commonly known as Neopixels) as individual "fixtures" to DMX control boards.  This project aims to remedy that.

It's based on the wonderful work of (GadgetReboot)[https://github.com/GadgetReboot/Arduino/tree/master/Uno/DMX_Serial_Tx_Rx/WS2812B_60_Test].  Modified to include RGBW support

# Installation
While you could download the code and compile, you could also download the firmware from the releases.  I wouldn't recommend that either, since the releases has **1,005** files in it.  Just use this simple flasher :wink:

(Flasher Link)[https://ws281x-dmx-flasher.vercel.app/]
