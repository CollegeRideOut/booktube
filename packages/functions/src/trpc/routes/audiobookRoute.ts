import { z } from 'zod';
import { adminProcedure, clientProcedure, router } from '../init';
import { bookrepo } from '../repo/bookRepo';
import { TRPCError } from '@trpc/server';
import { v4 } from 'uuid';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Bucket } from 'sst/node/bucket';
import { audiobookRepo } from '../repo/audiobookRepo';
import Stripe from 'stripe';
import { Config } from 'sst/node/config';
import { audiobookSubs, audiobooks } from '@booktube/core/schema';

const routeName = 'audiobookRoute';

export const audiobookRouter = router({
  createAudiobook: adminProcedure
    .input(
      z.object({
        author: z.string(),
        bookId: z.string(),
        language: z.enum(['ENGLISH', 'SPANISH']),
      }),
    )
    .mutation(async (opts) => {
      try {
        const audioBookInfo = opts.input;

        const books = await bookrepo.getBookById(audioBookInfo.bookId);

        if (books.length === 0) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: `book with id: ${audioBookInfo.bookId}, does not exist`,
          });
        }

        const book = books[0];
        if (book.id !== audioBookInfo.bookId) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: `book with id: ${audioBookInfo.bookId}, does not exist`,
          });
        }

        // save the audiobook

        const idForAudioBook = v4();
        const pathToAudio = `${idForAudioBook}`;
        await audiobookRepo.createAudiobook({
          id: idForAudioBook,
          audio: pathToAudio,
          bookId: audioBookInfo.bookId,
          author: audioBookInfo.author,
          language: audioBookInfo.language,
        });

        // send the of the bucket to save on s3

        //getSignedUrl()

        const putAudioCommand = new PutObjectCommand({
          Key: pathToAudio,
          ACL: 'public-read',
          Bucket: Bucket.bookBucket.bucketName,
        });

        //S3Client

        const putAudioUrl = await getSignedUrl(
          new S3Client({}),
          putAudioCommand,
        );

        return { audioUrl: putAudioUrl };
      } catch (error) {
        console.log(`Error in ${routeName} - createAudiobook -> ${error}`);
        throw error;
      }
    }),

  getLoABoWithSubs: clientProcedure.input(z.string()).query(async (opts) => {
    try {
      const bookId = opts.input;
      const sqlAudiobooksWithSubs =
        await audiobookRepo.getAudiobooksByBookWithSubs(bookId);

      const audios: {
        id: string;
        createdAt: string | null;
        updatedAt: string | null;
        author: string;
        bookId: string;
        language: 'ENGLISH' | 'SPANISH';
        audio: string;
        subs: {
          id: string;
          language: 'ENGLISH' | 'SPANISH';
          audiobookId: string;
          path: string;
        }[];
      }[] = [];

      sqlAudiobooksWithSubs.forEach((a) => {
        const audibookFound = audios.find((ab) => {
          return ab.id === a.audiobooks.id;
        });
        if (audibookFound) {
          audibookFound.subs.push({
            ...a.audiobookSubs,
            path: `https://${Bucket.bookBucket.bucketName}.s3.amazonaws.com/${a.audiobookSubs.id}`,
          });
        } else {
          a.audiobooks.audio = `https://${Bucket.bookBucket.bucketName}.s3.amazonaws.com/${a.audiobooks.audio}`;
          audios.push({
            ...a.audiobooks,
            subs: [
              {
                ...a.audiobookSubs,
                path: `https://${Bucket.bookBucket.bucketName}.s3.amazonaws.com/${a.audiobookSubs.id}`,
              },
            ],
          });
        }
      });

      return audios;
    } catch (error) {
      console.log(`Error in ${routeName} - getLoAbo-> ${error}`);
      throw error;
    }
  }),
});
