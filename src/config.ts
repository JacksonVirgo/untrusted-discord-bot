import { config } from 'dotenv';
import { z } from 'zod';

config();

const envSchema = z.object({
	DATABASE_URL: z.string(),
	DISCORD_TOKEN: z.string(),
	DISCORD_CLIENT_ID: z.string(),
	MAIN_SERVER_ID: z.string(),
});

export const env = envSchema.parse(process.env);

export default {
	...env,
};
