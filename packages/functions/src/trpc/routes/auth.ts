import { router, procedure, adminProcedure, clientProcedure } from '../init';
import { z } from 'zod';
import { userRepo } from '../repo/userRepo';
import { TRPCError } from '@trpc/server';
import jwt from 'jsonwebtoken';
import { Config } from 'sst/node/config';
import bcrypt from 'bcryptjs';

const routerName = 'authRouter';
export const authRouter = router({
  login: procedure
    .input(
      z.object({
        email: z.string(),
        password: z.string(),
      }),
    )
    .mutation(async (opts) => {
      console.log('hello');
      const functionName = 'login';

      try {
        const creds = opts.input;
        const user = await userRepo.getUser(creds);

        if (user.length === 0) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Invalid credentials',
          });
        }

        const u = user[0];

        const verified = await bcrypt.compare(creds.password, u.password);

        if (!verified) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Invalid credentials',
          });
        }

        const token = jwt.sign({ id: u.id, role: u.role }, Config.JWT_SECRET);

        return { token: token };
      } catch (error) {
        if (error instanceof TRPCError) {
          console.error(`${routerName} - ${functionName} Error: ${error}`);
          throw error;
        } else {
          console.log(error);
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Internal server error',
          });
        }
      }
    }),

  register: procedure
    .input(
      z.object({
        email: z.string(),
        password: z.string(),
        name: z.string(),
      }),
    )
    .mutation((opts) => {
      const functionName = 'registrer';
      try {
        const creds = opts.input;
        userRepo.createUser(creds);
        return { ok: 'user registed' };
      } catch (error) {
        if (error instanceof TRPCError) {
          console.error(`${routerName} - ${functionName} Error: ${error}`);
          throw error;
        } else {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Internal server error',
          });
        }
      }
    }),

  authorizedClient: clientProcedure.mutation((opts) => {
    try {
      const [_, token] = opts.ctx.event.headers.authorization!.split(' ');
      jwt.verify(token, Config.JWT_SECRET);
      return true;
    } catch (error) {
      return false;
    }
  }),

  authorizedAdmin: adminProcedure.query((opts) => {
    try {
      const [_, token]: any = opts.ctx.event.headers.authorization!.split(' ');
      const payload: any = jwt.verify(token, Config.JWT_SECRET);

      if (opts.ctx.user!.role !== 'ADMIN') {
        return false;
      }

      return true;
    } catch (error) {
      return false;
    }
  }),
});
