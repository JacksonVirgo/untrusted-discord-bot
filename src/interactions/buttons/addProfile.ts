import { ActionRowBuilder, ButtonBuilder, ButtonStyle, UserSelectMenuBuilder } from 'discord.js';
import { Button } from '../../structures/interactions';
import addProfileMenu from '../selectmenu/addProfileMenu';

export default new Button('add-profile').setButton(new ButtonBuilder().setLabel('Add').setStyle(ButtonStyle.Secondary)).onExecute(async (i, cache) => {
	if (!cache) return i.reply({ content: 'This button is invalid', ephemeral: true });
	if (!i.guild) return i.reply({ content: 'You need to be in a server to use this button', ephemeral: true });

	const row = new ActionRowBuilder<UserSelectMenuBuilder>();
	row.addComponents(new UserSelectMenuBuilder().setCustomId(addProfileMenu.createCustomID(cache)).setPlaceholder('Select a user').setMinValues(1).setMaxValues(1));

	return i.reply({ content: 'Select a user to create a profile for', components: [row], ephemeral: true });
});
