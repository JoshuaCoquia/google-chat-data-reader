// Import Required Dependencies
import { readFile } from 'fs/promises';
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
async function main(givenDirectory: string) {
    let workingDirectory: string;

    if (isAbsolute(givenDirectory)) {
        workingDirectory = givenDirectory;
    } else {
        workingDirectory = resolveFileOrDirectory(process.cwd(), givenDirectory);
    }

    console.log(`Finding ${chalk.blue(`hangouts.json`)} in ${chalk.blue(workingDirectory)}...`);
    // TODO: find hangouts.json in working directory
}

const config = await readConfig(process.cwd());
main(config.folderLocation);
