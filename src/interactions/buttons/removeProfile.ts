import { ActionRowBuilder, ButtonBuilder, ButtonStyle, UserSelectMenuBuilder } from 'discord.js';
import { Button } from '../../structures/interactions';
import removeProfileMenu from '../selectmenu/removeProfileMenu';

export default new Button('remove-profile').setButton(new ButtonBuilder().setLabel('Remove').setStyle(ButtonStyle.Secondary)).onExecute(async (i, cache) => {
	if (!cache) return i.reply({ content: 'This button is invalid', ephemeral: true });
	if (!i.guild) return i.reply({ content: 'You need to be in a server to use this button', ephemeral: true });

	const row = new ActionRowBuilder<UserSelectMenuBuilder>();
	row.addComponents(new UserSelectMenuBuilder().setCustomId(removeProfileMenu.createCustomID(cache)).setPlaceholder('Select a user').setMinValues(1).setMaxValues(1));

	return i.reply({ content: 'Select a user to remove a profile for (you will be asked to confirm)', components: [row], ephemeral: true });
});
