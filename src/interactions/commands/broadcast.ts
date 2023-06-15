import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	CategoryChannel,
	ChannelType,
	EmbedBuilder,
	SlashCommandBuilder,
	TextChannel,
} from 'discord.js';
import { newSlashCommand } from '../../structures/BotClient';
import { prisma } from '../../database';
import { fetchOrCreateWebhook } from '../../util/webhook';
import config from '../../config';

const data = new SlashCommandBuilder().setName('broadcast').setDescription('Send an anonymous broadcast');
data.addStringOption((option) => option.setName('message').setDescription('The message to send').setRequired(true));
data.addChannelOption((option) =>
	option
		.setName('channel')
		.setDescription('The channel to send the message to. Defaults to current')
		.addChannelTypes(ChannelType.GuildText)
		.setRequired(false)
);
export default newSlashCommand({
	data,
	execute: async (i) => {
		if (!i.guild) return i.reply({ content: 'This command can only be used in a server', ephemeral: true });
		if (i.channel?.type != ChannelType.GuildText) return i.reply({ content: 'This command can only be used in a text channel', ephemeral: true });
		if (i.guildId !== config.MAIN_SERVER_ID) return i.reply({ content: 'This command can only be used in the main server', ephemeral: true });

		await i.deferReply({ ephemeral: true });

		const channel = i.options.getChannel('channel', false) ?? i.channel;
		if (channel.type != ChannelType.GuildText) return i.editReply({ content: 'This command can only be used to post in a text channel' });
		if (typeof channel !== 'object') return i.editReply({ content: 'Invalid channel' });
		if (!('parentId' in channel)) return i.editReply({ content: 'This channel is not in a category' });
		if (!channel.parentId) return i.editReply({ content: 'This channel is not in a category' });

		try {
			const fetchedProfile = await prisma.profile.findUnique({
				where: {
					accountId_categoryId: {
						accountId: i.user.id,
						categoryId: channel.parentId,
					},
				},
			});

			if (!fetchedProfile) return i.editReply({ content: 'You must be verified to use this command' });
			if (!fetchedProfile.canBroadcast) return await i.editReply({ content: 'You are not whitelisted for broadcasts' });

			const whitelistedChannel = await prisma.channel.findUnique({
				where: {
					channelId: channel.id,
				},
			});
			if (!whitelistedChannel) return await i.editReply({ content: 'This channel is not whitelisted' });
			if (!whitelistedChannel.canBroadcast) return await i.editReply({ content: 'This channel is not whitelisted for broadcasts' });

			const messageData = i.options.getString('message', true);
			const webhook = await fetchOrCreateWebhook(channel as TextChannel);

			if (!whitelistedChannel) return await i.editReply({ content: 'This channel is not whitelisted' });

			await webhook.send({
				content: messageData,
				username: '[ Operation Leader ]',
			});

			await i.deleteReply();
		} catch (err) {
			return await i.editReply({ content: 'An error occured' });
		}
	},
});
