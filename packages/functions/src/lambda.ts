import { ApiHandler } from 'sst/node/api';
import { drizzle } from 'drizzle-orm/planetscale-serverless';
import { connect } from '@planetscale/database';
import * as schema from '../../core/src/schema';
import { Config } from 'sst/node/config';
import { v4 } from 'uuid';

const connection = connect({
  url: Config.DATABASE_URL,
});

export const db = drizzle(connection, { schema });

export const handler = ApiHandler(async (_evt) => {
  if (!_evt.body) {
    console.log(' i got errored');
    return { statusCode: 400, body: JSON.stringify({ error: 'no body' }) };
  }
  const event = JSON.parse(_evt.body);

  switch (event.type) {
    case 'payment_intent.succeeded': {
      const metadata = event.data.object.metadata;
      const userId = metadata.user as string;
      const audiobookId = metadata.audiobookId as string;
      const bookId = metadata.bookId;

      await db.insert(schema.library).values({
        id: v4(),
        userId: userId,
        bookId: bookId,
      });
      console.log('all good');
      return { statusCode: 200, body: JSON.stringify({ ok: 'saved' }) };
      break;
    }
    case 'payment_method.cancled': {
      console.log('oayment attached');
      // Then define and call a method to handle the successful attachment of a PaymentMethod.
      // handlePaymentMethodAttached(paymentMethod);

      break;
    }
    default: {
      console.log('default');
      return {
        statusCode: 200,
        body: `Hello world. The time is ${new Date().toISOString()}`,
      };
      break;
    }
    // Unexpected event type
  }

  return {
    statusCode: 200,
    body: `idk for now`,
  };
});
