import { db } from '../db';
import * as schema from '../../../../core/src/schema';
import { sql } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { v4 } from 'uuid';

const repoName = 'videoRepo';

export const videoRepo = {
  async createVideo(id: string, tagIds: string[]) {
    try {
      const tagInsertValues = tagIds.map((t) => {
        return { id: v4(), videoId: id, tagId: t };
      });
      await db.insert(schema.videos).values({ id: id, path: `${id}.m3u8` });
      await db.insert(schema.videoTags).values(tagInsertValues);
    } catch (error) {
      console.log(`Error in ${repoName} - ${this.createVideo.name}`, error);

      throw error;
    }
  },

  async randomVideos(cursor: number) {
    const videos = await db
      .select()
      .from(schema.videos)
      .orderBy(sql`RAND()`)
      .limit(cursor);
    return videos;
  },

  async getAllVideos() {
    try {
      const videos = await db.select().from(schema.videos);
      return videos;
    } catch (error) {
      console.log(`Error in ${repoName} - ${this.getAllVideos.name}`, error);

      throw error;
    }
  },

  async getVideoById(id: string) {
    try {
      const videos = await db
        .select()
        .from(schema.videos)
        .where(sql`id = ${id}`);

      return videos;
    } catch (error) {
      console.log(`Error in ${repoName} - ${this.getVideoById.name}`, error);
      throw error;
    }
  },
};
