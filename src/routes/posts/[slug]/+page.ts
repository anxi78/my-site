import { siteConfig } from '$lib/config/site';
import { fetchRss, wordCount } from '$lib/utils/rss';
import { error } from '@sveltejs/kit';
import type { EntryGenerator, PageLoad } from './$types';

// 构建时从 RSS 拉一次，生成所有 slug，让 prerender 能静态产出每个文章页
export const entries: EntryGenerator = async () => {
	try {
		const res = await fetch(siteConfig.blog.rssUrl);
		if (!res.ok) return [];
		const xml = await res.text();
		const { parseRss } = await import('$lib/utils/rss');
		const feed = parseRss(xml);
		return feed.posts.map((p) => ({ slug: p.slug }));
	} catch {
		return [];
	}
};

export const load: PageLoad = async ({ params, fetch }) => {
	let feed;
	try {
		feed = await fetchRss(siteConfig.blog.rssUrl, fetch);
	} catch (e) {
		throw error(502, `RSS 拉取失败：${e instanceof Error ? e.message : String(e)}`);
	}

	const post = feed.posts.find((p) => p.slug === params.slug);
	if (!post) {
		throw error(404, '文章不存在');
	}

	return {
		post,
		wordCount: wordCount(post.content),
		siteName: feed.title
	};
};
