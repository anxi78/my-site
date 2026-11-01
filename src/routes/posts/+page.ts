import { siteConfig } from '$lib/config/site';
import { fetchRss, wordCount, type RssPost } from '$lib/utils/rss';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	let posts: RssPost[] = [];
	let error = '';

	try {
		const feed = await fetchRss(siteConfig.blog.rssUrl, fetch);
		posts = feed.posts;
	} catch (e) {
		error = e instanceof Error ? e.message : String(e);
	}

	// 字数统计
	let totalWords = 0;
	const wordCountMap: Record<string, number> = {};
	for (const p of posts) {
		const wc = wordCount(p.content);
		wordCountMap[p.slug] = wc;
		totalWords += wc;
	}

	return {
		posts,
		totalPosts: posts.length,
		totalWords,
		wordCountMap,
		error
	};
};
