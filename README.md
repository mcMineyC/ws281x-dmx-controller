# ws281x-dmx-controller
A project to make controllers that fix the issues with popular WS281x DMX controllers

## Overview

This project provides an Arduino-based WS281x DMX controller that allows you to control LED strips via the DMX protocol.

## Features

- Configurable DMX start address
- Support for both RGB and RGBW pixel types
- Automated build and release workflow

## Arduino Sketch

The `sketch.ino` file is a template with configurable placeholders:
- `<#DMXADDRESS#>` - The DMX start address for the controller
- `<#PIXEL_TYPE#>` - The pixel type (rgb or rgbw)

## Build and Release Workflow

The GitHub Actions workflow (`.github/workflows/build-and-release.yml`) automatically:

1. **Modifies the sketch** - Replaces template placeholders with configured values:
   - DMX Address: 15
   - Pixel Type: rgbw

2. **Compiles the sketch** - Uses Arduino CLI to compile the sketch for Arduino Uno

3. **Creates a release** - Uploads the compiled `.hex` file to GitHub Releases

### Triggering the Workflow

The workflow can be triggered in two ways:
- **Automatically**: When you push a tag starting with `v` (e.g., `v1.0.0`)
- **Manually**: Using the "Actions" tab in GitHub and clicking "Run workflow"

### Creating a Release

To create a new release:

```bash
git tag v1.0.0
git push origin v1.0.0
```

The workflow will automatically build the sketch and create a GitHub release with the compiled firmware.

## Configuration

To change the DMX address or pixel type, edit the workflow file:
`.github/workflows/build-and-release.yml`

Look for the "Modify sketch.ino with configuration values" step and update the `sed` commands with your desired values.
