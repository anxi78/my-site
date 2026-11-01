const friendModules = import.meta.glob('/src/data/friends/*.json', { eager: true, import: 'default' });
const sponsorModules = import.meta.glob('/src/data/sponsors/*.json', { eager: true, import: 'default' });

const friends = Object.values(friendModules) as {
  name: string;
  avatar: string | null;
  description?: string;
  url: string;
  backlink?: string;
  vip?: boolean;
}[];

const sponsors = Object.values(sponsorModules) as {
  name: string;
  avatar: string | null;
  date: string;
  amount: string;
}[];

export const staticData = { friends, sponsors };
