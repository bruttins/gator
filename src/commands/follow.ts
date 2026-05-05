import { createFeedFollow, getFeedFollowsForUser } from "../lib/db/queries/feed-follows";
import { getFeedByUrl } from "../lib/db/queries/feeds";
import { readConfig } from "../config";
import { getUser } from "../lib/db/queries/users";

export async function handlerFollow(cmdName: string, ...args: string[]) {
    if (args.length < 1) {
        throw new Error(`Usage: follow <feedUrl>`);
    }
    const url = args[0];
    const feed = await getFeedByUrl(url);
    if (!feed) {
        throw new Error(`Feed with url ${url} not found`);
    }
 
    const cfg = readConfig();
    const currentUserName = cfg.currentUserName;
    if (!currentUserName) {
        throw new Error(`No user logged in. Please login first.`);
    }
    const currentUser = await getUser(currentUserName);
    if (!currentUser) {
        throw new Error(`User ${currentUserName} not found. Please login first.`);
    }

    const feedFollow = await createFeedFollow(feed.id, currentUser.id);
    console.log(`User ${feedFollow.userName} successfully followed feed: ${feedFollow.feedName}`);
}

export async function handlerFollowing(cmdName: string, ...args: string[]) {
    const cfg = readConfig();
    const currentUserName = cfg.currentUserName;
    if (!currentUserName) {
        throw new Error(`No user logged in. Please login first.`);
    }
    const currentUser = await getUser(currentUserName);
    if (!currentUser) {
        throw new Error(`User ${currentUserName} not found. Please login first.`);
    }

    const follows = await getFeedFollowsForUser(currentUser.name);
    console.log(`User ${currentUser.name} is following the following feeds:`);
    for (const { feedName } of follows) {
        console.log(`- ${feedName}`);
    }
}