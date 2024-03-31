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

export const chapterProgressRoute = router({
  updateChapterProgressLastMinute: clientProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        lastSecondListend: z.number(),
      }),
    )
    .mutation(async (opts) => {
      await chapterProgressRepo.updateLastSecond({
        id: opts.input.id,
        lastSecondListend: opts.input.lastSecondListend,
      });

      return { ok: 'updated' };
    }),
});
