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
import * as bycrypt from 'bcryptjs';

const routerName = 'userRoute';

export const userRoute = router({
  userInfo: clientProcedure.query((opts) => {
    const { id, password, role, createdAt, updatedAt, ...user } = {
      ...opts.ctx.user!,
    };
    return user;
  }),

  updateFullName: clientProcedure.input(z.object({ name: z.string() })).mutation(async (opts) => {
    try {

      const name = opts.input.name
      const userId = opts.ctx.user!.id
      await userRepo.updateName(name, userId)


      return { ok: 'user full name updated' }
    } catch (error) {
      console.log('error in the userroute/updateemail', error)
      throw error

    }
  }),


  updateEmail: clientProcedure.input(z.object({
    email: z.string()
  })).mutation(async (opts) => {
    try {

      const email = opts.input.email
      const userId = opts.ctx.user!.id
      await userRepo.updateEmail(email, userId)
      return { ok: 'user email updated' }
    } catch (error) {
      console.log('error in the userroute/updateemail', error)
      throw error

    }
  }),


  updatePassword: clientProcedure.input(z.object({

    oldPassword: z.string(),

    newPassword: z.string(),
    confirmPassword: z.string(),
  })).mutation(async (opts) => {
    try {
      const oldPassword = opts.input.oldPassword.trim()
      const newPassword = opts.input.newPassword.trim()
      const confirmPassword = opts.input.confirmPassword.trim()
      const userHahsedPassword = opts.ctx.user!.password
      const userId = opts.ctx.user!.id

      if (oldPassword === '' || newPassword === '' || confirmPassword === '') {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'empty password' })
      }

      const oldPasswordMatch = await bycrypt.compare(oldPassword, userHahsedPassword)
      if (oldPasswordMatch) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'Old password does match to previous password' })
      }

      if (newPassword !== confirmPassword) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'confirm password is not equal to new password ' })
      }

      const hashedPassword = await bycrypt.hash(newPassword, 8)
      await userRepo.updatePassword(hashedPassword, userId)

      return { ok: 'user password updated' }
    } catch (error) {
      console.log('error in the userroute/updateemail', error)
      throw error

    }
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
