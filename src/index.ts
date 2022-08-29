// Import Required Dependencies
import chalk from 'chalk';
import { readFile } from 'fs/promises';
import { resolve as resolveFileOrDirectory } from 'path';
import { parse } from 'yaml';
import { makeGoogleChatData } from './methods/makeGoogleChatData.js';
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
    makeGoogleChatData(config.folderLocation).then(async (groups) => {
        let doPrompts = true;
        while (doPrompts) {
            await doAPrompt();
        }
        async function doAPrompt() {
            return new Promise<void>(async (resolve, reject) => {
                const { continuereading } = await inquirer.prompt([
                    {
                        type: 'list',
                        name: 'continuereading',
                        message: "Would you like to read a group's data?",
                        choices: ['Yes', 'No'],
                    },
                ]);
                if (continuereading === 'Yes') {
                    inquirer
                        .prompt([
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
                                    'Search for Message(s)',
                                    'Get Group Information',
                                    new inquirer.Separator(),
                                    chalk.red(`Go Back`),
                                    new inquirer.Separator(),
                                ],
                            },
                            // {
                            //     type: 'number',
                            //     name: 'startdate',
                            //     when: (answers) =>
                            //         answers.action.startsWith('Count') || answers.action.startsWith('Search'),
                            //     message: 'Start Date? (unix timestamp OR invalid date for all time)',
                            // },
                            // {
                            //     type: 'number',
                            //     name: 'enddate',
                            //     when: (answers) =>
                            //         answers.action.startsWith('Count') || answers.action.startsWith('Search'),
                            //     message: 'End Date? (unix timestamp OR invalid date for all time)',
                            // },
                        ])
                        .then(async (answers) => {
                            const { grouptoread, action, startdate, enddate } = answers;
                            // const startingDate = new Date(startdate);
                            // const endingDate = new Date(enddate);

                            const group = groups.find((group) => group.name === grouptoread);
                            if (group) {
                                switch (action) {
                                    case 'Count Total Number of Messages in Group':
                                        console.log(
                                            `Total amount of messages in ${group.name}: ${group.allMessages.length}`
                                        );
                                        break;
                                    case 'Count Number of Messages by Each Member':
                                        const memberInfo: any = {};
                                        // https://stackoverflow.com/a/1353711 for date checker
                                        // let useStartingDate = false;
                                        // let useEndingDate = false;
                                        // let startTimestamp: number;
                                        // let endTimestamp: number;
                                        // if (startingDate instanceof Date && !isNaN(startingDate.getTime())) {
                                        //     useStartingDate = true;
                                        //     startTimestamp = startingDate.getTime();
                                        // }
                                        // if (endingDate instanceof Date && !isNaN(endingDate.getTime())) {
                                        //     useEndingDate = true;
                                        //     endTimestamp = endingDate.getTime();
                                        // }
                                        
                                        for (const i of group.members) {
                                            const { name, email, messages } = i;
                                            memberInfo[email] = {
                                                name,
                                                messages: messages.length,
                                            };
                                        }
                                        console.table(memberInfo);

                                        break;
                                    // case 'Search for Message(s)':

                                    //     break;
                                    // case 'Get Group Information':

                                    //     break;
                                    case chalk.red(`Go Back`):
                                        break;
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
                                resolve();
                            } else {
                                await inquirer.prompt([
                                    {
                                        type: 'confirm',
                                        name: 'b',
                                        message: `The group ${grouptoread} could not be found...`,
                                    },
                                ]);
                                resolve();
                            }
                        });
                } else {
                    doPrompts = false;
                    resolve();
                }
            })

        }
    });
})();
