import { ActionRowBuilder, ButtonBuilder, ButtonStyle, CategoryChannel, EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import { newSlashCommand } from '../../structures/BotClient';
import { prisma } from '../../database';

const data = new SlashCommandBuilder().setName('test').setDescription('Development only. Command to test');
data.setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

export default newSlashCommand({
	data,
	execute: async (i) => {
		if (!i.guild) return i.reply({ content: 'This command can only be used in a server', ephemeral: true });

		return i.reply({
			content: 'Test',
			ephemeral: true,
		});
	},
});
