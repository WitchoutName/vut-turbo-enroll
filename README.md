# vut-turbo-enroll

This Chrome extension allows you to automate the registration of class blocks on the VUT university website. It provides a convenient interface for selecting a time block and setting the registration time. When the registration time arrives, the extension will automatically register the selected time block for you.

## Installation

To use this Chrome extension, follow these steps:

1. Download the latest release and unzip the file.
2. [Folow this guide](https://webkul.com/blog/how-to-install-the-unpacked-extension-in-chrome/) 

## Usage

1. Click on the extension icon in the Chrome toolbar to open the popup.
2. Pick a registration time by entering it in the "Pick registration time" input field. The time should be in the format `hh:mm`.
3. Click the "Select" button to start selecting a time block on the VUT website.
4. Once you've selected a time block, it will be displayed below the "Pick a time block to register" section.
5. Click the "Confirm" button to confirm the registration. The extension will schedule the registration for the specified time.
6. The extension will automatically register the selected time block when the scheduled time arrives.
7. If needed, you can cancel the registration by clicking the "Cancel" button.

### Live demo

[![demo](http://img.youtube.com/vi/VMR8unJx6T0/0.jpg)](http://www.youtube.com/watch?v=VMR8unJx6T0 "Video Title")
# Development

## How It Works

This extension uses a combination of background scripts, content scripts, and messaging to achieve its functionality.

- The **Background Script** :
- Manages alarms for scheduling registration.
- Communicates with the popup and content script using message passing.
- Creates and cancels alarms for registration.
- Handles the logic for registering the selected class block.
- The **Content Script** :
- Injected into the VUT website.
- Allows users to select a class block by clicking on it.
- Communicates with the background script to trigger registration.
- The **Popup** :
- Provides a user-friendly interface for setting the registration time.
- Communicates with the background script to schedule registration and cancel it if needed.

## Installing

1. Check if your `Node.js` version is >= **14**.
2. Change or configurate the name of your extension on `src/manifest`.
3. Run `npm install` to install the dependencies.

## Developing

run the command

```shell
$ cd vut-turbo-enroll

$ npm run dev
```

### Chrome Extension Developer Mode

1. set your Chrome browser 'Developer mode' up
2. click 'Load unpacked', and select `vut-turbo-enroll/build` folder

### Normal FrontEnd Developer Mode

1. access `http://localhost:3000/`
2. when debugging popup page, open `/popup.html`
3. when debugging options page, open `/options.html`

## Packing

After the development of your extension run the command

```shell
$ npm build
```

Now, the content of `build` folder will be the extension ready to be submitted to the Chrome Web Store. Just take a look at the [official guide](https://developer.chrome.com/webstore/publish) to more infos about publishing.

---

Generated by [create-chrome-ext](https://github.com/guocaoyi/create-chrome-ext)
