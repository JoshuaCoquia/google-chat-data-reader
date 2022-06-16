# Google Chat Data Reader
A simple Command Line Interface (CLI) tool that can be used to read Google Chat data from a **Google Chat** folder.

## Prerequisites
You need to have the following installed:
* [node.js](https://nodejs.org/en/)
  I use v17.3.0 but the LTS version should work. You can check which version you have by running `node -v`.

## Quick Start
1. **Download Data from https://takeout.google.com/**
  Make sure that *Google Chat* is selected.
2. **Download this repository**
  You can download this repository onto your computer by going to this repository in Github, clicking the green "code" button, and clicking "Download ZIP".
  Alternatively, you can [click this download link](https://github.com/JoshuaCoquia/hangouts-data-reader/archive/refs/heads/main.zip), which leads to the same zip file being downloaded.
3. **Put the *Google Chat* folder in the *input* folder in this repository.**
  You can find *Google Chat* folder in /takeout-xxxxxxxxxxxxxxxx-xxx/Takeout/Google Chat.
  Copy that file to the **input** folder in this repository.
4. **Build & Run**
Go into your preferred CLI, and run the following commands in this folder:
  ```console
  yarn build
  yarn start
  ```