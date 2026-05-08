import { UserCommandHandler, CommandHandler } from "src/commands/commands";
import { readConfig } from "./config";
import { getUser } from "./lib/db/queries/users";

export function loggedInMiddleware(handler: UserCommandHandler): CommandHandler {
    return async (cmdName: string, ...args: string[]) => {
    const cfg = readConfig();
    const currentUserName = cfg.currentUserName;
        if (!currentUserName) {
            throw new Error(`No user logged in. Please login first.`);
        }
    const currentUser = await getUser(currentUserName);
        if (!currentUser) {
            throw new Error(`User ${currentUserName} not found. Please login first.`);
        }
    await handler(cmdName, currentUser, ...args);
    }
};