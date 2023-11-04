import { SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../types";

const command: SlashCommand = {
    command: new SlashCommandBuilder()
        .setName("channelinfo")
        .setDescription("view info about this channel")
        .setDMPermission(true),
    execute: async (interaction) => {
        await interaction.reply({
            content: `
**Guild ID:** ${interaction.guildId ? interaction.guildId : interaction.channelId}
**Channel ID:** ${interaction.channelId!}`
        });
    }
};

export default command;
