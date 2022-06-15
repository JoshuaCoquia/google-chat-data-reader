# Hangouts Data Reader
A simple Command Line Interface (CLI) tool that can be used to read Google Hangouts data from a **hangouts.json** file.

## Quick Start
1. Download Data from https://takeout.google.com/
    Make sure that *Hangouts* is selected.
2. Download this repository
    You can download this repository onto your computer by going to this repository in Github, clicking the green "code" button, and clicking "Download ZIP".
    Alternatively, you can [click this download link](https://github.com/JoshuaCoquia/hangouts-data-reader/archive/refs/heads/main.zip), which leads to the same zip file being downloaded.
3. Copy *hangouts.json* to the *input* folder in this repository.
    You can find *hangouts.json* in takeout-xxxxxxxxxxxxxxxx-xxx/Takeout/Hangouts/Hangouts.json.
    Copy that file to the /input/ folder in this repository.
4. Build & Run
    Go into your preferred CLI, and run the following commands in this folder:
    ```console
    yarn build
    yarn start
    ```