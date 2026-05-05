import { CommandHandler } from './commands';
import { fetchFeed } from '../lib/rss';
import { readConfig } from '../config';
import { getUser } from '../lib/db/queries/users';
import { createFeed, getFeeds } from '../lib/db/queries/feeds';
import { Feed, User } from '../lib/db/schema';
import { createFeedFollow } from '../lib/db/queries/feed-follows';


export async function handlerAgg(cmdName: string, ...args: string[]) {
    try {
        const feed = await fetchFeed('https://www.wagslane.dev/index.xml');
        console.log(JSON.stringify(feed, null, 2));
        }
    catch (error) {
        console.error(`Error fetching feed: ${(error as Error).message}`);
    }
}

export async function handlerAddFeed(cmdName: string, ...args: string[]) {
    if (args.length < 2) {
        throw new Error(`Usage: addfeed <name> <url>`);
    }
    const name = args[0];
    const url = args[1];
    const cfg = readConfig();
    const currentUserName = cfg.currentUserName;
    if (!currentUserName) {
        throw new Error(`No user logged in. Please login first.`);
    }
    const currentUser = await getUser(currentUserName);
    if (!currentUser) {
        throw new Error(`User ${currentUserName} not found. Please login first.`);
    }
    const feed = await createFeed(name, url, currentUser.id);
    const follow = await createFeedFollow(feed.id, currentUser.id);
    await printFeed(feed, currentUser);
    console.log(`User ${currentUser.name} is now following feed: ${feed.name}`);
}

function printFeed(feed: Feed, user: User) {
    console.log(`Feed added successfully!`);
    console.log(`Name: ${feed.name}`);
    console.log(`URL: ${feed.url}`);
    console.log(`Added by: ${user.name}`);
}

export async function handlerFeeds(cmdName: string, ...args: string[]) {
    const allFeeds = await getFeeds();
    for (const feed of allFeeds) {
        console.log(`Name: ${feed.name}`);
        console.log(`URL: ${feed.url}`);
        console.log(`Created by: ${feed.userName}`);
    }
}