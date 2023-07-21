import { ChannelType, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import { newSlashCommand } from '../../structures/BotClient';
import { prisma } from '../../database';
import config from '../../config';

const data = new SlashCommandBuilder().setName('whitelist').setDescription('Manage if a channel can be posted anonymously in');
data.addChannelOption((option) => option.setName('channel').setDescription('The channel to manage').setRequired(true).addChannelTypes(ChannelType.GuildText));
data.addBooleanOption((option) => option.setName('whitelist').setDescription('Whether to whitelist or blacklist the channel').setRequired(true));
data.addBooleanOption((option) => option.setName('broadcast').setDescription('Can be broadcast in (OL)').setRequired(false));
data.setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

export default newSlashCommand({
	data,
	mainServer: true,
	execute: async (i) => {
		if (!i.guild) return i.reply({ content: 'This command can only be used in a server', ephemeral: true });

		const channel = i.options.getChannel('channel', true);
		if (channel.type != ChannelType.GuildText) return i.editReply({ content: 'This command can only be used to post in a text channel' });
		if (typeof channel != 'object') return i.editReply({ content: 'Invalid channel' });
		if (!('parentId' in channel)) return i.editReply({ content: 'This channel is not in a category' });
		if (!channel.parentId) return i.editReply({ content: 'This channel is not in a category' });

		const whitelist = i.options.getBoolean('whitelist', true);
		const broadcast = i.options.getBoolean('broadcast', false);
		const checkChannel = await prisma.channel.findUnique({
			where: {
				channelId: channel.id,
			},
		});

		if (whitelist && checkChannel) {
			if (!broadcast || checkChannel.canBroadcast == broadcast) return i.reply({ content: 'This channel is already whitelisted', ephemeral: true });

			await prisma.channel.update({
				where: {
					channelId: channel.id,
				},
				data: {
					canBroadcast: broadcast,
				},
			});

			return i.reply({ content: `Updated <#${channel.id}> to be broadcastable (for OL)`, ephemeral: true });
		}
		if (!whitelist && !checkChannel) return i.reply({ content: 'This channel is already blacklisted', ephemeral: true });
		await i.deferReply({ ephemeral: true });

		if (whitelist) {
			await prisma.channel.create({
				data: {
					channelId: channel.id,
					canBroadcast: broadcast,
				},
			});
		}

		if (!whitelist) {
			await prisma.channel.delete({
				where: {
					channelId: channel.id,
				},
			});
		}

		return i.editReply({
			content: `<#${channel.id}> has been ${whitelist ? 'whitelisted' : 'blacklisted'}`,
		});
	},
});
