import { router, clientProcedure, adminProcedure } from '../init';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { v4 } from 'uuid';
import { bookrepo } from '../repo/bookRepo';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { Bucket } from 'sst/node/bucket';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { TRPCError } from '@trpc/server';
import { userRepo } from '../repo/userRepo';
import { subsRepo } from '../repo/subsRepo';

const routerName = 'subsRoute';

export const subsRoute = router({
  saveNewSubs: adminProcedure
    .input(
      z.object({
        audiobookId: z.string(),
        subsLanguage: z.enum(['ENGLISH', 'SPANISH']),
      }),
    )
    .mutation(async (opts) => {
      try {
        const audiobookid = opts.input.audiobookId;
        const subsLanguage = opts.input.subsLanguage;
        const idToUse = v4();

        await subsRepo.createNewSub(idToUse, audiobookid, subsLanguage);

        const putSubs = new PutObjectCommand({
          ACL: 'public-read',
          Bucket: Bucket.bookBucket.bucketName,
          Key: idToUse,
        });

        const url = await getSignedUrl(new S3Client({}), putSubs);
        return { subsUrl: url };
      } catch (error) {
        console.log(`Error on ${routerName} - saveNewSubs Error: ${error}`);
        throw error;
      }
    }),
});
