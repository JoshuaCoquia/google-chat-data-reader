// Import Required Dependencies
import chalk from 'chalk';
import { readFile } from 'fs/promises';
import { resolve as resolveFileOrDirectory } from 'path';
import { parse } from 'yaml';
import { makeGoogleChatData } from './methods/makeGoogleChatData.js';

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



const config = await readConfig(process.cwd());
makeGoogleChatData(config.folderLocation)
.then((googleChatInfo) => {
    //TODO: use data
})
.catch(error => {
    console.error(`${error}\n${chalk.red(`Google Chat data could not be made because of an error!`)}`);
})