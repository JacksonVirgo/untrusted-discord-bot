import { ChannelType, ChatInputCommandInteraction, SlashCommandBuilder, TextChannel } from 'discord.js';
import { newSlashCommand } from '../../structures/BotClient';
import { prisma } from '../../database';
import { fetchOrCreateWebhook } from '../../util/webhook';

const data = new SlashCommandBuilder().setName('message').setDescription('Send an anonymous message');
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
	execute: async (i: ChatInputCommandInteraction) => {
		if (!i.guild) return i.reply({ content: 'This command can only be used in a server', ephemeral: true });
		if (i.channel?.type != ChannelType.GuildText) return i.reply({ content: 'This command can only be used in a text channel', ephemeral: true });
		await i.deferReply({ ephemeral: true });

		const channel = i.options.getChannel('channel', false) ?? i.channel;
		if (channel.type != ChannelType.GuildText) return i.editReply({ content: 'This command can only be used to post in a text channel' });

		if (typeof channel != 'object') return i.editReply({ content: 'Invalid channel' });
		if (!('parentId' in channel)) return i.editReply({ content: 'This channel is not in a category' });
		if (!channel.parentId) return i.editReply({ content: 'This channel is not in a category' });

		const user = await prisma.profile.findUnique({
			where: {
				accountId_categoryId: {
					accountId: i.user.id,
					categoryId: channel.parentId,
				},
			},
		});

		if (!user) return i.editReply({ content: 'You must be verified to use this command' });

		try {
			const messageData = i.options.getString('message', true);
			const webhook = await fetchOrCreateWebhook(channel as TextChannel);

			const whitelisted = await prisma.channel.findUnique({
				where: {
					channelId: channel.id,
				},
			});

			if (!whitelisted) return await i.editReply({ content: 'This channel is not whitelisted' });

			await webhook.send({
				content: messageData,
				avatarURL: user.avatarURL ?? undefined,
				username: user.name,
			});

			await i.deleteReply();
		} catch (err) {
			return await i.editReply({ content: 'An error occured' });
		}
	},
});
