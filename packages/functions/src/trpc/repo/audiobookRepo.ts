import { db } from '../db';
import * as schema from '../../../../core/src/schema';
import { eq, sql } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { v4 } from 'uuid';
import { Bucket } from 'sst/node/bucket';

const repoName = 'audiobooksRepo';

export const audiobookRepo = {
  // new shit
  async createAudiobooks(
    audiobookInfo: {
      id: string;
      author: string;
      chapterId: string;
      language: 'ENGLISH' | 'SPANISH';
    }[],
  ) {
    try {
      await db.insert(schema.audiobooks).values(audiobookInfo);
    } catch (error) {
      console.log(
        `Error in ${repoName} - ${this.createAudiobooks.name}`,
        error,
      );
      throw error;
    }
  },

  async getChapterAudiobooksWithSubs(chapterId: string) {
    return db
      .select()
      .from(schema.audiobooks)
      .where(eq(schema.audiobooks.chapterId, chapterId))
      .innerJoin(
        schema.audiobookSubs,
        eq(schema.audiobookSubs.audiobookId, schema.audiobooks.id),
      );
  },

  //old shit

  async getAudiobooksByBookWithSubs(bookId: string) {
    try {
      const audiobooks = await db
        .select()
        .from(schema.audiobooks)
        .where(sql`bookId = ${bookId}`)
        .innerJoin(
          schema.audiobookSubs,
          eq(schema.audiobooks.id, schema.audiobookSubs.audiobookId),
        );

      return audiobooks;
    } catch (error) {
      console.log(
        `Error in ${repoName} - ${this.getAudiobooksByBookWithSubs.name}`,
        error,
      );

      throw error;
    }
  },

  async getAudiobookById(id: string) {
    try {
      const abs = db
        .select()
        .from(schema.audiobooks)
        .where(sql`id = ${id}`);
      return abs;
    } catch (error) {
      console.log(`Error in ${repoName} - ${this.getAudiobookById.name}`);

      throw error;
    }
  },
};
