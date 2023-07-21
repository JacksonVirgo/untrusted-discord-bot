import { ActionRowBuilder, ButtonBuilder, ButtonStyle, CategoryChannel, ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { newSlashCommand } from '../../structures/BotClient';
import { prisma } from '../../database';
import config from '../../config';

const data = new SlashCommandBuilder().setName('list').setDescription('See the list of all anonymous profiles.');

export default newSlashCommand({
	data,
	mainServer: true,
	execute: async (i: ChatInputCommandInteraction) => {
		if (!i.guild) return i.reply({ content: 'This command can only be used in a server', ephemeral: true });

		await i.deferReply({ ephemeral: true });
		try {
			const users = await prisma.profile.findMany();
			const message = `${users.map((v) => `<@${v.accountId}> -> ${v.name}`).join('\n')}`;

			return i.editReply({
				content: message,
			});
		} catch (err) {
			console.log(err);
			await i.editReply({
				content: 'An error occured.',
			});
		}
	},
});
