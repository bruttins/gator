import { User } from '../lib/db/schema';
import { getPostsForUser } from '../lib/db/queries/posts';

export async function handlerBrowse(cmdName: string, user: User, ...args: string[]) {
    const limit = args.length > 0 ? parseInt(args[0], 10) : 2;
    if (args.length > 1 || Number.isNaN(limit) || limit <= 0) {
        throw new Error(`Usage: browse [limit]`);
    }

    const posts = await getPostsForUser(user.id, limit);
    if (posts.length === 0) {
        console.log(`No posts found for user ${user.name}`);
        return;
    }

    console.log(`Latest ${posts.length} post(s) for ${user.name}:`);
    for (const post of posts) {
        console.log(`- ${post.posts.title} (${post.posts.url})`);
    }
}