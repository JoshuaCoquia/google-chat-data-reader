// Import Required Dependencies
import { readFile, stat as getFileStats } from 'fs/promises';
import { resolve as resolveFileOrDirectory, isAbsolute } from 'path';
import { parse } from 'yaml';
import chalk from 'chalk';

/** The shape of a configuration file for this project. Generally found in /input/config.yml
 */
interface ConfigFile {
    folderLocation: string;
}

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
 * Find hangouts.json file and parse its contents.
 * @param {string} givenDirectory The directory given to this function.
 */
async function readHangoutsJSON(givenDirectory: string) {
    let workingDirectory: string;

    if (isAbsolute(givenDirectory)) {
        workingDirectory = givenDirectory;
    } else {
        workingDirectory = resolveFileOrDirectory(process.cwd(), givenDirectory);
    }

    const fileLocation = resolveFileOrDirectory(workingDirectory, `./hangouts.json`);

    console.log(`Finding ${chalk.blue(fileLocation)}...`);

    getFileStats(fileLocation)
    .then(async (fileStats) => {
        if (fileStats.isFile()) {
            try {
                console.log(`${chalk.green(`Found ${chalk.blue(fileLocation)}!`)}\nReading the file's contents. This may take awhile, so please be patient!`);
                const controller = new AbortController();
                const { signal } = controller;
                const file = await readFile(fileLocation, { signal, encoding: 'utf8' });
                const hangoutsData = JSON.parse(file);
                console.log(`${chalk.green(`Reading file succeeded!`)}`);
                return hangoutsData;

            } catch (error) {
                throw error;
            }

        } else {
            throw new Error(`Given path was not a file!`);
        }
    })
    .catch((error) => {
        switch (true) {
            case (error.message === `Given path was not a file!`):
                console.error(`${chalk.red(`${chalk.blue(fileLocation)} was not a file! Please check it before trying again.`)}`);
                break;
            case (error.code === `ENOENT`):
                console.error(`${chalk.red(`Could not find ${chalk.blue(fileLocation)}! Please make sure that the ${chalk.blue(`Hangouts.json`)} is in that location!`)}`);
                break;
            default:
                console.error(`${error}\n${chalk.red(`An unknown error occured! If this is occuring repeatedly and you don't know why, please notify the developer.`)}`);
        }
    })
}

const config = await readConfig(process.cwd());
const hangoutsData = readHangoutsJSON(config.folderLocation);