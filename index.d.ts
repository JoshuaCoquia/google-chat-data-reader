/** The shape of a configuration file for this project. Generally found in /input/config.yml */
interface ConfigFile {
    folderLocation: string;
}

/** Google Chat Data represented as JSON. */
interface GoogleChatData {
    /** Each Group in this array is represented as its own object. */
    groups: GoogleChatGroupData[];
}

/** The data of an individual group in Google Chat. */
interface GoogleChatGroupData {
    type: `DM` | `Space`;
    name: string;
    messages: GoogleChatMessage;
}

/** A single chat message represented as JSON. */
interface GoogleChatMessage {
    creator: GoogleChatUser;
    /** The created date is represented as a string in the actual data, but the code should convert this into a Date object. */
    createdDate: Date;
    text: string;
    topicId: string;
}

/** A single user in a group represented as JSON. */
interface GoogleChatUserInGroup {
    name: string;
    email: string;
    userType: "Human" | "Bot";
    messages: GoogleChatMessage[];
}

/** A single user represented as JSON. Appears in group_info.json and messages.json. */
interface GoogleChatUser {
    name: string;
    email: string;
    userType: "Human" | "Bot";
}

interface GoogleGroupMessagesFile {
    messages: GoogleChatMessage[]
}