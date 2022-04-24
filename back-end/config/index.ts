import * as dotenv from 'dotenv';
import path from 'path';

console.log(process.env.NODE_ENV);
dotenv.config({ path: path.join(__dirname, '..', '.env') });
if (process.env.NODE_ENV?.trim() == 'development')
  dotenv.config({ path: path.join(__dirname, '..', '.development.env'), override: true });
const ENV = {
  APP_VERSION: process.env.APP_VERSION,
  HOST: process.env.HOST ?? '',
  PORT: process.env.PORT || 3500,

  MJ_APIKEY_PUBLIC: process.env.MJ_APIKEY_PUBLIC ?? '',
  MJ_APIKEY_PRIVATE: process.env.MJ_APIKEY_PRIVATE ?? '',
};

export default ENV;
