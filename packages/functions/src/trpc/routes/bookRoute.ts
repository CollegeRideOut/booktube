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
import { chapterRepo } from '../repo/chapterRepo';
import { subsRepo } from '../repo/subsRepo';

const stripe = new Stripe(Config.STRIPE_SECRET);

const routerName = 'bookRoutes';

export const bookRouter = router({
  //client based routes
  //
  createBook: adminProcedure
    .input(
      z.object({
        genres: z.array(z.string()),
        title: z.string(),
        summary: z.string(),
        author: z.string(),
        price: z.number(),
        bookDurationInSeconds: z.number(),
        chapters: z.array(
          z.object({
            name: z.string(),
            number: z.number(),
            audiobooks: z.array(
              z.object({
                author: z.string(),
                language: z.string(),
                audioFile: z.string(),
                subs: z.array(
                  z.object({
                    language: z.string(),
                    subsFile: z.string(),
                  }),
                ),
              }),
            ),
          }),
        ),
      }),
    )
    .mutation(async (opts) => {
      try {
        const bookInfo = opts.input;

        const idToUse = v4();
        const pathToThumbnailSquare = `${idToUse}_ThumbnailSquare`;
        const pathToThumbnailLong = `${idToUse}_ThumbnailLong`;
        await bookrepo.createBook({
          id: idToUse,
          author: bookInfo.author,
          name: bookInfo.title,
          summary: bookInfo.summary,
          thumbnailSquare: pathToThumbnailSquare,
          thumbnailLong: pathToThumbnailLong,
          numberOfChapters: bookInfo.chapters.length,
          bookDurationInSeconds: bookInfo.bookDurationInSeconds,
          price: bookInfo.price,
        });

        await genreRepo.addGenresToBook(idToUse, bookInfo.genres);

        const putThumbnailSquare = new PutObjectCommand({
          Key: pathToThumbnailSquare,
          ACL: 'public-read',
          Bucket: Bucket.bookBucket.bucketName,
        });

        const putThumbnailLong = new PutObjectCommand({
          Key: pathToThumbnailLong,
          ACL: 'public-read',
          Bucket: Bucket.bookBucket.bucketName,
        });

        const urlThumbnailSqure = await getSignedUrl(
          new S3Client({}),
          putThumbnailSquare,
        );
        const urlThumbnailLong = await getSignedUrl(
          new S3Client({}),
          putThumbnailLong,
        );

        const chaptersToInsert: {
          id: string;
          bookId: string;
          name: string;
          number: number;
        }[] = [];

        const audiobookstoInser: {
          id: string;
          author: string;
          chapterId: string;
          language: 'ENGLISH' | 'SPANISH';
        }[] = [];

        const subsToInsert: {
          id: string;
          audiobookId: string;
          language: 'ENGLISH' | 'SPANISH';
        }[] = [];

        const subsUrlToSend: { mapValue: string; id: string }[] = [];
        const audioUrlToSend: { mapValue: string; id: string }[] = [];

        for (let chapterBook of bookInfo.chapters) {
          let chapterId = v4();
          let { audiobooks, ...cInfo } = { ...chapterBook };

          chaptersToInsert.push({ id: chapterId, ...cInfo, bookId: idToUse });

          for (let chapterAudioBook of chapterBook.audiobooks) {
            let audioBookId = v4();
            let { subs, audioFile, ...aInfo } = { ...chapterAudioBook };
            audiobookstoInser.push({
              language: aInfo.language as 'ENGLISH' | 'SPANISH',
              author: aInfo.author,
              chapterId: chapterId,
              id: audioBookId,
            });

            audioUrlToSend.push({ mapValue: audioFile, id: audioBookId });
            for (let chapterAudioSubs of chapterAudioBook.subs) {
              const subsId = v4();
              const { subsFile, ...subInfo } = { ...chapterAudioSubs };
              subsToInsert.push({
                language: subInfo.language as 'ENGLISH' | 'SPANISH',
                audiobookId: audioBookId,
                id: subsId,
              });
              subsUrlToSend.push({ mapValue: subsFile, id: subsId });
            }
          }
        }

        await chapterRepo.createChapters(chaptersToInsert);
        await audiobookRepo.createAudiobooks(audiobookstoInser);
        await subsRepo.createNewSub(subsToInsert);

        const subsUrlSending: { url: string; key: string }[] = [];
        const audioUrlSending: { url: string; key: string }[] = [];

        for (let subsKey of subsUrlToSend) {
          const putSubs = new PutObjectCommand({
            Key: subsKey.id,
            ACL: 'public-read',
            Bucket: Bucket.bookBucket.bucketName,
          });

          const putSubsUrl = await getSignedUrl(new S3Client({}), putSubs);
          subsUrlSending.push({ url: putSubsUrl, key: subsKey.mapValue });
        }

        for (let audioKey of audioUrlToSend) {
          const putAudio = new PutObjectCommand({
            Key: audioKey.id,
            ACL: 'public-read',
            Bucket: Bucket.bookBucket.bucketName,
          });

          const putAudioUrl = await getSignedUrl(new S3Client({}), putAudio);
          audioUrlSending.push({ url: putAudioUrl, key: audioKey.mapValue });
        }

        return {
          thumbnailSquareUrl: urlThumbnailSqure,
          thumbnailLongUrl: urlThumbnailLong,
          subsUrl: subsUrlSending,
          audioUrl: audioUrlSending,
        };
      } catch (error) {
        throw error;
      }
    }),

  getSimilarBooks: clientProcedure
    .input(z.string().uuid())
    .query(async (opts) => {
      try {
        const id = opts.input;

        const books = await bookrepo.getBookByIdWithGenre(id);
        if (books.length === 0) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'books length = 0',
          });
        }
        const genres = books.map((b) => {
          return b.generes.id;
        });

        const smiliarBooks = await bookrepo.getSimilarBooks(genres);

        smiliarBooks.forEach((b) => {
          b.thumbnailLong = `http://${process.env.BOOK_DISTRIBUTION_DOMAIN}/${b.thumbnailLong}`;
        });
        return smiliarBooks;
      } catch (error) {
        throw error;
      }
    }),

  searchBooks: clientProcedure.input(z.string()).mutation(async (opts) => {
    try {
      const searchTerm = opts.input
      const books = await bookrepo.searchBooks(searchTerm)
      books.forEach((b) => {
        b.thumbnailLong = `http://${process.env.BOOK_DISTRIBUTION_DOMAIN}/${b.thumbnailLong}`;
      })
      return books
    } catch (error) {
      throw error
    }
  }),

  getBook: clientProcedure.input(z.string()).query(async (opts) => {
    try {
      const id = opts.input;
      const books = await bookrepo.getBookByIdWithGenre(id);
      if (books.length === 0) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `book with id ${id} not found `,
        });
      }

      const book = books[0].books;
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

  getFeaturedBook: clientProcedure.query(async (opts) => {
    try {
      const books = await bookrepo.getFeaturedBook();
      if (books.length === 0) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'books length is 0',
        });
      }

      const book = books[0];
      book.thumbnailSquare = `http://${process.env.BOOK_DISTRIBUTION_DOMAIN}/${book.thumbnailSquare}`;
      return book;
    } catch (error) {
      throw error;
    }
  }),

  getBookInfo: clientProcedure.input(z.string()).query(async (opts) => {
    try {
      const id = opts.input;
      const books = await bookrepo.getBookByIdWithGenre(id);
      if (books.length === 0) {
        throw new Error('books length === 0');
      }

      const book = books[0].books;

      const reviews = await libraryRepo.getUserReviews(book.id);

      book.thumbnailSquare = `http://${process.env.BOOK_DISTRIBUTION_DOMAIN}/${book.thumbnailSquare}`;

      const libBooks = await libraryRepo.checkIfUserOwnsBook(
        opts.ctx.user!.id,
        id,
      );
      let owned = false;

      if (libBooks.length === 0) {
        return {
          ...book,
          reviews,
          owned,
          librayId: '',
          genre: books[0].generes,
        };
      }

      const libBook = libBooks[0];

      if (libBook.bookId === book.id) {
        owned = true;
      }

      if (owned) {
        return {
          ...book,
          owned,
          reviews,
          genre: books[0].generes,
          librayId: libBook.id,
        };
      }

      return {
        ...book,
        owned,
        reviews,
        genre: books[0].generes,
        librayId: '',
      };
    } catch (error) {
      console.log('error in the bookRoute/getBookInfo,', error);
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

        const books = await bookrepo.getBookByIdWithGenre(input.bookId);

        if (books.length === 0) {
          throw new Error(`books length  === 0`);
        }
        const book = books[0].books;

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

  fuzzySearchByName: clientProcedure.input(z.string()).query(async (opts) => {
    try {
      const nameTerm = opts.input;
      const books = await bookrepo.fuzzySearchByName(nameTerm);
      books.forEach((b) => {
        b.thumbnailLong = `http://${process.env.BOOK_DISTRIBUTION_DOMAIN}/${b.thumbnailLong}`;
      });

      return books;
    } catch (error) {
      console.log('error in bookroute - fuzzySearchByName ', error);
      throw error;
    }
  }),
});
