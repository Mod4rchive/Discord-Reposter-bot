import { SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../types";

const command: SlashCommand = {
    command: new SlashCommandBuilder().setName("ping").setDescription("replies with pong!").setDMPermission(true),
    execute: async (interaction) => {
        await interaction.reply("pong!");
    }
};

export default command;
