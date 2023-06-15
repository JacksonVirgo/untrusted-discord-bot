import { ChannelType, ChatInputCommandInteraction, Interaction, Message, ModalSubmitInteraction } from 'discord.js';
import { slashCommands } from '../../structures/BotClient';
import { Button, Modal, SelectMenu } from '../../structures/interactions';
import { prisma } from '../../database';
import { fetchOrCreateWebhook } from '../../util/webhook';

export default async function onMessageCreate(message: Message) {
	if (message.author.bot) return;

	if (!message.content || message.content == '') return;
	if (!message.content.trim() || message.content.trim() == '') return;

	const thread = message.channel.isThread();
	if (!thread) return;

	const channel = message.channel.parent;
	if (channel?.type != ChannelType.GuildText) return;
	if (typeof channel !== 'object') return;
	if (!('parentId' in channel)) return;
	if (!channel.parentId) return;

	const user = await prisma.profile.findUnique({
		where: {
			accountId_categoryId: {
				accountId: message.author.id,
				categoryId: channel.parentId,
			},
		},
	});

	if (!user) return;

	const channelWhitelist = await prisma.channel.findUnique({
		where: {
			channelId: channel.id,
		},
	});

	if (!channelWhitelist) return;

	const webhook = await fetchOrCreateWebhook(channel);

	await webhook.send({
		content: message.content,
		avatarURL: user.avatarURL ?? undefined,
		username: user.name,
	});

	// await message.delete();
}
