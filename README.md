# Google Chat Data Reader
## v0.1.0
A simple Command Line Interface (CLI) tool that can be used to read Google Chat data from a **Google Chat** folder.

## Prerequisites
You need to have the following installed:
* [node.js](https://nodejs.org/en/)
  I use v17.3.0 but the LTS version should work. You can check which version you have by running `node -v`.
* [yarn](https://yarnpkg.com/getting-started/install)
  I use v3.2.1 but you should be able to use any version that is 2.0.0 or above.
  Assuming you've already downloaded node.js but you haven't gotten yarn, you can use the following commands to install yarn:
  ```command
  corepack enable
  yarn set version stable
  yarn install
  ```

## Quick Start
1. **Download Data from https://takeout.google.com/**
  Create a new export.
  Make sure that at least *Google Chat* is selected.
  Download that export.
2. **Download this repository**
  You can download this repository onto your computer by going to this repository in Github, clicking the green "code" button, and clicking "Download ZIP".
  Alternatively, you can [click this download link](https://github.com/JoshuaCoquia/google-chat-data-reader/archive/refs/heads/main.zip), which leads to the same zip file being downloaded.
3. **Put the *Google Chat* folder in the *input* folder in this repository.**
  You can find *Google Chat* folder in /takeout-xxxxxxxxxxxxxxxx-xxx/Takeout/.
  Copy that folder to the **input** folder in this repository.
4. **Build & Run**
Go into your preferred CLI, and run the following commands in this folder:
  ```console
  yarn build
  yarn start
  ```