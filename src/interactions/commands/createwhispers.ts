import { CategoryChannel, ChannelType, Guild, PermissionFlagsBits, SlashCommandBuilder, TextChannel, Webhook } from 'discord.js';
import { newSlashCommand } from '../../structures/BotClient';
import { prisma } from '../../database';
import { fetchOrCreateWebhook } from '../../util/webhook';
import { isTextChannelWithParent } from '../../util/types';

const data = new SlashCommandBuilder().setName('createwhispers').setDescription('Create whisper channels');
data.setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

export default newSlashCommand({
	data,
	execute: async (i) => {
		if (!i.guild) return i.reply({ content: 'This command can only be used in a server', ephemeral: true });

		const subsidiary = await prisma.subsidiaryServer.findUnique({
			where: {
				serverId: i.guild.id,
			},
		});

		if (!subsidiary) return i.reply({ content: 'This server is not registered as a subsidiary', ephemeral: true });

		const profiles = await prisma.profile.findMany({
			where: {
				categoryId: subsidiary.attachedCategoryId,
			},
		});

		if (profiles.length < 2) return i.reply({ content: 'Not enough profiles to create whisper channels', ephemeral: true });

		const categories: Record<string, CategoryChannel> = {};

		type StoredChannel = {
			channelId: string;
			targetId: string;
			webhookURL: string;
		};

		const channels: Record<string, StoredChannel[]> = {};

		for (const profile of profiles) {
			for (const secondaryProfile of profiles) {
				if (profile.id === secondaryProfile.id) continue;

				const createCategory = async (name: string, guild: Guild) => {
					const category = await guild.channels.create({
						name: name,
						type: ChannelType.GuildCategory,
						permissionOverwrites: [
							{
								id: guild.roles.everyone.id,
								deny: [PermissionFlagsBits.ViewChannel],
							},
						],
					});

					return category;
				};

				if (!categories[profile.accountId]) categories[profile.accountId] = await createCategory(profile.name, i.guild);
				if (!categories[secondaryProfile.accountId])
					categories[secondaryProfile.accountId] = await createCategory(secondaryProfile.name, i.guild);

				// CHECK IF CHANNELS EXIST

				const mainExists = channels[categories[profile.accountId].id].find((channel) => channel.targetId === secondaryProfile.accountId);
				const secondaryExists = channels[categories[secondaryProfile.accountId].id].find((channel) => channel.targetId === profile.accountId);

				// CREATE BOTH CHANNELS IF THEY DON'T|
				const mainChannel = await i.guild.channels.create({
					name: secondaryProfile.name,
					type: ChannelType.GuildText,
					parent: categories[profile.accountId],
				});

				const webhook = await fetchOrCreateWebhook(mainChannel);

				const secondaryChannel = await i.guild.channels.create({
					name: profile.name,
					type: ChannelType.GuildText,
					parent: categories[secondaryProfile.accountId],
				});

				const secondWebhook = await fetchOrCreateWebhook(secondaryChannel);

				// STORE ALL DATA IN THE DATABASE

				const result = await prisma.whisperChannel.createMany({
					data: [
						{
							channelId: mainChannel.id,
							targetChannelId: secondaryChannel.id,
							webhookURL: webhook.url,
							profileId: profile.id,
							targetId: secondaryProfile.id,
						},
						{
							channelId: secondaryChannel.id,
							targetChannelId: mainChannel.id,
							webhookURL: secondWebhook.url,
							profileId: secondaryProfile.id,
							targetId: profile.id,
						},
					],
				});

				// SEND A MESSAGE TO THE CHANNELS
			}
		}

		return i.reply({
			content: 'Test',
			ephemeral: true,
		});
	},
});
