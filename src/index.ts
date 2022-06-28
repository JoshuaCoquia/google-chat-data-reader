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
                message: "Would you like to read a group's data?",
                choices: ['Yes', 'No'],
            },
        ]);
        if (continuereading === 'No') break;
        if (continuereading === 'Yes') {
            const {
                grouptoread,
                action,
            }: {
                [key: string]: string;
            } = await inquirer.prompt([
                {
                    type: 'list',
                    name: 'grouptoread',
                    message: 'Which group do you want to read?',
                    choices: [...groups.map((group) => group.name), new inquirer.Separator()],
                },
                {
                    type: 'list',
                    name: 'action',
                    message: `What do you want to do with the group?`,
                    choices: [
                        'Count Total Number of Messages in Group',
                        'Count Number of Messages by Each Member',
                        'Search for Message',
                        'Get Group Information',
                        new inquirer.Separator(),
                        chalk.red(`Go Back`),
                        new inquirer.Separator(),
                    ],
                },
            ]);
            const group = groups.find((group) => group.name === grouptoread);
            if (group) {
                const { action } = await inquirer.prompt([]);
                switch (action) {
                    default:
                        inquirer.prompt([
                            {
                                type: 'confirm',
                                name: 'a',
                                message: `The action ${chalk.blue(action)} could not be performed...`,
                            },
                        ]);
                        break;
                }
            } else {
                await inquirer.prompt([
                    {
                        type: 'confirm',
                        name: 'b',
                        message: `The group ${grouptoread} could not be found...`,
                    },
                ]);
            }
        }
    }
});
