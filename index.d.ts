/** The shape of a configuration file for this project. Generally found in /input/config.yml */
interface ConfigFile {
    folderLocation: string;
}

/** Google Chat Data represented as JSON. */
interface GoogleChatData {
    /** Each Group in this array is represented as its own object. */
    groups: GoogleChatGroupInfo[];
}

/** The data of a single group in Google Chat. */
interface GoogleChatGroupInfo {
    name?: string;
    type: `DM` | `Space`;
    emoji_id: string;
    members: GoogleChatUser[];
}

/** A single chat message represented as JSON. */
interface GoogleChatMessageRaw {
    creator: GoogleChatUser;
    /** A message has this property in either here or in an index in previous_message_versions
     * @see previous_message_versions
     */
    created_date?: string;
    updated_date?: string;
    attached_files?: attachedFile[];
    text?: string;
    topicId?: string;
    previous_message_versions?: GoogleChatMessageRaw;
}

/** A single chat message represented as JSON. */
interface GoogleChatMessage {
    creator: GoogleChatUser;
    /** Leftover from GoogleChatMessageRaw
     * @see GoogleChatMessageRaw.created_date
     */
    created_date?: string;
    /** Leftover from GoogleChatMessageRaw
     * @see GoogleChatMessageRaw.created_date
     */
    updated_date?: string;
    /** The created date should be converted to a date from a string. */
    createdDate?: Date | string;
    /** The updated date should be converted to a date. */
    updatedDate?: Date | string;
    text?: string;
    attached_files?: attachedFile[];
    previous_message_versions?: GoogleChatMessageRaw;
    topicId?: string;
}

/** A single user in a group represented as JSON. */
interface GoogleChatUserInGroup {
    name: string;
    email: string;
    userType: 'Human' | 'Bot';
    messages: GoogleChatMessage[];
}

/** A single user represented as JSON. Appears in group_info.json and messages.json. */
interface GoogleChatUser {
    name: string;
    email: string;
    userType: 'Human' | 'Bot';
}

interface GoogleGroupMessagesFile {
    messages: GoogleChatMessage[];
}

interface attachedFile {
    original_name: string;
    export_name: string;
}

interface previous_message_version {
    created_date?: string;
    attached_files?: attachedFile[];
    text?: string;
}