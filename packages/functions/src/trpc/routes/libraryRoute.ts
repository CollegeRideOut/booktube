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

export const libraryRoute = router({
  getLibrary: clientProcedure.query(async (opts) => {
    const userId = opts.ctx.user!.id;
    try {
      const library = await libraryRepo.getUserLibrary(userId);

      library.forEach((lib) => {
        lib.book.thumbnailLong = `https://${Bucket.bookBucket.bucketName}.s3.amazonaws.com/${lib.book.thumbnailLong}`;
      });
      return library;
    } catch (error) {
      console.log(`error in library route get library ${error}`);
      throw error;
    }
  }),

  getLibraryOrderHistory: clientProcedure.query(async (opts) => {
    const userId = opts.ctx.user!.id;
    try {
      const library = await libraryRepo.getUserLibraryOrderHistory(userId);

      library.forEach((lib) => {
        lib.book.thumbnailLong = `https://${Bucket.bookBucket.bucketName}.s3.amazonaws.com/${lib.book.thumbnailLong}`;
      });
      return library;
    } catch (error) {
      console.log(`error in library route get library ${error}`);
      throw error;
    }
  }),

  writeReview: clientProcedure
    .input(
      z.object({
        libraryId: z.string().uuid(),
        bookId: z.string().uuid(),
        title: z.string(),
        rating: z.number().max(5).min(0),
        description: z.string(),
      }),
    )
    .mutation(async (opts) => {
      try {
        const info = opts.input;
        await libraryRepo.updateReview({
          id: info.libraryId,
          rating: info.rating,
          description: info.description,
          title: info.title,
        });

        const avg = (await libraryRepo.avgReviews(info.bookId))[0].value;
        if (avg === null) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'average was null',
          });
        }
        const avgValue = parseFloat(avg);
        await bookrepo.updateRating(info.bookId, avgValue);

        return 'ok';
      } catch (error) {
        throw error;
      }
    }),

  getCurrentLibraryListen: clientProcedure
    .input(z.string().uuid())
    .query(async (opts) => {
      try {
        const libraryId = opts.input;
        const library = await libraryRepo.getLibraryInfo(libraryId);
        if (library.length === 0) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Library not found',
          });
        }
        const libraryInfo = library[0];

        if (libraryInfo.id !== libraryId) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Library not found',
          });
        }

        const books = await bookrepo.getBookByIdWithGenre(libraryInfo.bookId);
        if (books.length === 0) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'book not found',
          });
        }

        const bookInfo = books[0].books;

        if (bookInfo.id !== libraryInfo.bookId) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'book not found',
          });
        }

        const chapters = await chapterRepo.getChapters(libraryInfo.bookId);

        if (chapters.length === 0) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'chapter length 0',
          });
        }

        const chapterProgressExist =
          await chapterProgressRepo.getChapterProgressForLibrary(
            libraryInfo.id,
          );
        // this is wrong
        if (libraryInfo.lastChapterProgessId === null) {
          if (chapterProgressExist.length !== 0) {
            throw new TRPCError({
              code: 'INTERNAL_SERVER_ERROR',
              message:
                'librayInfo.chapterProgress is empty but there was chapterProgess',
            });
          }
          const firstChapter = chapters.find((c) => {
            return c.number === 1;
          });

          if (firstChapter) {
            //create ChapterProgress
            const firstChapterProgressIdToUse = v4();

            await chapterProgressRepo.createFirstChapterProgress(
              firstChapterProgressIdToUse,
              libraryInfo.id,
              firstChapter.id,
            );

            libraryInfo.lastChapterProgessId = firstChapterProgressIdToUse;

            await libraryRepo.updateLibrary({
              id: libraryInfo.id,
              lastChapterProgessId: firstChapterProgressIdToUse,
              favourite: libraryInfo.favourite,
            });
          } else {
            throw new TRPCError({
              code: 'INTERNAL_SERVER_ERROR',
              message: 'chapter number 1 not found',
            });
          }
        }

        const chapterProgressList = await chapterProgressRepo.getById(
          libraryInfo.lastChapterProgessId,
        );
        if (chapterProgressList.length === 0) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'no chapterProgress Found',
          });
        }

        const chapterProgress = chapterProgressList[0];

        const chapterInfo = chapters.find((c) => {
          return chapterProgress.chapterId === c.id;
        });

        if (!chapterInfo) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'chapter number not found',
          });
        }

        const audiobooksFromSql =
          await audiobookRepo.getChapterAudiobooksWithSubs(chapterInfo.id);

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

        let currentAudiobook:
          | {
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
          }
          | undefined = undefined;

        if (chapterProgress.audiobookId !== null) {
          currentAudiobook = audiobooks.find((a) => {
            return a.id === chapterProgress.audiobookId;
          });
        } else {
          currentAudiobook = audiobooks.find((a) => {
            return a.language === 'ENGLISH';
          });
        }

        console.log('here here here', currentAudiobook);
        if (currentAudiobook === undefined) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'NO CURRENT AUDIOBOOK',
          });
        }

        let currentSub:
          | {
            path: string;
            id: string;
            language: 'ENGLISH' | 'SPANISH';
            audiobookId: string;
          }
          | undefined;

        if (chapterProgress.subsId !== null) {
          currentSub = currentAudiobook.subs.find((s) => {
            return s.id === chapterProgress.subsId;
          });
        } else {
          currentSub = currentAudiobook.subs.find((s) => {
            return s.language === 'ENGLISH';
          });
        }

        if (!currentSub) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'NO CURRENT SUBS',
          });
        }

        if (
          chapterProgress.subsId === null ||
          chapterProgress.audiobookId === null
        ) {
          chapterProgress.subsId = currentSub.id;
          chapterProgress.audiobookId = currentAudiobook.id;
          await chapterRepo.updateChapter(
            {
              lastSecondListend: chapterProgress.lastSecondListend,
              subsId: chapterProgress.subsId,
              audiobookId: chapterProgress.audiobookId,
            },
            chapterProgress.id,
          );
        }

        return {
          libraryInfo: {
            id: libraryInfo.id,
          },
          bookInfo: {
            id: bookInfo.id,
            name: bookInfo.name,
            autor: bookInfo.author,
          },
          currentInfo: {
            chapterId: chapterProgress,
            /* audiobook: { id: currentAudiobook.id, path: currentAudiobook.path }, */
            /* sub: { id: currentSub.id, path: currentSub.path }, */
          },
          chapters: chapters,
          /* audiobooksForChapter: audiobooks, */
        };
      } catch (error) {
        console.log(error);
        throw error;
      }
    }),
});
