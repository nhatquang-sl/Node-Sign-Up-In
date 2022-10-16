import * as dotenv from 'dotenv';
import path from 'path';

console.log({ NODE_ENV: process.env.NODE_ENV });
dotenv.config({ path: path.join(__dirname, '..', 'node-sign-up-in-credentials', '.env') });
if (process.env.NODE_ENV?.trim() == 'development')
  dotenv.config({
    path: path.join(__dirname, '..', 'node-sign-up-in-credentials', '.development.env'),
    override: true,
  });
const ENV = {
  NODE_ENV: process.env.NODE_ENV,
  APP_VERSION: process.env.APP_VERSION,
  APP_HOST: process.env.APP_HOST ?? '',
  PORT: process.env.PORT || 3500,

  FE_ENDPOINT: 'http://localhost:3000',

  DB_NAME: process.env.DB_NAME ?? '',
  DB_USERNAME: process.env.DB_USERNAME ?? '',
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_HOST: process.env.DB_HOST,

  MJ_APIKEY_PUBLIC: process.env.MJ_APIKEY_PUBLIC ?? '',
  MJ_APIKEY_PRIVATE: process.env.MJ_APIKEY_PRIVATE ?? '',

  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET ?? '',
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET ?? '',

  BNB_API_KEY: process.env.BNB_API_KEY ?? '',
  BNB_SECRET_KEY: process.env.BNB_SECRET_KEY ?? '',
};

export default ENV;
