// Import Required Dependencies
import chalk from 'chalk';
import { readFile } from 'fs/promises';
import { resolve as resolveFileOrDirectory, toNamespacedPath } from 'path';
import { parse } from 'yaml';
import { makeGoogleChatData } from './methods/makeGoogleChatData.js';
import inquirer from 'inquirer';

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
makeGoogleChatData(config.folderLocation).then(async (groups) => {
    while (true) {
        const { continuereading } = await inquirer.prompt([
            {
                type: 'list',
                name: 'continuereading',
                message: 'Would you like to continue reading the data?',
                choices: ['Yes', 'No'],
            },
        ]);
        if (continuereading === 'No') break;
        if (continuereading === 'Yes') {
            const { grouptoread } = await inquirer.prompt([
                {
                    type: 'list',
                    name: 'grouptoread',
                    message: 'Which group do you want to read?',
                    choices: groups.map((group) => group.name),
                },
            ]);
        }
    }
});
