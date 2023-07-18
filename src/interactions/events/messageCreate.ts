import { ChannelType, Guild, Message, MessageType, PrivateThreadChannel, TextChannel, Webhook, WebhookClient } from 'discord.js';
import { prisma } from '../../database';
import { MessageURLProps, createMessageURL, fetchOrCreateWebhook } from '../../util/webhook';
import { capitalize } from '../../util/string';

export default async function onMessageCreate(message: Message<boolean>) {
	if (message.author.bot) return;
	if (!message.guild) return;
	if (!message.content || message.content == '') return;
	if (!message.content.trim() || message.content.trim() == '') return;
	if (message.guild.id === '1124269588645957652') return messageInSubsidiary(message);

	const channel = message.channel;
	const thread = channel.isThread();
	if (thread && channel.type == ChannelType.PrivateThread) return await messageInPrivateThread(message, channel);
}

async function messageInPrivateThread(message: Message, thread: PrivateThreadChannel) {
	const channel = thread.parent;
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
}

type Operative = string;
type OperativePairing = [Operative, Operative];

export async function loadDMWebhooks(guild: Guild) {
	const operatives: string[] = ['Alpha', 'Gamma', 'Zeta', 'Omikron', 'Delta', 'Echo', 'November', 'Epsilon', 'Theta', 'Sigma', 'Nightingale', 'Omega', 'Cerulea'];

	await guild.channels.fetch();

	const headOperatives: Record<string, [string, Record<string, TextChannel>]> = {};

	for (const op of operatives) {
		const channels = guild.channels.cache.filter((c) => {
			if (c.type != ChannelType.GuildText) return false;
			if (!c.parent) return false;
			if (!c.parent.name.includes(op)) return false;
			return true;
		});

		for (const newChannel of channels.values()) {
			if (newChannel.type != ChannelType.GuildText) continue;
			if (!newChannel.parent) continue;

			const parentName = newChannel.parent.id;
			const rawName = newChannel.parent.name.split(' ')[1].toLowerCase();
			if (!headOperatives[parentName]) headOperatives[parentName] = [rawName, {}];

			const nameSplit = newChannel.name.split('-');
			const name = nameSplit[1] ?? null;
			if (!name) continue;
			headOperatives[parentName][1][name] = newChannel;
		}
	}

	for (const operative in headOperatives) {
		const [name, ops] = headOperatives[operative];
		for (const operative2 in ops) {
			const opsChannel = ops[operative2];

			try {
				await prisma.whisperChannel.create({
					data: {
						categoryId: operative,
						targetName: operative2,
						targetChannelId: opsChannel.id,
						name: name,
					},
				});
			} catch (err) {
				console.log('Error creating whisper channel', err);
			}
		}
	}

	console.log('Done');
}

async function messageInSubsidiary(message: Message<boolean>) {
	const operatives: string[] = ['Alpha', 'Gamma', 'Zeta', 'Omikron', 'Delta', 'Echo', 'November', 'Epsilon', 'Theta', 'Sigma', 'Nightingale', 'Omega', 'Cerulea'];

	const channel = message.channel;
	if (channel.type != ChannelType.GuildText) return;

	const parent = channel.parent;
	if (!parent) return;

	const rawParentName = parent.name.split(' ')[1];
	if (!rawParentName) return;
	const parentName = rawParentName.toLowerCase();
	if (!operatives.includes(capitalize(parentName))) return;

	const profile = await prisma.profile.findUnique({
		where: {
			accountId_categoryId: {
				accountId: message.author.id,
				categoryId: '954461969262452846',
			},
		},
	});
	if (!profile) return console.log('No Profile');

	const split = channel.name.split('-');
	const op = split[0];
	const rawName = split[1];
	if (!rawName) return;

	const channelTarget = await prisma.whisperChannel.findUnique({
		where: {
			name_targetName: {
				name: rawName,
				targetName: parentName,
			},
		},
	});

	if (!channelTarget) return;

	const focus = channel.guild.channels.cache.get(channelTarget.targetChannelId);
	if (!focus) return;
	if (focus.type != ChannelType.GuildText) return;

	const webhook = await fetchOrCreateWebhook(focus);

	await webhook.send({
		content: message.content,
		avatarURL: profile.avatarURL ?? undefined,
		username: profile.name,
	});

	await message.react('✅');
}
