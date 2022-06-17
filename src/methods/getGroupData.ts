// Import Required Dependencies
import { readFile, readdir as readDirectory, stat as getFileOrFolderStats } from 'fs/promises';
import { resolve as resolveFileOrDirectory } from 'path';
import chalk from 'chalk';
import { getDateFromChatString } from './getDateFromGoogleChatString.js';

export async function getGroupData(
    groupsFolderLocation: string,
    groupFolderName: string
): Promise<void | GoogleChatGroupData> {
    return new Promise(async (resolve, reject) => {
        const groupFolderLocation = resolveFileOrDirectory(groupsFolderLocation, groupFolderName);
        console.log(`Finding group ${chalk.blue(`${groupFolderLocation}`)}...`);
        const groupDirectoryStats = await getFileOrFolderStats(groupFolderLocation);
        try {
            if (groupDirectoryStats.isDirectory()) {
                const groupDirectory = await readDirectory(groupFolderLocation);
                if (groupDirectory.includes(`group_info.json`) && groupDirectory.includes(`messages.json`)) {
                    console.log(chalk.green(`Found group ${chalk.blue(`${groupFolderLocation}`)}!`));
                    const groupMessagesFile = await readFile(resolveFileOrDirectory(groupFolderLocation, `messages.json`), {
                        encoding: 'utf-8',
                    });
                    const groupInfoFile = await readFile(resolveFileOrDirectory(groupFolderLocation, `group_info.json`), {
                        encoding: 'utf-8',
                    });
                    
                    const messagesRaw: GoogleChatMessageRaw[] = JSON.parse(groupMessagesFile).messages;
                    const messages: GoogleChatMessage[] = messagesRaw.map((messageRaw) => {
                        const message: any = messageRaw;
                        message.createdDate = getDateFromChatString(messageRaw.created_date);
                        return message;
                    });

                    console.log(`amount of messages in ${groupFolderName}: ${messages.length}`);
                    resolve();
                }
            } else {
                throw new Error(`Given group was not a folder!`);
            }
        } catch (error) {
            reject(error);
        }
    });
}
