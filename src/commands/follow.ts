import { createFeedFollow, getFeedFollowsForUser } from "../lib/db/queries/feed-follows";
import { getFeedByUrl } from "../lib/db/queries/feeds";
import { User } from "src/lib/db/schema";

export async function handlerFollow(cmdName: string, user: User, ...args: string[]) {
    if (args.length < 1) {
        throw new Error(`Usage: follow <feedUrl>`);
    }
    const url = args[0];
    const feed = await getFeedByUrl(url);
    if (!feed) {
        throw new Error(`Feed with url ${url} not found`);
    }

    const feedFollow = await createFeedFollow(feed.id, user.id);
    console.log(`User ${feedFollow.userName} successfully followed feed: ${feedFollow.feedName}`);
}

export async function handlerFollowing(cmdName: string, user: User, ...args: string[]) {
    const follows = await getFeedFollowsForUser(user.name);
    console.log(`User ${user.name} is following the following feeds:`);
    for (const { feedName } of follows) {
        console.log(`- ${feedName}`);
    }
}