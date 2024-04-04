import {
  StackContext,
  Api,
  EventBus,
  AstroSite,
  Config,
  Bucket,
} from 'sst/constructs';
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as cloudfrontOrigins from "aws-cdk-lib/aws-cloudfront-origins";

export function API({ stack }: StackContext) {
  const JWT_SECRET = new Config.Secret(stack, 'JWT_SECRET');
  const DATABASE_HOST = new Config.Secret(stack, 'DATABASE_HOST');
  const DATABASE_USERNAME = new Config.Secret(stack, 'DATABASE_USERNAME');
  const DATABASE_PASSWORD = new Config.Secret(stack, 'DATABASE_PASSWORD');
  const DATABASE_NAME = new Config.Secret(stack, 'DATABASE_NAME');
  const DATABASE_URL = new Config.Secret(stack, 'DATABASE_URL');
  const STRIPE_KEY = new Config.Secret(stack, 'STRIPE_KEY');
  const STRIPE_SECRET = new Config.Secret(stack, 'STRIPE_SECRET');


  const videoBucket = new Bucket(stack, 'videoBucket');
  const bookBucket = new Bucket(stack, 'bookBucket');

  const videoDist = new cloudfront.Distribution(stack, "videoDist", {
    defaultBehavior: {
      origin: new cloudfrontOrigins.S3Origin(videoBucket.cdk.bucket),
    },
  });

  const bookDist = new cloudfront.Distribution(stack, "bookDist", {
    defaultBehavior: {
      origin: new cloudfrontOrigins.S3Origin(bookBucket.cdk.bucket),
    },
  });


  const api = new Api(stack, 'api', {
    defaults: {
      function: {
        bind: [
          videoBucket,
          bookBucket,
          JWT_SECRET,
          DATABASE_URL,
          DATABASE_NAME,
          DATABASE_PASSWORD,
          DATABASE_USERNAME,
          DATABASE_HOST,
          STRIPE_KEY,
          STRIPE_SECRET,
        ], environment: {
          'VIDEO_DISTRIBUTION_DOMAIN': videoDist.domainName,
          'BOOK_DISTRIBUTION_DOMAIN': bookDist.domainName,
        }
      },
    },

    cors: true,
    routes: {
      'GET /trpc/{proxy+}': 'packages/functions/src/trpc.handler',
      'POST /trpc/{proxy+}': 'packages/functions/src/trpc.handler',
      'POST /webhooks': 'packages/functions/src/lambda.handler',
    },
  });

  const site = new AstroSite(stack, 'Site', {
    path: 'web-astro/',
    environment: {
      PUBLIC_API_URL: api.url,
      PUBLIC_STRIPE_KEY: 'pk_test_51OgvnODtwmWWyx2zsJaolIDMcwaoSwhq7hnTzppNxb2mA9q9xiQSmftYu7numwi7HH86d3OmJZPGsCqzA92XMUur00gu9dA5c2'
    },
  });

  stack.addOutputs({
    ApiEndpoint: api.url,
    URL: site.url,
  });
}
