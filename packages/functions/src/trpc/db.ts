import { drizzle } from 'drizzle-orm/planetscale-serverless';
import { connect } from '@planetscale/database';
import * as schema from '../../../core/src/schema';
import {Config} from 'sst/node/config'

const connection = connect({
  url: Config.DATABASE_URL,
});

export const db = drizzle(connection, { schema });

