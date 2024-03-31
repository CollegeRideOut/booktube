import { db } from '../db';
import * as schema from '../../../../core/src/schema';
import { eq, inArray, like, sql } from 'drizzle-orm';
import { v4 } from 'uuid';

const repoName = 'bookRepo';

export const bookrepo = {
  async getSimilarBooks(genreIds: string[]) {
    return await db
      .select({
        id: schema.books.id,
        name: schema.books.name,
        author: schema.books.author,
        rating: schema.books.rating,
        thumbnailLong: schema.books.thumbnailLong,
      })
      .from(schema.generesBooks)
      .where(inArray(schema.generesBooks.genereId, genreIds))
      .innerJoin(schema.books, eq(schema.books.id, schema.generesBooks.bookId));
  },

  async updateRating(id: string, rating: number) {
    await db
      .update(schema.books)
      .set({ rating: rating })
      .where(eq(schema.books.id, id));
  },
  async getBookByIdWithGenre(id: string) {
    const books = await db
      .select()
      .from(schema.books)
      .where(eq(schema.books.id, id))
      .innerJoin(
        schema.generesBooks,
        eq(schema.books.id, schema.generesBooks.bookId),
      )
      .innerJoin(
        schema.generes,
        eq(schema.generes.id, schema.generesBooks.genereId),
      )

      .limit(1);
    return books;
  },

  async getFeaturedBook() {
    return await db
      .select({
        id: schema.books.id,
        thumbnailSquare: schema.books.thumbnailSquare,
        author: schema.books.author,
      })
      .from(schema.books)
      .limit(1);
  },

  async createBook(bookInfo: {
    id: string;
    name: string;
    author: string;
    summary: string;

    thumbnailSquare: string;
    thumbnailLong: string;
    numberOfChapters: number;
    bookDurationInSeconds: number;
    price: number;
  }) {
    try {
      await db.insert(schema.books).values({
        id: bookInfo.id,
        name: bookInfo.name,
        author: bookInfo.author,
        summary: bookInfo.summary,
        thumbnailSquare: bookInfo.thumbnailSquare,
        thumbnailLong: bookInfo.thumbnailLong,
        numberOfChapters: bookInfo.numberOfChapters,
        bookDurationInSeconds: bookInfo.bookDurationInSeconds,
        price: bookInfo.price,
      });
    } catch (error) {
      console.log(`Error ar ${repoName} - ${this.createBook.name}`, error);
    }
  },

  async fuzzySearchByName(nameSearch: string) {
    return await db
      .select()
      .from(schema.books)
      .where(like(schema.books.name, `%${nameSearch}%`));
  },
};
