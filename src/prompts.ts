import chalk from "chalk";
import inquirer from "inquirer";

export async function doAPrompt(groups: GoogleChatGroupInfo[]) {
    return new Promise<void>(async (resolve, reject) => {
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
                            `${group.allMessages.length} Total Messages in ${group.name}`
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
                        if (group.members.length != 0) {
                            for (const i of group.members) {
                                const { name, email, messages } = i;
                                memberInfo[email] = {
                                    name,
                                    messages: messages.length,
                                };
                            }
                            console.log(
                                `${group.allMessages.length} Total Messages in ${group.name}`
                            );
                            console.table(memberInfo);
                        } else {
                            console.log(`There appears to be no members in this group...`);
                        }
                        break;
                    // case 'Search for Message(s)':

                    //     break;
                    case 'Get Group Information':
                        console.log(`Group Name: ${group.name}\nGroup ID: ${group.id}\nGroup Type: ${group.type}`)
                        break;
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
    })
}