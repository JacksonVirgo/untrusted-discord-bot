import config, { data } from './config';
import { prisma } from './database';
import { loadDMWebhooks } from './interactions/events/messageCreate';
import { BotClient } from './structures/BotClient';

export const client = new BotClient(config.DISCORD_CLIENT_ID, config.DISCORD_TOKEN);
export const SUBSIDIARY = '1124269588645957652';

(async () => {
	await client.login();
	await runOnStart();
	tick(client);
})();

async function runOnStart() {
	// await client.guilds.fetch();
	// const guild = client.guilds.cache.get(SUBSIDIARY);
	// if (!guild) return;
	// await loadDMWebhooks(guild);
	// console.log('Done');
}

async function tick(client: BotClient) {
	setTimeout(() => {
		tick(client);
	}, 1000 * 60 * 5);
}
