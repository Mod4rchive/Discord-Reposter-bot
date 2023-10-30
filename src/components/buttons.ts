import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";

const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder().setCustomId(`addusername`).setLabel(`Add Username`).setStyle(ButtonStyle.Secondary)
);

export default { row };
