import { PermissionFlagsBits, SlashCommandBuilder, channelMention, inlineCode } from "discord.js";
import { SlashCommand } from "../types";

const command: SlashCommand = {
    command: new SlashCommandBuilder()
        .setName("reposts")
        .setDescription("view reposts configurations from this server")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDMPermission(true),
    execute: async (interaction) => {
        await interaction.deferReply({ ephemeral: true });

        const reposts = await interaction.client.prisma.repost.findMany({
            where: {
                sourceGuildID: interaction.guildId ? interaction.guildId : interaction.channelId
            },
            orderBy: {
                sourceChannelID: "asc"
            }
        });

        let text = ``;
        for (const repost of reposts) {
            text += `\n${channelMention(repost.sourceChannelID)} - ${inlineCode(repost.cuid)}`;
        }
        await interaction.editReply({ content: text });
    }
};

export default command;
