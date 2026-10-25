import fs from 'fs';
import path from 'path';
import type { MetadataRoute } from 'next';
import { Player } from '@/types/player';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://footpedia-weld.vercel.app';
  const currentDate = new Date();

  const filePath = path.join(process.cwd(), 'public', 'data', 'players.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const players: Player[] = JSON.parse(fileContents);

  const playerEntries: MetadataRoute.Sitemap = players.map((player) => ({
    url: `${baseUrl}/players/${player.qid}`,
    lastModified: currentDate,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/board`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    ...playerEntries,
  ];
}
