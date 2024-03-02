import { db } from '../db';
import * as schema from '../../../../core/src/schema';
import { eq, sql } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { v4 } from 'uuid';
import { Bucket } from 'sst/node/bucket';

const repoName = 'audiobooksRepo';

export const audiobookRepo = {
  async createAudiobook(audiobookInfo: {
    id: string;
    author: string;
    audio: string;
    bookId: string;
    language: 'ENGLISH' | 'SPANISH';
  }) {
    try {
      await db.insert(schema.audiobooks).values({
        id: audiobookInfo.id,
        author: audiobookInfo.author,
        bookId: audiobookInfo.bookId,
        audio: audiobookInfo.audio,
        language: audiobookInfo.language,
      });
    } catch (error) {
      console.log(`Error in ${repoName} - ${this.createAudiobook.name}`, error);
      throw error;
    }
  },

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
