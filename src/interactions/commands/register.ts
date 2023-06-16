import { PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import { newSlashCommand } from '../../structures/BotClient';
import { prisma } from '../../database';

const data = new SlashCommandBuilder().setName('register').setDescription('Register a server as a subsidiary for this category');
data.setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

data.addChannelOption((option) => option.setName('category').setDescription('The category to register').setRequired(true));
data.addStringOption((option) => option.setName('serverid').setDescription('The ID of the server to register').setRequired(true));

export default newSlashCommand({
	data,
	execute: async (i) => {
		if (!i.guild) return i.reply({ content: 'This command can only be used in a server', ephemeral: true });

		const category = i.options.getChannel('category', true);
		const serverId = i.options.getString('serverid', true);

		const exists = await prisma.subsidiaryServer.findFirst({
			where: {
				OR: [
					{
						serverId: serverId,
					},
					{
						attachedCategoryId: category.id,
					},
				],
			},
		});

		if (exists) return i.reply({ content: 'Already registered either this server or category', ephemeral: true });

		const server = await prisma.subsidiaryServer.create({
			data: {
				serverId: serverId,
				attachedCategoryId: category.id,
				isVerified: true,
			},
		});

		if (!server) return i.reply({ content: 'Failed to register server', ephemeral: true });

		return i.reply({
			content: 'Registered server to the selected category',
			ephemeral: true,
		});
	},
});
