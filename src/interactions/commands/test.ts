import { ChatInputCommandInteraction, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import { newSlashCommand } from '../../structures/BotClient';

const data = new SlashCommandBuilder().setName('test').setDescription('Development only. Command to test');
data.setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

export default newSlashCommand({
	data,
	mainServer: true,
	execute: async (i: ChatInputCommandInteraction) => {
		if (!i.guild) return i.reply({ content: 'This command can only be used in a server', ephemeral: true });
		if (i.user.id != '416757703516356628') return i.reply({ content: 'This command is for development only', ephemeral: true });
		const operatives: string[] = ['Alpha', 'Gamma', 'Zeta', 'Omikron', 'Delta', 'Echo', 'November', 'Epsilon', 'Theta', 'Sigma', 'Nightingale', 'Omega', 'Cerulea'];

		await i.deferReply({ ephemeral: true });
		return i.editReply({
			content: 'Done',
		});
	},
});
