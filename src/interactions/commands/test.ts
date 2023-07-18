import { ChannelType, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import { newSlashCommand } from '../../structures/BotClient';

const data = new SlashCommandBuilder().setName('test').setDescription('Development only. Command to test');
data.setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

export default newSlashCommand({
	data,
	execute: async (i) => {
		if (!i.guild) return i.reply({ content: 'This command can only be used in a server', ephemeral: true });

		const operatives: string[] = ['Alpha', 'Gamma', 'Zeta', 'Omikron', 'Delta', 'Echo', 'November', 'Epsilon', 'Theta', 'Sigma', 'Nightingale', 'Omega', 'Cerulea'];

		await i.deferReply({ ephemeral: true });

		for (const operative of operatives) {
			if (operative === 'Alpha') continue;

			const category = await i.guild.channels.create({
				name: `Op. ${operative}`,
				type: ChannelType.GuildCategory,
				permissionOverwrites: [
					{
						id: i.guild.roles.everyone.id,
						deny: [PermissionFlagsBits.ViewChannel],
					},
				],
			});

			if (!category) return i.reply({ content: 'Something went wrong', ephemeral: true });

			for (const second of operatives) {
				const channel = await i.guild.channels.create({
					name: `op-${second.toLowerCase()}`,
					type: ChannelType.GuildText,
					parent: category,
				});
			}
		}

		return i.editReply({
			content: 'Done',
		});
	},
});
