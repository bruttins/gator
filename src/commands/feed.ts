import { fetchFeed } from '../lib/rss';
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

export async function handlerAddFeed(cmdName: string, user: User, ...args: string[]) {
    if (args.length < 2) {
        throw new Error(`Usage: addfeed <name> <url>`);
    }
    const name = args[0];
    const url = args[1];
    const feed = await createFeed(name, url, user.id);
    await createFeedFollow(feed.id, user.id);
    printFeed(feed, user);
    console.log(`User ${user.name} is now following feed: ${feed.name}`);
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