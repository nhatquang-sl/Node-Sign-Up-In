import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const ENV = {
  APP_VERSION: process.env.APP_VERSION,
  PORT: process.env.PORT || 3500,
};

export default ENV;
