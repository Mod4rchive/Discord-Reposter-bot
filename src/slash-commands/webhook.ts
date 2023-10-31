import { PermissionFlagsBits, SlashCommandBuilder, TextChannel, inlineCode } from "discord.js";
import { SlashCommand } from "../types";

const command: SlashCommand = {
    command: new SlashCommandBuilder()
        .setName("webhook")
        .setDescription("creates a webhook in this channel")
        .addStringOption((option) => option.setName("name").setDescription("the webhook name").setRequired(true))
        .addAttachmentOption((option) =>
            option.setName("avatar").setDescription("the webhook avatar").setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    execute: async (interaction) => {
        await interaction.deferReply({ ephemeral: true });
        const name = interaction.options.getString("name", true);
        const avatar = interaction.options.getAttachment("avatar", true);

        const channel = interaction.channel as TextChannel;
        const webhook = await channel.createWebhook({ name, avatar: avatar.url });
        await interaction.editReply({ content: `${inlineCode(webhook.url)}` });
    }
};

export default command;
