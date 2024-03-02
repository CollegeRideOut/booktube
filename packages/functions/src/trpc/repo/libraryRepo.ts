import { db } from '../db';
import * as schema from '../../../../core/src/schema';
import { and, eq, sql } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { v4 } from 'uuid';

const repoName = 'libraryRepo';

export const libraryRepo = {
  async userLibraryByBook(userId: string, bookId: string) {
    const library = await db
      .select()
      .from(schema.library)
      .where(sql`userId = ${userId} AND bookId = ${bookId}`);

    return library;
  },

  async checkIfUserOwnsBook(userId: string, bookId: string) {
    return await db
      .select()
      .from(schema.library)
      .where(
        and(
          eq(schema.library.userId, userId),
          eq(schema.library.bookId, bookId),
        ),
      );
  },

  async getUserLibrary(userId: string) {
    return await db
      .select({
        book: {
          id: schema.books.id,
          name: schema.books.name,
          thumbnail: schema.books.thumbnail,
          author: schema.books.author,
          price: schema.books.price,
        },
      })

      .from(schema.library)
      .where(eq(schema.library.userId, userId))
      .innerJoin(schema.books, eq(schema.library.bookId, schema.books.id));
  },
};
