import { siteConfig } from '$lib/config/site';
import { fetchRss, wordCount } from '$lib/utils/rss';
import type { ServerLoad } from './$types';

export const load: ServerLoad = async ({ fetch }) => {
	try {
		const feed = await fetchRss(siteConfig.blog.rssUrl, fetch);
		let totalWords = 0;
		for (const p of feed.posts) totalWords += wordCount(p.content);
		return { totalPosts: feed.posts.length, totalWords };
	} catch {
		return { totalPosts: 0, totalWords: 0 };
	}
};
