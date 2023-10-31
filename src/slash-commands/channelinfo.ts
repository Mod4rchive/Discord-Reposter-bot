import { SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../types";

const command: SlashCommand = {
    command: new SlashCommandBuilder().setName("channelinfo").setDescription("view info about this channel"),
    execute: async (interaction) => {
        await interaction.reply({
            content: `
**Guild ID:** ${interaction.guildId!}
**Channel ID:** ${interaction.channelId!}`
        });
    }
};

export default command;
