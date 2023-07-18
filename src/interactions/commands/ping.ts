import { PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import { newSlashCommand } from '../../structures/BotClient';

const data = new SlashCommandBuilder().setName('ping').setDescription('Command to ping the user of an anonymous profile.');

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
