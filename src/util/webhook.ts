import { TextChannel } from 'discord.js';

export async function fetchOrCreateWebhook(channel: TextChannel) {
	const webhooks = await channel.fetchWebhooks();
	if (webhooks.size == 0) {
		return await createWebhook(channel);
	}

	const webhook = webhooks.find((w) => {
		return w.owner?.id == channel.client.user?.id;
	});

	if (!webhook) {
		return await createWebhook(channel);
	}

	return webhook;
}

export async function createWebhook(channel: TextChannel) {
	const webhook = await channel.createWebhook({
		name: 'Anonymous Bot',
		avatar: 'https://cdn.discordapp.com/attachments/1111370865943261334/1116424019189702656/Melancholic_Abstract._Simplistic._a_person_with_a_mask_on_hidin_ba942df0-8550-43e5-a00e-b527de7ffe15.png',
	});
	return webhook;
}

export interface MessageURLProps {
	messageId: string;
	channelId: string;
	guildId: string;
}
export function createMessageURL({ messageId, channelId, guildId }: MessageURLProps) {
	return `https://discord.com/channels/${guildId}/${channelId}/${messageId}`;
}
