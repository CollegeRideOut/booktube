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

const routerName = 'userRoute';

export const userRoute = router({
  userInfo: clientProcedure.query((opts) => {
    const { id, password, role, createdAt, updatedAt, ...user } = {
      ...opts.ctx.user!,
    };
    return user;
  }),

  updateUserInfo: clientProcedure
    .input(
      z.object({
        name: z.string(),
        email: z.string(),
        oldPassword: z.string(),
        newPassword: z.string(),
        confirmPassword: z.string(),
      }),
    )
    .mutation(async (opts) => {
      const oldUserInfo = opts.ctx.user!;
      const newUserInfo = opts.input;
      const oldPasswordsMatch = await bcrypt.compare(
        newUserInfo.oldPassword,
        oldUserInfo.password,
      );

      if (
        newUserInfo.confirmPassword === '' ||
        newUserInfo.oldPassword === '' ||
        newUserInfo.email === '' ||
        newUserInfo.newPassword === ''
      ) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'some info was empty',
        });
      }

      if (!oldPasswordsMatch) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'old password does not match',
        });
      }

      if (newUserInfo.newPassword !== newUserInfo.confirmPassword) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'new and confirm passwords do not match',
        });
      }

      const newUer = {
        id: oldUserInfo.id,
        name: oldUserInfo.name,
        email: newUserInfo.email,
        password: newUserInfo.confirmPassword,
      };

      console.log(newUer);
      await userRepo.updateUser(newUer);

      return { ok: 'user updated' };
    }),
});
