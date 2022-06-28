// Import Required Dependencies
import { readFile, readdir as readDirectory, stat as getFileOrFolderStats } from 'fs/promises';
import { resolve as resolveFileOrDirectory } from 'path';
import chalk from 'chalk';
import { readMessageData } from './readMessageData.js';

export async function getGroupData(
    groupsFolderLocation: string,
    groupFolderName: string
): Promise<GoogleChatGroupInfo> {
    return new Promise(async (resolvePromise, rejectPromise) => {
        let defaultEncodingOption: { encoding: BufferEncoding } = {
            encoding: 'utf-8',
        };
        const groupFolderLocation = resolveFileOrDirectory(groupsFolderLocation, groupFolderName);
        const groupDirectoryStats = await getFileOrFolderStats(groupFolderLocation);
        try {
            if (groupDirectoryStats.isDirectory()) {
                const groupDirectory = await readDirectory(groupFolderLocation);
                if (groupDirectory.includes(`group_info.json`)) {

                    const groupInfoFile = await readFile(
                        resolveFileOrDirectory(groupFolderLocation, `group_info.json`),
                        defaultEncodingOption
                    );
                    const groupInfo: GoogleChatGroupInfo = JSON.parse(groupInfoFile);
                    const listOfMembers: GoogleChatUserInGroup[] = [];
                    
                    if (groupDirectory.includes(`messages.json`)) {
                        const groupMessagesFile = await readFile(
                            resolveFileOrDirectory(groupFolderLocation, `messages.json`),
                            defaultEncodingOption
                        );
                        const groupMessagesRaw = JSON.parse(groupMessagesFile);
                        const messagesRaw: GoogleChatMessageRaw[] = groupMessagesRaw.messages;
                        const messages = await readMessageData(messagesRaw);
                        for (const i of groupInfo.members) {
                            const messagesByMember = messages.filter((message) => message.creator.name === i.name);
                            const customMemberData: GoogleChatUserInGroup = {
                                ...i,
                                messages: messagesByMember,
                            };
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
                        });
                    }

                    const groupData: GoogleChatGroupInfo = {
                        name: groupInfo.name ?? `DM with member(s) ${listOfMembers.map((member) => member.name).join(' + ')}`,
                        type: groupInfo.type,
                        emoji_id: groupInfo.emoji_id,
                        members: listOfMembers,
                    }
                    resolvePromise(groupData);
                }
            } else {
                throw new Error(`Given group was not a folder!`);
            }
        } catch (error) {
            rejectPromise(error);
        }
    });
}
