import { ButtonBuilder, ButtonStyle } from 'discord.js';
import { Button } from '../../structures/interactions';

export default new Button('blank')
	.setButton(new ButtonBuilder().setLabel('Blank Button').setStyle(ButtonStyle.Secondary))
	.onExecute(async (i, cache) => {
		if (!cache) return i.reply({ content: 'This button is invalid', ephemeral: true });
		if (!i.guild) return i.reply({ content: 'You need to be in a server to use this button', ephemeral: true });
		return i.reply({ content: 'This button is not yet implemented', ephemeral: true });
	});
