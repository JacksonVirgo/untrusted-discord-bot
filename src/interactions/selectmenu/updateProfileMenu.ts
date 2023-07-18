import { SelectMenu } from '../../structures/interactions';

export default new SelectMenu('update-profile-menu').onExecute(async (i, cache) => {
	const role = cache;
	if (!role) return i.reply({ content: 'This select menu is invalid', ephemeral: true });

	const values = i.values;
	await i.deferReply({ ephemeral: true });

	return i.editReply({ content: 'This select menu is not yet implemented' });
});
