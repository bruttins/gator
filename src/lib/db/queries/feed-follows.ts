import { db } from "..";
import { feedFollows, FeedFollow, feeds, users } from "../schema";
import { eq, and } from "drizzle-orm";

export async function createFeedFollow(feedId: string, userId: string) {
  const [newFeedFollow] = await db.insert(feedFollows).values({ feedId, userId }).returning();
  
  const result = await db.select({
    userName: users.name,
    feedName: feeds.name
  }).from(feedFollows)
    .innerJoin(users, eq(feedFollows.userId, users.id))
    .innerJoin(feeds, eq(feedFollows.feedId, feeds.id))
    .where(eq(feedFollows.id, newFeedFollow.id))
  const [{ userName, feedName }] = result;
    return { ...newFeedFollow, userName, feedName };
}

export async function getFeedFollowsForUser(userName: string) {
  const result = await db.select({
    feedName: feeds.name,
    userName: users.name
  }).from(feedFollows)
    .innerJoin(users, eq(feedFollows.userId, users.id))
    .innerJoin(feeds, eq(feedFollows.feedId, feeds.id))
    .where(eq(users.name, userName));
  return result;
}

export async function deleteFeedFollow(feedId: string, userId: string) {
  await db.delete(feedFollows).where(
    and(
      eq(feedFollows.feedId, feedId),
      eq(feedFollows.userId, userId)
    ),
  ).returning();
}