import { db } from '../db';
import * as schema from '../../../../core/src/schema';
import { eq, sql } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { v4 } from 'uuid';

const repoName = 'bookRepo';

export const genreRepo = {
  async getSimilarBooks(id: string) {
    /* const a = await db.select().from(schema.genres). */
  },

  async getGLoLoBo() {
    return await db
      .select({
        generes: {
          id: schema.generes.id,
          name: schema.generes.name,
        },
        books: {
          id: schema.books.id,
          name: schema.books.name,
          author: schema.books.author,
          thumbnailLong: schema.books.thumbnailLong,
          rating: schema.books.rating,
        },
      })
      .from(schema.generes)
      .innerJoin(
        schema.generesBooks,
        eq(schema.generes.id, schema.generesBooks.genereId),
      )
      .innerJoin(schema.books, eq(schema.generesBooks.bookId, schema.books.id));
  },

  async getGenres() {
    return db.select().from(schema.generes);
  },

  async getBooksUnderGenre(id: string) {
    return await db
      .select({
        id: schema.books.id,
        name: schema.books.name,
        author: schema.books.author,
        price: schema.books.price,
        thumbnailLong: schema.books.thumbnailLong,
        rating: schema.books.rating,
      })
      .from(schema.generesBooks)
      .where(eq(schema.generesBooks.genereId, id))
      .innerJoin(schema.books, eq(schema.books.id, schema.generesBooks.bookId));
  },

  async addGenresToBook(bookId: string, genreIds: string[]) {
    const insertValues = genreIds.map((g) => {
      return { id: v4(), bookId: bookId, genereId: g };
    });
    await db.insert(schema.generesBooks).values(insertValues);
  },

  async getGenreInfo(id: string) {
    return await db
      .select()
      .from(schema.generes)
      .where(eq(schema.generes.id, id));
  },
};
