// Import Required Dependencies
import { readFile, readdir as readDirectory, stat as getFileOrFolderStats } from 'fs/promises';
import { resolve as resolveFileOrDirectory } from 'path';
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
                    const messages: GoogleChatMessage[] = [];
                    
                    if (groupDirectory.includes(`messages.json`)) {
                        const groupMessagesFile = await readFile(
                            resolveFileOrDirectory(groupFolderLocation, `messages.json`),
                            defaultEncodingOption
                        );
                        const groupMessagesRaw = JSON.parse(groupMessagesFile);
                        const messagesRaw: GoogleChatMessageRaw[] = groupMessagesRaw.messages;
                        const messageData = await readMessageData(messagesRaw);
                        messages.push(...messageData);
                        if (groupInfo.members) {
                            for (const i of groupInfo.members) {
                                const messagesByMember = messageData.filter((message) => message.creator.name === i.name);
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
                                // localeCompare taken from https://stackoverflow.com/a/45544166
                                return a.name.localeCompare(b.name);
                            });
                        }
                    }
                    let groupName: string;
                    let groupType: `DM` | `Space`;
                    if (groupInfo.name) {
                        groupName = `Space - ${groupInfo.name}`
                    } else {
                        groupName = `DM - ${listOfMembers.map((member) => member.name).join(` / `)}`;
                    };
                    if (groupFolderLocation.includes('Space')) groupType = 'Space'
                    if (groupFolderLocation.includes('DM')) groupType = 'DM'

                    const groupData: GoogleChatGroupInfo = {
                        name: groupName,
                        id: groupInfo.id,
                        type: groupInfo.type,
                        emoji_id: groupInfo.emoji_id,
                        members: listOfMembers,
                        allMessages: messages,
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
