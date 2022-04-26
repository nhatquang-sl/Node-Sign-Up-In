import * as dotenv from 'dotenv';
import path from 'path';

console.log(process.env.NODE_ENV);
dotenv.config({ path: path.join(__dirname, '..', '.env') });
if (process.env.NODE_ENV?.trim() == 'development')
  dotenv.config({ path: path.join(__dirname, '..', '.development.env'), override: true });
const ENV = {
  APP_VERSION: process.env.APP_VERSION,
  APP_HOST: process.env.APP_HOST ?? '',
  PORT: process.env.PORT || 3500,

  DB_NAME: process.env.DB_NAME ?? '',
  DB_USERNAME: process.env.DB_USERNAME ?? '',
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_HOST: process.env.DB_HOST,

  MJ_APIKEY_PUBLIC: process.env.MJ_APIKEY_PUBLIC ?? '',
  MJ_APIKEY_PRIVATE: process.env.MJ_APIKEY_PRIVATE ?? '',
};

export default ENV;
