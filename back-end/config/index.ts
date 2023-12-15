import * as dotenv from 'dotenv';
import path from 'path';
import { z } from 'zod';

dotenv.config({ path: path.join(__dirname, '..', 'node-sign-up-in-credentials', '.env') });
if (process.env.NODE_ENV?.trim() == 'development')
  dotenv.config({
    path: path.join(__dirname, '..', 'node-sign-up-in-credentials', '.development.env'),
    override: true,
  });

const envSchema = z.object({
  // See https://cjihrig.com/node_env_considered_harmful
  NODE_ENV: z.enum(['development', 'production', 'test']).default('production'),

  APP_VERSION: z.string(),
  APP_HOST: z.string().optional(),
  PORT: z.number().default(3500),

  FE_ENDPOINT: z.string().url(),

  DB_NAME: z.string(),
  DB_USERNAME: z.string(),
  DB_PASSWORD: z.string(),
  DB_HOST: z.string(),

  MJ_APIKEY_PUBLIC: z.string(),
  MJ_APIKEY_PRIVATE: z.string(),

  ACCESS_TOKEN_SECRET: z.string(),
  REFRESH_TOKEN_SECRET: z.string(),

  BNB_API_KEY: z.string(),
  BNB_SECRET_KEY: z.string(),
  ALLOWED_ORIGINS: z.preprocess((val) => {
    return val
      ? String(val)
          .split(',')
          .map((x) => x.trim())
      : [];
  }, z.array(z.string())),
});
const ENV = Object.freeze(envSchema.parse(process.env));

const secretEnvs: Array<keyof typeof envSchema.shape> = [
  'DB_NAME',
  'DB_USERNAME',
  'DB_PASSWORD',
  'MJ_APIKEY_PRIVATE',
  'MJ_APIKEY_PUBLIC',
  'BNB_API_KEY',
  'BNB_SECRET_KEY',
];
for (const secretEnv of secretEnvs) {
  delete process.env[secretEnv];
}

export default ENV;
