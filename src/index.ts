// Import Required Dependencies

import { readFile } from 'fs/promises';
import { resolve as resolveFileOrDirectory } from 'path';
import { parse } from 'yaml';
import { makeGoogleChatData } from './methods/makeGoogleChatData.js';
import { doAPrompt } from './prompts.js';
import inquirer from 'inquirer';
(async function () {
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
    try {
        makeGoogleChatData(config.folderLocation).then(async (groups) => {
            // use group data here
            let doPrompts = true;
            do {
                await doAPrompt(groups);
                const { continuereading } = await inquirer.prompt([
                    {
                        type: 'list',
                        name: 'continuereading',
                        message: "Would you like to read a group's data?",
                        choices: ['Yes', 'No'],
                    },
                ]);
                if (continuereading == 'No') doPrompts = false;
            } while (doPrompts);
        });
    } catch (error) {
        console.error(error);
    }
})();
