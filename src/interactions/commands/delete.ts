import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	CategoryChannel,
	ChannelType,
	EmbedBuilder,
	PermissionFlagsBits,
	SlashCommandBuilder,
} from 'discord.js';
import { newSlashCommand } from '../../structures/BotClient';
import { prisma } from '../../database';
import config from '../../config';

const data = new SlashCommandBuilder().setName('remove').setDescription("Remove someone's access to a specific name and avatar.");

data.addChannelOption((option) =>
	option
		.setName('category')
		.setDescription('The category to create the channel in')
		.addChannelTypes(ChannelType.GuildCategory)

		.setRequired(true)
);

data.addUserOption((option) => option.setName('user').setDescription('The user to apply the name and avatar to'));
data.addStringOption((option) => option.setName('name').setDescription('The name to apply'));
data.setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

export default newSlashCommand({
	data,
	execute: async (i) => {
		if (!i.guild) return i.reply({ content: 'This command can only be used in a server', ephemeral: true });
		if (i.guildId !== config.MAIN_SERVER_ID) return i.reply({ content: 'This command can only be used in the main server', ephemeral: true });

		const user = i.options.getUser('user', false);
		const name = i.options.getString('name', false);
		const category = i.options.getChannel('category', true);

		if (!user && !name) {
			return i.reply({ content: 'You must provide a user or name', ephemeral: true });
		}

		if (user && name) {
			return i.reply({ content: 'You must provide a user or name, not both', ephemeral: true });
		}

		if (user) {
			await prisma.profile.delete({
				where: {
					accountId_categoryId: {
						accountId: user.id,
						categoryId: category.id,
					},
				},
			});
		} else if (name) {
			await prisma.profile.delete({
				where: {
					name: name,
				},
			});
		} else {
			return i.reply({ content: 'You must provide a user or name', ephemeral: true });
		}

		return i.reply({
			content: `Removed ${user?.username ?? name}`,
			ephemeral: true,
		});
	},
});
