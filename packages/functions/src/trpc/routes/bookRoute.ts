import { router, clientProcedure, adminProcedure } from '../init';
import { z } from 'zod';
import { v4 } from 'uuid';
import { bookrepo } from '../repo/bookRepo';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { Bucket } from 'sst/node/bucket';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { TRPCError } from '@trpc/server';
import { libraryRepo } from '../repo/libraryRepo';
import { audiobookRepo } from '../repo/audiobookRepo';
import { Config } from 'sst/node/config';
import Stripe from 'stripe';
import { library } from '@booktube/core/schema';
import { KeyObject } from 'crypto';
import { genreRepo } from '../repo/genreRepo';

const stripe = new Stripe(Config.STRIPE_SECRET);

const routerName = 'clientRoutes';

export const bookRouter = router({
  //client based routes

  saveBook: adminProcedure
    .input(
      z.object({
        name: z.string(),
        author: z.string(),
        genre: z.array(z.string()),
        price: z.number(),
      }),
    )
    .mutation(async (opts) => {
      try {
        const bookInfo = opts.input;
        const idToUse = v4();
        const pathToContent = `${idToUse}_Content`;
        const pathToThumbnail = `${idToUse}_Thumbnail`;

        await bookrepo.createBook({
          id: idToUse,
          author: bookInfo.author,
          name: bookInfo.name,
          content: pathToContent,
          thumbnail: pathToThumbnail,
          price: bookInfo.price,
        });

        await genreRepo.addGenresToBook(idToUse, bookInfo.genre);

        const putContent = new PutObjectCommand({
          Key: pathToContent,
          ACL: 'public-read',
          Bucket: Bucket.bookBucket.bucketName,
        });

        const putThumbnail = new PutObjectCommand({
          Key: pathToThumbnail,
          ACL: 'public-read',
          Bucket: Bucket.bookBucket.bucketName,
        });

        const urlConent = await getSignedUrl(new S3Client({}), putContent);
        const urlThumbnail = await getSignedUrl(new S3Client({}), putThumbnail);

        return {
          id: idToUse,
          contentUrl: urlConent,
          thumbnailUrl: urlThumbnail,
        };
      } catch (error) {
        console.log(error);
        throw error;
      }
    }),

  getLoLoBo: clientProcedure.query(async (opts) => {
    try {
      const booksT = await bookrepo.getBooks();
      const books = booksT.map((book) => {
        book.thumbnail = `https://${Bucket.bookBucket.bucketName}.s3.amazonaws.com/${book.thumbnail}`;
        return book;
      });
      return [{ genre: 'test', books }];
    } catch (error) {
      console.log(error);
      throw error;
    }
  }),

  getLoBo: clientProcedure.query(async () => {
    try {
      return await bookrepo.getBooks();
    } catch (error) {
      console.log(`Error in bookroute getLobo ${error}`);
      throw error;
    }
  }),

  getBook: clientProcedure.input(z.string()).query(async (opts) => {
    try {
      const id = opts.input;
      const books = await bookrepo.getBookById(id);
      if (books.length === 0) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `book with id ${id} not found `,
        });
      }

      const book = books[0];
      if (book.id !== id) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `book with id ${id} not found `,
        });
      }
      return book;
    } catch (error) {
      console.log(`Error in ${routerName} - getBook -> ${error}`);
      throw error;
    }
  }),

  getBookInfo: clientProcedure.input(z.string()).query(async (opts) => {
    try {
      const id = opts.input;
      const books = await bookrepo.getBookById(id);
      if (books.length === 0) {
        throw new Error('books length === 0');
      }

      const book = books[0];
      book.thumbnail = `https://${Bucket.bookBucket.bucketName}.s3.amazonaws.com/${book.thumbnail}`;

      const libBooks = await libraryRepo.checkIfUserOwnsBook(
        opts.ctx.user!.id,
        id,
      );
      let owned = false;

      if (libBooks.length === 0) {
        return { ...book, owned };
      }

      const libBook = libBooks[0];

      if (libBook.bookId === book.id) {
        owned = true;
      }

      if (owned) {
        return {
          ...book,
          owned,
          like: libBook.like,
          superLike: libBook.superLike,
          dislike: libBook.dislike,
        };
      }

      return { ...book, owned };
    } catch (error) {
      console.log('error in the bookRoute/getBookInfo, error');
      throw error;
    }
  }),

  generatePaymentIntent: clientProcedure
    .input(
      z.object({
        bookId: z.string(),
      }),
    )
    .mutation(async (opts) => {
      try {
        const input = opts.input;

        const books = await bookrepo.getBookById(input.bookId);

        if (books.length === 0) {
          throw new Error(`books length  === 0`);
        }
        const book = books[0];

        const paymentIntent = await stripe.paymentIntents.create({
          automatic_payment_methods: { enabled: true },
          currency: 'usd',
          amount: Math.ceil(book.price!) * 100,
          metadata: {
            user: opts.ctx.user!.id,
            bookId: book.id,
          },
        });

        return { clientSecret: paymentIntent.client_secret };
      } catch (error) {
        console.log(`There was an error in the `);
        throw error;
      }
    }),

  getAllBooksWithAudioBooks: adminProcedure.query(async () => {
    try {
      const books = await bookrepo.getBooksWithAudios();
      const sortedBooks: {
        id: string;
        name: string;
        audioBooks: {
          id: string;
          createdAt: string | null;
          updatedAt: string | null;
          bookId: string;
          author: string;
          audio: string;
          language: 'ENGLISH' | 'SPANISH';
        }[];
      }[] = [];

      books.forEach((b) => {
        const found = sortedBooks.find((sb) => {
          return sb.id === b.books.id;
        });

        if (found) {
          found.audioBooks.push(b.audiobooks);
        } else {
          sortedBooks.push({
            id: b.books.id,
            name: b.books.name,
            audioBooks: [b.audiobooks],
          });
        }
      });

      return sortedBooks;
    } catch (error) {
      console.log(
        `There was an error in the bookRoute getAllBooksWithAudioBooks ${error}`,
      );
      throw error;
    }
  }),

  fuzzySearchByName: clientProcedure.input(z.string()).query(async (opts) => {
    try {
      const nameTerm = opts.input;
      const books = await bookrepo.fuzzySearchByName(nameTerm);
      books.forEach((b) => {
        b.thumbnail = `https://${Bucket.bookBucket.bucketName}.s3.amazonaws.com/${b.thumbnail}`;
      });

      return books;
    } catch (error) {
      console.log('error in bookroute - fuzzySearchByName ', error);
      throw error;
    }
  }),
});
