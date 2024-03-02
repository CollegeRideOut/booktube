import { awsLambdaRequestHandler } from '@trpc/server/adapters/aws-lambda';
import './trpc/db';
import { appRouter } from './trpc/routes/app';
import { createContext } from './trpc/init';

export type AppRouter = typeof appRouter;

export const handler = awsLambdaRequestHandler({
  
  router: appRouter,
  createContext,
});
