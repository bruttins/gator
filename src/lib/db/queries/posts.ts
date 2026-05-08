import { db } from "..";
import { posts, feeds, feedFollows } from "../schema";
import { eq, desc } from "drizzle-orm";

export async function createPost(
    {
        title,
        url,
        description,
        publishedAt,
        feedId
    }: {
        title: string;
        url: string;
        description: string | null;
        publishedAt: Date | null;
        feedId: string;
    }) {
    const [result] = await db.insert(posts).values({
        title,
        url,
        description,
        publishedAt,
        feedId
    }).returning();
    return result;
    }

export async function getPostsForUser(userId: string, limit: number = 2) {
    return await db.select().from(posts)
        .innerJoin(feeds, eq(posts.feedId, feeds.id))
        .innerJoin(feedFollows, eq(feeds.id, feedFollows.feedId))
        .where(eq(feedFollows.userId, userId))
        .orderBy(desc(posts.publishedAt))
        .limit(limit);
}