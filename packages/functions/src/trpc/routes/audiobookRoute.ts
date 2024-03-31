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

});
