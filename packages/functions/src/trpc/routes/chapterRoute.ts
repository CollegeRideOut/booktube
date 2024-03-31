import { Bucket } from 'sst/node/bucket';
import { clientProcedure, router } from '../init';
import { libraryRepo } from '../repo/libraryRepo';
import { z } from 'zod';
import { bookrepo } from '../repo/bookRepo';
import { TRPCError } from '@trpc/server';
import { chapterRepo } from '../repo/chapterRepo';
import { audiobookRepo } from '../repo/audiobookRepo';
import { chapterProgressRepo } from '../repo/chapterProgressRepo';
import { v4 } from 'uuid';

export const chapterRoute = router({
  getChapterById: clientProcedure
    .input(
      z.object({
        id: z.string().uuid(),
      }),
    )
    .mutation(async (opts) => {
      const id = opts.input.id;

      const chapter = await chapterRepo.getChapterByIdWithAudioAndSubs(id);

      const audiobooksFromSql =
        await audiobookRepo.getChapterAudiobooksWithSubs(id);

      const audiobooks: {
        id: string;
        author: string;
        path: string;
        language: 'ENGLISH' | 'SPANISH';
        subs: {
          path: string;
          id: string;
          language: 'ENGLISH' | 'SPANISH';
          audiobookId: string;
        }[];
      }[] = [];

      audiobooksFromSql.forEach((ab) => {
        const found = audiobooks.find((auSend) => {
          return auSend.id === ab.audiobooks.id;
        });

        if (found) {
          found.subs.push({
            ...ab.audiobookSubs,
            path: `https://${Bucket.bookBucket.bucketName}.s3.amazonaws.com/${ab.audiobookSubs.id}`,
          });
        } else {
          audiobooks.push({
            id: ab.audiobooks.id,
            author: ab.audiobooks.author,

            path: `https://${Bucket.bookBucket.bucketName}.s3.amazonaws.com/${ab.audiobooks.id}`,
            language: ab.audiobooks.language,
            subs: [
              {
                ...ab.audiobookSubs,
                path: `https://${Bucket.bookBucket.bucketName}.s3.amazonaws.com/${ab.audiobookSubs.id}`,
              },
            ],
          });
        }
      });

      return { chapter: chapter[0], audiobooks };
    }),
});
