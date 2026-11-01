export const siteConfig = {
	name: 'my-site',
	siteName: 'Anxi',
	title: 'Anxi的个人站',
	subtitle: 'Anxi',
	url: 'https://anxi888.com',
	icon: 'https://assets.anxi888.com/Anxi.png',
	description: 'Anxi的个人站 —— 技术分享、随笔与一些有趣的东西。',
	keywords: ['Anxi', 'anxi888', '博客', 'blog', '个人站'],
	lang: 'zh_CN',
	ogImage: '/files/img/official.png',
	author: {
		name: 'Anxi',
		url: 'https://anxi888.com'
	},
	bio: {
		avatar: 'https://assets.anxi888.com/Anxi.png',
		name: 'Anxi',
		bio: 'Protect What You Love.',
		links: [
			{
				name: 'GitHub',
				icon: 'mdi:github',
				url: 'https://github.com/anxi78',
				color: ''
			},
			{
				name: 'B站主页',
				icon: 'simple-icons:bilibili',
				url: 'https://space.bilibili.com/',
				color: '#fb7299'
			}
		]
	},
	live: {
		statusApi: '',
		roomUrl: ''
	},
	services: {
		aiDraw: '',
		gallery: '',
		fileExplorer: '',
		nat: '',
		statsShare: '',
		longDomain: '',
		pageViews: ''
	},
	analytics: {
		umami: null,
		cfWebAnalytics: null,
		cfUmami: null,
		baidu: null,
		google: null,
		clarity: null
	},
	giscus: {
		repo: 'anxi78/Giscus',
		repoId: 'R_kgDOVW4EXA',
		category: 'Announcements',
		categoryId: 'DIC_kwDOVW4EXM4DJlbu'
	},
	repos: {
		frontend: 'https://github.com/anxi78/my-site',
		backend: '',
		natTool: ''
	},
	forum: {
		totpIssuer: ''
	},
	blog: {
		// 博客内容从 RSS 拉取，不读本地 markdown
		rssUrl: 'https://blog.anxi888.com/rss.xml',
		// 博客站点首页（"查看全部" 按钮用）
		siteUrl: 'https://blog.anxi888.com'
	},
	links: {
		github: 'https://github.com/anxi78/my-site'
	},
	navLinks: [
		{ label: '博客', icon: 'mdi:post-outline', href: '/posts' },
		{ label: '零宽短链', icon: 'mynaui:zero-circle-solid', href: '/short' },
		{ label: '封面制作', icon: 'mdi:image-edit', href: '/cover' },
		{ label: '友链', icon: 'mdi:link-variant', href: '/friends' },
	] as const
};

export type SiteConfig = typeof siteConfig;
