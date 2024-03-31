import { db } from '../db';
import * as schema from '../../../../core/src/schema';
import { and, eq, like, sql } from 'drizzle-orm';
import { v4 } from 'uuid';

const repoName = 'chapterRepo';

export const chapterRepo = {
  async createChapters(
    info: {
      id: string;
      bookId: string;
      name: string;
      number: number;
    }[],
  ) {
    await db.insert(schema.chapters).values(info);
  },

  async getChapters(bookId: string) {
    return db
      .select()
      .from(schema.chapters)
      .where(eq(schema.chapters.bookId, bookId));
  },

  async updateChapter(
    info: {
      lastSecondListend: number;
      subsId: string | null;
      audiobookId: string | null;
    },
    id: string,
  ) {
    await db
      .update(schema.chapterProgress)
      .set(info)
      .where(eq(schema.chapterProgress.id, id));
  },

  async getChapterByIdWithAudioAndSubs(id: string) {
    return await db
      .select()
      .from(schema.chapters)
      .where(eq(schema.chapters.id, id));
  },
};
