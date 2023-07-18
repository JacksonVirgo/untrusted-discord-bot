import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder, StringSelectMenuBuilder } from 'discord.js';
import { newSlashCommand } from '../../structures/BotClient';
import { prisma } from '../../database';
import { isCategory } from '../../util/types';
import { Button } from '../../structures/interactions';
import addProfile from '../buttons/addProfile';
import removeProfile from '../buttons/removeProfile';
import updateProfile from '../buttons/updateProfile';

const data = new SlashCommandBuilder().setName('profiles').setDescription('View and/or manage the profiles of a category');
data.setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

data.addChannelOption((o) => o.setName('category').setDescription('Category to view profiles of').addChannelTypes(ChannelType.GuildCategory).setRequired(true));

export default newSlashCommand({
	data,
	execute: async (i) => {
		if (!i.guild) return i.reply({ content: 'This command can only be used in a server', ephemeral: true });

		const category = i.options.getChannel('category', true);
		await i.deferReply({ ephemeral: true });

		if (!isCategory(category)) return i.editReply({ content: 'The channel is not a category' });

		const listOfProfiles = await prisma.profile.findMany({
			where: {
				categoryId: category.id,
			},
		});

		const embed = new EmbedBuilder();
		embed.setTitle(`Profiles in \`${category.name}\``);
		embed.setColor('#FFFFFF');

		if (listOfProfiles.length === 0) {
			embed.setDescription('No profiles found');
		} else {
			embed.setDescription(listOfProfiles.map((v) => `<@${v.accountId}> -> ${v.name}`).join('\n'));
		}

		const row = new ActionRowBuilder<ButtonBuilder>();
		row.addComponents(new ButtonBuilder().setCustomId(addProfile.createCustomID(category.id)).setLabel('Add').setStyle(ButtonStyle.Secondary));
		row.addComponents(new ButtonBuilder().setCustomId(removeProfile.createCustomID(category.id)).setLabel('Remove').setStyle(ButtonStyle.Secondary));
		row.addComponents(new ButtonBuilder().setCustomId(updateProfile.createCustomID(category.id)).setLabel('Update').setStyle(ButtonStyle.Secondary));

		return i.editReply({
			embeds: [embed],
			components: [row],
		});
	},
});
