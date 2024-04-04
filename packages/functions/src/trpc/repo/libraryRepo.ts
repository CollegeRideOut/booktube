import { db } from '../db';
import * as schema from '../../../../core/src/schema';
import { and, avg, eq, isNotNull, like, ne, not, sql, sum } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { v4 } from 'uuid';

const repoName = 'libraryRepo';

export const libraryRepo = {
  async getUserReviews(bookId: string) {
    return await db
      .select({
        id: schema.library.id,
        rating: schema.library.rating,
        ratingTitle: schema.library.ratingTitle,
        ratingDescription: schema.library.ratingDescription,
      })
      .from(schema.library)
      .where(
        and(
          eq(schema.library.bookId, bookId),
          isNotNull(schema.library.ratingTitle),
        ),
      );
  },

  async userLibraryByBook(userId: string, bookId: string) {
    const library = await db
      .select()
      .from(schema.library)
      .where(sql`userId = ${userId} AND bookId = ${bookId}`);

    return library;
  },

  async getLibraryInfo(libraryid: string) {
    return await db
      .select()
      .from(schema.library)
      .where(eq(schema.library.id, libraryid))
      .limit(1);
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

  async searchLibrary(searchTerm: string, userId: string) {
    return await db
      .select({
        book: {
          id: schema.books.id,
          name: schema.books.name,
          thumbnailLong: schema.books.thumbnailLong,
          author: schema.books.author,
          rating: schema.books.rating,
          favourite: schema.books.favourite,
        },
        id: schema.library.id,
      })
      .from(schema.library)
      .where(eq(schema.library.userId, userId))
      .innerJoin(schema.books, and(eq(schema.books.id, schema.library.bookId), like(schema.books.name, `%${searchTerm}%`)))
  },

  async getUserLibrary(userId: string) {
    return await db
      .select({
        book: {
          id: schema.books.id,
          name: schema.books.name,
          thumbnailLong: schema.books.thumbnailLong,
          author: schema.books.author,
          rating: schema.books.rating,
          favourite: schema.books.favourite,
        },
        id: schema.library.id,
      })

      .from(schema.library)
      .where(eq(schema.library.userId, userId))
      .innerJoin(schema.books, eq(schema.library.bookId, schema.books.id));
  },

  async getUserLibraryOrderHistory(userId: string) {
    return await db
      .select({
        book: {
          id: schema.books.id,
          name: schema.books.name,
          thumbnailLong: schema.books.thumbnailLong,
          price: schema.books.price,
        },
        id: schema.library.id,
        createdAt: schema.library.createdAt,
      })

      .from(schema.library)
      .where(eq(schema.library.userId, userId))
      .innerJoin(schema.books, eq(schema.library.bookId, schema.books.id));
  },

  async updateLibrary(info: {
    id: string;
    favourite: boolean;
    lastChapterProgessId: string;
  }) {
    await db
      .update(schema.library)
      .set({
        favourite: info.favourite,
        lastChapterProgessId: info.lastChapterProgessId,
      })
      .where(eq(schema.library.id, info.id));
  },

  async updateReview(info: {
    id: string;
    title: string;
    rating: number;
    description: string;
  }) {
    await db
      .update(schema.library)
      .set({
        ratingTitle: info.title,
        rating: info.rating,
        ratingDescription: info.description,
      })
      .where(eq(schema.library.id, info.id));
  },

  async avgReviews(bookId: string) {
    return await db
      .select({ value: avg(schema.library.rating) })
      .from(schema.library)
      .where(
        and(
          isNotNull(schema.library.rating),
          eq(schema.library.bookId, bookId),
        ),
      )
      .groupBy(schema.library.id);
  },
};
