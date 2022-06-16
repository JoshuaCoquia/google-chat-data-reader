// Import Required Dependencies
import { readFile, stat as getFileStats } from 'fs/promises';
import { resolve as resolveFileOrDirectory, isAbsolute } from 'path';
import { parse } from 'yaml';
import chalk from 'chalk';

// Types are in index.d.ts, and they are automatically imported.

// Code
/**
 * Read the config file for this project.
 * @param {string} projectDirectory - The directory of this project.
 * @returns {ConfigFile} config - The config file is expected to be in this format.
 */
async function readConfig(projectDirectory: string): Promise<ConfigFile> {
    return new Promise(async (resolve, reject) => {
        try {
            const configFileLocation = resolveFileOrDirectory(projectDirectory, 'input/config.yml');
            const configFile = await readFile(configFileLocation, 'utf-8');
            const config: ConfigFile = parse(configFile);
            resolve(config);
        } catch (error) {
            reject(error);
        }
    });
}

/**
 * Find the Google Chat Folder and turn its contents into an object.
 * @param {string} givenDirectory The directory given to this function.
 */
async function makeGoogleChatData(givenDirectory: string) {
    let workingDirectory: string;

    if (isAbsolute(givenDirectory)) {
        workingDirectory = givenDirectory;
    } else {
        workingDirectory = resolveFileOrDirectory(process.cwd(), givenDirectory);
    }

    const folderLocation = resolveFileOrDirectory(workingDirectory, `./Google Chat`);

    console.log(`Finding ${chalk.blue(folderLocation)}...`);

    getFileStats(folderLocation)
    .then(async (fileStats) => {
        if (fileStats.isDirectory()) {
            try {
                console.log(`${chalk.green(`Found ${chalk.blue(folderLocation)}!`)}\nMaking data... This may take awhile, so please be patient!`);
                console.log(`NOTE: This code is unfinished. Please check the Github repository for updates!`);
            } catch (error) {
                throw error;
            }

        } else {
            throw new Error(`Given path was not a folder!`);
        }
    })
    .catch((error) => {
        switch (true) {
            case (error.message === `Given path was not a folder!`):
                console.error(`${chalk.red(`${chalk.blue(folderLocation)} was not a folder! Please check it before trying again.`)}`);
                break;
            case (error.code === `ENOENT`):
                console.error(`${chalk.red(`Could not find ${chalk.blue(folderLocation)}! Please make sure that this folder exists.`)}`);
                break;
            default:
                console.error(`${error}\n${chalk.red(`An unknown error occured! If this is occuring repeatedly and you don't know why, please notify the developer.`)}`);
        }
    })
}

const config = await readConfig(process.cwd());
const googleChatData = makeGoogleChatData(config.folderLocation);