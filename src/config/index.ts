import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default('3000'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  HUBTEL_CLIENT_ID: z.string(),
  HUBTEL_CLIENT_SECRET: z.string(),
  HUBTEL_MERCHANT_ACCOUNT_NUMBER: z.string(),
  QSTASH_TOKEN: z.string(),
  QSTASH_CURRENT_SIGNING_KEY: z.string(),
  QSTASH_NEXT_SIGNING_KEY: z.string(),
  APP_BASE_URL: z.string(),
});

export const config = envSchema.parse(process.env);
