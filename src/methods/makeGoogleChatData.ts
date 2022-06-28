import { readdir as readDirectory, stat as getFileOrFolderStats } from 'fs/promises';
import { resolve as resolveFileOrDirectory, isAbsolute } from 'path';
import chalk from 'chalk';
import { getGroupData } from './getGroupData.js';

/**
 * Find the Google Chat Folder and turn its contents into an object.
 * @param {string} givenDirectory The directory given to this function.
 */
export async function makeGoogleChatData(givenDirectory: string): Promise<GoogleChatGroupInfo[]> {
    return new Promise(async (resolvePromise, rejectPromise) => {
        try {
            let workingDirectory: string;

            if (isAbsolute(givenDirectory)) {
                workingDirectory = givenDirectory;
            } else {
                workingDirectory = resolveFileOrDirectory(process.cwd(), givenDirectory);
            }
        
            const googleChatFolderLocation = resolveFileOrDirectory(workingDirectory, `./Google Chat`);
            const groupsFolderLocation = resolveFileOrDirectory(googleChatFolderLocation, `./Groups`);
        
            getFileOrFolderStats(googleChatFolderLocation)
                .then(async (folderStats) => {
                    if (folderStats.isDirectory()) {
                        try {
                            console.log(`${chalk.green(`Found ${chalk.blue(googleChatFolderLocation)}!`)}
                            \nMaking data... This may take awhile, so please be patient!`);
                            await getFileOrFolderStats(groupsFolderLocation)
                                .then(async (groupsFolderStats) => {
                                    if (groupsFolderStats.isDirectory()) {
                                        const groupList = await readDirectory(groupsFolderLocation, {});
                                        const groups: GoogleChatGroupInfo[] = [];
                                        const groupPromises = groupList.map((i) => getGroupData(groupsFolderLocation, i));
                                        for await (const i of groupPromises) {
                                            groups.push(i);
                                            console.log(`Finished making data on ${chalk.blue(i.name)}!`);
                                        }
                                        console.log(`${chalk.green(`Finished making data on the following groups:\n${chalk.blue(groups.map(group => group.name).join(`\n`))}`)}`);
                                        resolvePromise(groups);
                                    }
                                })
                                .catch((error) => {
                                    console.log(error);
                                    console.log(
                                        chalk.red(`Groups information will be excluded because it could not be found.`)
                                    );
                                });
                        } catch (error) {
                            throw error;
                        }
                    } else {
                        throw new Error(`Given path was not a folder!`);
                    }
                })
        } catch (error) {
            rejectPromise(error);
        }

    })
}