import { fetchFeed } from '../lib/rss';
import { createFeed, getFeeds, getNextFeedToFetch, markFeedFetched } from '../lib/db/queries/feeds';
import { Feed, User } from '../lib/db/schema';
import { createFeedFollow } from '../lib/db/queries/feed-follows';


export async function handlerAgg(cmdName: string, ...args: string[]) {
    if (args.length !== 1) {
        throw new Error(`Usage: agg <time_between_reqs>`);
    }
    const timeBetweenRequests = parseDuration(args[0]);
    console.log(`Fetching feeds every ${args[0]}`);
    scrapeFeeds().catch((err) => {
        console.error(err);
    });

    const interval = setInterval(() => {
        scrapeFeeds().catch((err) => {
            console.error(err);
        });
    }, timeBetweenRequests);
    await new Promise<void>((resolve) => {
        process.on("SIGINT", () => {
            console.log("Shutting down feed aggregator...");
            clearInterval(interval);
            resolve();
        });
    });
}

function parseDuration(durationStr: string): number {
    const regex = /^(\d+)(ms|s|m|h)$/;
    const match = durationStr.match(regex);
    if (!match) {
        throw new Error(`Invalid duration format: ${durationStr}`);
    }
    const value = parseInt(match[1], 10);
    const unit = match[2];
    switch (unit) {
        case 'ms':
            return value;
        case 's':
            return value * 1000;
        case 'm':
            return value * 60 * 1000;
        case 'h':
            return value * 60 * 60 * 1000;
        default:
            throw new Error(`Unsupported duration unit: ${unit}`);
    }
}

async function scrapeFeeds() {
    const feedToFetch = await getNextFeedToFetch();
    if (!feedToFetch) {
        console.log('No feeds to fetch');
        return;
    }
    await markFeedFetched(feedToFetch.id);
    const feedData = await fetchFeed(feedToFetch.url);
    console.log(`Fetched feed: ${feedToFetch.name} (${feedToFetch.url})`);
    for (const item of feedData.channel.item) {
        console.log(item.title);
    };
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