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

type Data = {
	profiles: {
		id: number;
		discordId: string;
		name: string;
		avatarURL: string;
		canBroadcast: boolean | null;
	}[];
	channels: {
		id: number;
		channelId: string;
		canBroadcast: boolean | null;
	}[];
};

export const data: Data = {
	profiles: [
		{
			id: 23,
			discordId: '366981001693495317',
			name: 'Op.April',
			avatarURL: 'https://cdn.discordapp.com/attachments/1116455645726642278/1116455764983296130/Op.April_Mint_M.jpg',
			canBroadcast: null,
		},
		{
			id: 42,
			discordId: '697381070538276916',
			name: 'Op.Theta',
			avatarURL: 'https://cdn.discordapp.com/attachments/1116355537836187689/1123606985674342410/custom_untrusted_on_discord_official_logo.png',
			canBroadcast: true,
		},
		{
			id: 28,
			discordId: '992212617944903792',
			name: 'Op.Alpha',
			avatarURL: 'https://cdn.discordapp.com/attachments/1116355537836187689/1123606985674342410/custom_untrusted_on_discord_official_logo.png',
			canBroadcast: null,
		},
		{
			id: 29,
			discordId: '416757703516356628',
			name: 'Op.Gamma',
			avatarURL: 'https://cdn.discordapp.com/attachments/1116355537836187689/1123606985674342410/custom_untrusted_on_discord_official_logo.png',
			canBroadcast: null,
		},
		{
			id: 30,
			discordId: '749732956855074966',
			name: 'Op.Zeta',
			avatarURL: 'https://cdn.discordapp.com/attachments/1116355537836187689/1123606985674342410/custom_untrusted_on_discord_official_logo.png',
			canBroadcast: null,
		},
		{
			id: 31,
			discordId: '320317756069117955',
			name: 'Op.Omikron',
			avatarURL: 'https://cdn.discordapp.com/attachments/1116355537836187689/1123606985674342410/custom_untrusted_on_discord_official_logo.png',
			canBroadcast: null,
		},
		{
			id: 32,
			discordId: '357139596129337345',
			name: 'Op.Echo',
			avatarURL: 'https://cdn.discordapp.com/attachments/1116355537836187689/1123606985674342410/custom_untrusted_on_discord_official_logo.png',
			canBroadcast: null,
		},
		{
			id: 33,
			discordId: '580519599024635946',
			name: 'Op.November',
			avatarURL: 'https://cdn.discordapp.com/attachments/1116355537836187689/1123606985674342410/custom_untrusted_on_discord_official_logo.png',
			canBroadcast: null,
		},
		{
			id: 34,
			discordId: '419779597672906752',
			name: 'Op.Epsilon',
			avatarURL: 'https://cdn.discordapp.com/attachments/1116355537836187689/1123606985674342410/custom_untrusted_on_discord_official_logo.png',
			canBroadcast: null,
		},
		{
			id: 36,
			discordId: '680934438787612707',
			name: 'Op.Sigma',
			avatarURL: 'https://cdn.discordapp.com/attachments/1116355537836187689/1123606985674342410/custom_untrusted_on_discord_official_logo.png',
			canBroadcast: null,
		},
		{
			id: 37,
			discordId: '156294334138941441',
			name: 'Op.Nightingale',
			avatarURL: 'https://cdn.discordapp.com/attachments/1116355537836187689/1123606985674342410/custom_untrusted_on_discord_official_logo.png',
			canBroadcast: null,
		},
		{
			id: 38,
			discordId: '199605713654382593',
			name: 'Op.Omega',
			avatarURL: 'https://cdn.discordapp.com/attachments/1116355537836187689/1123606985674342410/custom_untrusted_on_discord_official_logo.png',
			canBroadcast: null,
		},
		{
			id: 40,
			discordId: '165224824187125760',
			name: 'Op.Cerulea',
			avatarURL: 'https://cdn.discordapp.com/attachments/1116355537836187689/1123606985674342410/custom_untrusted_on_discord_official_logo.png',
			canBroadcast: null,
		},
		{
			id: 41,
			discordId: '432644812047515651',
			name: 'Op.Delta',
			avatarURL: 'https://cdn.discordapp.com/attachments/1116355537836187689/1123606985674342410/custom_untrusted_on_discord_official_logo.png',
			canBroadcast: null,
		},
	],
	channels: [
		{ id: 1, channelId: '1116411946678354010', canBroadcast: true },
		{ id: 3, channelId: '956637979986772078', canBroadcast: false },
		{ id: 4, channelId: '956638158940930088', canBroadcast: false },
		{ id: 5, channelId: '956638097754427412', canBroadcast: false },
		{ id: 6, channelId: '956638327791042560', canBroadcast: false },
		{ id: 7, channelId: '956638380152737862', canBroadcast: false },
		{ id: 8, channelId: '956638455738282004', canBroadcast: false },
		{ id: 9, channelId: '956638525552463952', canBroadcast: false },
		{ id: 10, channelId: '956638594016083988', canBroadcast: false },
		{ id: 11, channelId: '956638647824826399', canBroadcast: false },
		{ id: 14, channelId: '956638822064599151', canBroadcast: false },
		{ id: 15, channelId: '957059877941952512', canBroadcast: false },
		{ id: 16, channelId: '957071127748935721', canBroadcast: false },
		{ id: 17, channelId: '1021903399857430589', canBroadcast: false },
		{ id: 18, channelId: '1022211733365997638', canBroadcast: false },
		{ id: 19, channelId: '1024993796188033054', canBroadcast: false },
		{ id: 20, channelId: '1024993815880269884', canBroadcast: false },
		{ id: 12, channelId: '956638711108501534', canBroadcast: true },
		{ id: 21, channelId: '954129626265948161', canBroadcast: null },
		{ id: 22, channelId: '1116355537836187689', canBroadcast: null },
		{ id: 13, channelId: '956638767962271864', canBroadcast: true },
		{ id: 23, channelId: '956637910860456017', canBroadcast: true },
	],
};
