import { XMLParser } from 'fast-xml-parser';

type RSSFeed = {
  channel: {
    title: string;
    link: string;
    description: string;
    item: RSSItem[];
  };
};

type RSSItem = {
  title: string;
  link: string;
  description: string;
  pubDate: string;
};

export async function fetchFeed(feedURL: string): Promise<RSSFeed> {
    const response = await fetch(feedURL, {
        headers: {
            'User-Agent': 'gator'},
        });
    if (!response.ok) {
        throw new Error(`Failed to fetch feed: ${response.statusText}`);
    }
    const feedText = await response.text();
    const parser = new XMLParser({
        processEntities: false
    });
    const feed = parser.parse(feedText);
    
    if (!feed.rss.channel) {
        throw new Error('Failed to parse feed: Invalid RSS format');
    }
    if (!feed.rss.channel.title || !feed.rss.channel.link || !feed.rss.channel.description) {
        throw new Error('Failed to parse feed: Missing title, link or description');
    }

    if (!feed.rss.channel.item) {
        feed.rss.channel.item = [];
    }
    
    const items: any[] = [];
    if (Array.isArray(feed.rss.channel.item)) {
        items.push(...feed.rss.channel.item);
    } else {
        items.push(feed.rss.channel.item);
    }

    const RSSItems: RSSItem[] = [];
    for (const item of items) {
        let rssItem: RSSItem = {} as RSSItem;
        if (!item.title || !item.link || !item.description || !item.pubDate) {
            continue;
        } else rssItem = {
            title: item.title,
            link: item.link,
            description: item.description,
            pubDate: item.pubDate
        }
        RSSItems.push(rssItem);
    }
    
    const channel = {
        title: feed.rss.channel.title,
        link: feed.rss.channel.link,
        description: feed.rss.channel.description,
        item: RSSItems
    };

    return { channel };
}