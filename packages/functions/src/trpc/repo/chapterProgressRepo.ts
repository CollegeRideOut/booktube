import { db } from '../db';
import * as schema from '../../../../core/src/schema';
import { and, eq, like, sql } from 'drizzle-orm';
import { v4 } from 'uuid';

const repoName = 'chapterProgressRepo';

export const chapterProgressRepo = {
  async getById(id: string) {
    return await db
      .select()
      .from(schema.chapterProgress)
      .where(eq(schema.chapterProgress.id, id))
      .limit(1);
  },

  async getChapterProgressForLibrary(librayId: string) {
    return await db
      .select()
      .from(schema.chapterProgress)
      .where(eq(schema.chapterProgress.librayId, librayId));
  },

  async createFirstChapterProgress(
    id: string,
    librayId: string,
    chapterId: string,
  ) {
    await db
      .insert(schema.chapterProgress)
      .values({ id: id, librayId: librayId, chapterId: chapterId });
  },

  async updateLastSecond(info: { id: string; lastSecondListend: number }) {
    await db
      .update(schema.chapterProgress)
      .set({ lastSecondListend: info.lastSecondListend })
      .where(eq(schema.chapterProgress.id, info.id));
  },
};
