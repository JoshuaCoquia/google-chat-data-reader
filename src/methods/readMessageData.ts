import { getDateFromChatString } from "./getDateFromGoogleChatString.js";

export async function readMessageData(rawMessages: GoogleChatMessageRaw[]): Promise<GoogleChatMessage[]> {
    return new Promise<GoogleChatMessage[]>(async (resolvePromise, rejectPromise) => {
        try {
            const messagePromises = rawMessages.map(async (rawMessage): Promise<GoogleChatMessage> => {
                return new Promise(async (resolveMessagePromise, rejectMessagePromise) => {
                    try {
                        const message: GoogleChatMessage = {
                            ...rawMessage,
                            createdDate: rawMessage.created_date
                                ? await getDateFromChatString(rawMessage.created_date)
                                : undefined,
                            updatedDate: rawMessage.updated_date
                                ? await getDateFromChatString(rawMessage.updated_date)
                                : undefined,
                        };
                        resolveMessagePromise(message);
                    } catch (error) {
                        rejectMessagePromise(error);
                    }
                });
            });
            const messages: GoogleChatMessage[] = await Promise.all(messagePromises);
            resolvePromise(messages);
        } catch (error) {
            rejectPromise(error);
        }
    });
}