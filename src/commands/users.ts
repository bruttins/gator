//login handler (and future user-related commands)
import { setUser } from '../config';

export type CommandHandler = (cmdName: string, ...args: string[]) => void;

export function handlerLogin(cmdName: string, ...args: string[]) {
    if (args.length < 1) {
        throw new Error(`Usage: login <username>`);
    }
    setUser(args[0]);
    console.log(`Logged in as ${args[0]}`);
}