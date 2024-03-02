import { db } from '../db';
import * as schema from '../../../../core/src/schema';
import { sql } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { v4 } from 'uuid';

const repoName = 'subsRepo';

export const subsRepo = {
  async createNewSub(
    id: string,
    audioBookId: string,
    language: 'ENGLISH' | 'SPANISH',
  ) {
    await db.insert(schema.audiobookSubs).values({
      id: id,
      audiobookId: audioBookId,
      language: language,
    });
  },
};
