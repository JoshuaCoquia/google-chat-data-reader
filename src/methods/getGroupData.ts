// Import Required Dependencies
import { readFile, readdir as readDirectory, stat as getFileOrFolderStats } from 'fs/promises';
import { resolve as resolveFileOrDirectory } from 'path';
import chalk from 'chalk';
import { readMessageData } from './readMessageData.js';
import { arrayBuffer } from 'stream/consumers';

export async function getGroupData(
    groupsFolderLocation: string,
    groupFolderName: string
): Promise<void | GoogleChatGroupInfo> {
    return new Promise(async (resolvePromise, rejectPromise) => {
        let defaultEncodingOption: { encoding: BufferEncoding } = {
            encoding: 'utf-8',
        };
        const groupFolderLocation = resolveFileOrDirectory(groupsFolderLocation, groupFolderName);
        console.log(`Finding group ${chalk.blue(`${groupFolderLocation}`)}...`);
        const groupDirectoryStats = await getFileOrFolderStats(groupFolderLocation);
        try {
            if (groupDirectoryStats.isDirectory()) {
                const groupDirectory = await readDirectory(groupFolderLocation);
                if (groupDirectory.includes(`group_info.json`) && groupDirectory.includes(`messages.json`)) {
                    console.log(chalk.green(`Found group ${chalk.blue(`${groupFolderLocation}`)}!`));

                    const groupMessagesFile = await readFile(
                        resolveFileOrDirectory(groupFolderLocation, `messages.json`),
                        defaultEncodingOption
                    );
                    const messagesRaw: GoogleChatMessageRaw[] = JSON.parse(groupMessagesFile).messages;
                    const messages = await readMessageData(messagesRaw);

                    const groupInfoFile = await readFile(
                        resolveFileOrDirectory(groupFolderLocation, `group_info.json`),
                        defaultEncodingOption
                    );
                    const groupInfo: GoogleChatGroupInfo = JSON.parse(groupInfoFile);

                    console.log(
                        `Amount of messages in ${chalk.yellow(groupInfo.name ?? `Unknown DM`)}: ${chalk.yellow(
                            messages.length
                        )}`
                    );

                    const listOfMembers: GoogleChatUserInGroup[] = [];

                    for (const i of groupInfo.members) {
                        const messagesByMember = messages.filter((message) => message.creator.name === i.name);
                        const customMemberData: GoogleChatUserInGroup = {
                            ...i,
                            messages: messagesByMember,
                        }
                        listOfMembers.push(customMemberData);
                    }
                    listOfMembers.sort((a, b) => {
                        if (a.messages.length > b.messages.length) {
                            return -1;
                        }
                        if (a.messages.length < b.messages.length) {
                            return 1;
                        }
                        return 0;
                    })
                    for (const i of listOfMembers) {
                        console.log(`${i.name} is #${listOfMembers.indexOf(i) + 1} with ${i.messages.length}`);
                    }

                    resolvePromise();
                }
            } else {
                throw new Error(`Given group was not a folder!`);
            }
        } catch (error) {
            rejectPromise(error);
        }
    });
}
