//login handler (and future user-related commands)
import { createUser, getUser, resetUsers, getAllUsers } from '../lib/db/queries/users.js';
import { setUser, readConfig } from '../config';

export type CommandHandler = (cmdName: string, ...args: string[]) => Promise<void>;

export async function handlerLogin(cmdName: string, ...args: string[]) {
    if (args.length < 1) {
        throw new Error(`Usage: login <username>`);
    }
    
    const name = args[0];
    const user = await getUser(name);
    if (!user) {
        throw new Error(`User not found: ${name}`);
    }
    
    setUser(name);
    console.log(`Logged in as ${name}`);
}

export async function handlerRegister(cmdName: string, ...args: string[]) {
    if (args.length < 1) {
        throw new Error(`Usage: register <username>`);
    }

    const name = args[0];
    const existingUser = await getUser(name);
    if (existingUser) {
        throw new Error(`User already exists: ${name}`);
    }

    const createdUser = await createUser(name);
    setUser(name);
    console.log(`User created: ${name}`);
    console.log(createdUser);
}

export async function handlerReset(cmdName: string, ...args: string[]) {
    await resetUsers();
    console.log(`All users have been reset.`);
}

export async function handlerUsers(cmdName: string, ...args: string[]) {
    const users = await getAllUsers();
    const config = readConfig();
    console.log(`Registered users:`);
    users.forEach(user => {
        if (user.name === config.currentUserName) {
            console.log(`* ${user.name} (current)`);
        } else {
            console.log(`* ${user.name}`);
        }
    });
}