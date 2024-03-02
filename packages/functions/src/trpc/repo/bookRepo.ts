import { db } from '../db';
import * as schema from '../../../../core/src/schema';
import { eq, like, sql } from 'drizzle-orm';

const repoName = 'bookRepo';

export const bookrepo = {
  async getBooks() {
    try {
      const books = await db
        .select({
          id: schema.books.id,
          name: schema.books.name,
          author: schema.books.author,
          thumbnail: schema.books.thumbnail,
        })
        .from(schema.books);

      return books;
    } catch (error) {
      console.log(`Error at ${repoName} - ${this.getBooks.name}`, error);
      throw error;
    }
  },

  async getBooksWithAudios() {
    return await db
      .select()
      .from(schema.books)
      .innerJoin(
        schema.audiobooks,
        eq(schema.books.id, schema.audiobooks.bookId),
      );
  },

  async getBookById(id: string) {
    const books = await db
      .select()
      .from(schema.books)
      .where(sql`id = ${id}`);
    return books;
  },

  async createBook(bookInfo: {
    id: string;
    name: string;
    author: string;
    content: string;
    thumbnail: string;
    price: number;
  }) {
    try {
      await db.insert(schema.books).values({
        id: bookInfo.id,
        name: bookInfo.name,
        author: bookInfo.author,
        content: bookInfo.content,
        thumbnail: bookInfo.thumbnail,
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
