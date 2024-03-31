import { TRPCError, initTRPC } from '@trpc/server';
import { CreateAWSLambdaContextOptions } from '@trpc/server/adapters/aws-lambda';
import { APIGatewayProxyEventV2 } from 'aws-lambda';
import * as schema from '../../../core/src/schema';
import { userRepo } from './repo/userRepo';
import jwt from 'jsonwebtoken';
import superjson from 'superjson';

export const createContext = ({
  event,
  context,
}: CreateAWSLambdaContextOptions<APIGatewayProxyEventV2>) => {
  let user: typeof schema.users.$inferSelect | null | undefined;
  return {
    event,
    context,
    user,
  };
};

type Context = Awaited<ReturnType<typeof createContext>>;

const t = initTRPC.context<Context>().create({ transformer: superjson });

export const router = t.router;
export const procedure = t.procedure;

export const clientProcedure = t.procedure.use(async (opts) => {
  console.log(1)
  if (!opts.ctx.event.headers.authorization) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'user not authorized for this procdeure',
    });
  }

  try {

  console.log(2)
    const [_, token] = opts.ctx.event.headers.authorization.split(' ');
    if (!token) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'user not authorized for this procdeure',
        });
    }
    
  console.log(3)
    const id = jwt.decode(token) as any;
    if (!id) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'user not authorized for this procdeure',
        });
    }

  console.log(4)
    if (!id || !id.id || !(id.id satisfies string)) {

  console.log(5)
      if (!opts.ctx.event.headers.authorization) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'user not authorized for this procdeure',
        });
      }
    }
    
  console.log(6)

    const u = await userRepo.getUserById(id.id);
    if (u.length === 0) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Internal server error',
      });
    }

  console.log(7)
    const user = u[0];

    if (u[0].id !== id.id) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Internal server error',
      });
    }

    
  console.log(8)
    opts.ctx.user = user;

    return opts.next();
  } catch (error) {
    console.log(error);
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Internal server error',
    });
  }
});

// this is for admin

export const adminProcedure = t.procedure.use(async (opts) => {
  console.log(1);
  if (!opts.ctx.event.headers.authorization) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'user not authorized for this procdeure',
    });
  }
  console.log(1);

  try {
    const [_, token] = opts.ctx.event.headers.authorization.split(' ');
    const id = jwt.decode(token) as any;
    if (!id || !id.id || !(id.id satisfies string)) {
      if (!opts.ctx.event.headers.authorization) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'user not authorized for this procdeure',
        });
      }
    }

    const u = await userRepo.getUserById(id.id);
    if (u.length === 0) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Internal server error',
      });
    }

    if (u[0].id != id.id) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Internal server error',
      });
    }

    if (u[0].role != 'ADMIN') {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: '',
      });
    }

    opts.ctx.user = u[0];

    return opts.next();
  } catch (error) {
    if (error instanceof TRPCError) {
      throw error;
    } else {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Internal server error',
      });
    }
  }
});
