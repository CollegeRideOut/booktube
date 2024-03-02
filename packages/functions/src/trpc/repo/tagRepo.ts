import { db } from '../db';
import * as schema from '../../../../core/src/schema';
import { sql } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { v4 } from 'uuid';

const repoName = 'tagRepo';

export const tagRepo = {
  async getTags() {
    return await db.select().from(schema.tags);
  },
};
