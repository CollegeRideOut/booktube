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
import { tagRepo } from '../repo/tagRepo';

const routerName = 'tagRoute';

export const tagRoute = router({
  getTags: adminProcedure.query(async () => {
    return tagRepo.getTags();
  }),
});
