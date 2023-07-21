import {
	ChannelType,
	ChatInputCommandInteraction,
	PermissionFlagsBits,
	SlashCommandBuilder,
} from 'discord.js';
import { newSlashCommand } from '../../structures/BotClient';
import { prisma } from '../../database';
import config from '../../config';

const data = new SlashCommandBuilder().setName('threads').setDescription('Set up all appropriate private threads in this channel');
data.setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

export default newSlashCommand({
	data,
	mainServer: true,
	execute: async (i: ChatInputCommandInteraction) => {
		if (!i.guild) return i.reply({ content: 'This command can only be used in a server', ephemeral: true });

		const channel = i.channel;
		if (channel?.type !== ChannelType.GuildText) return i.reply({ content: 'This command can only be used in a text channel', ephemeral: true });
		const allUsers = await prisma.profile.findMany();

		for (let i = 0; i < allUsers.length; i++) {
			const user = allUsers[i];

			const startMessage = `## Welcome <@${user.accountId}>\nIf you send any messages here, it will be anonymously posted in <#${channel.id}>`;

			const thread = await channel.threads.create({
				name: user.name,
				invitable: false,
				type: ChannelType.PrivateThread,
			});

			thread.send({ content: startMessage });
		}

		return i.reply({
			content: 'Test',
			ephemeral: true,
		});
	},
});
