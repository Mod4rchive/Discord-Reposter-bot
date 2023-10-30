import { ActivityType, Colors, PermissionFlagsBits, SlashCommandBuilder, inlineCode, userMention } from "discord.js";
import { SlashCommand } from "../types";
import log from "../utils/log";
import { ActivityType as ActivityTypeText } from "@prisma/client";

const command: SlashCommand = {
    command: new SlashCommandBuilder()
        .setName("config")
        .setDescription("configure bot settings | staff-only")
        .addSubcommand((subcommand) =>
            subcommand
                .setName(`username`)
                .setDescription(`change bot username | staff-only`)
                .addStringOption((option) =>
                    option.setName("username").setDescription("new bot username").setRequired(true)
                )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName(`status`)
                .setDescription(`change bot status | staff-only`)
                .addStringOption((option) =>
                    option
                        .setName("activity_type")
                        .setDescription("bot activity type")
                        .setRequired(true)
                        .addChoices(
                            { name: "Playing", value: "Playing" },
                            { name: "Streaming", value: "Streaming" },
                            { name: "Listening", value: "Listening" },
                            { name: "Watching", value: "Watching" },
                            { name: "Competing", value: "Competing" }
                        )
                )
                .addStringOption((option) =>
                    option.setName("activity_name").setDescription("bot activity name").setRequired(true)
                )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName(`avatar`)
                .setDescription(`change bot avatar | staff-only`)
                .addAttachmentOption((option) =>
                    option.setName("avatar").setDescription("bot avatar").setRequired(true)
                )
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    execute: async (interaction) => {
        await interaction.deferReply({ ephemeral: true });
        const subcommand = interaction.options.getSubcommand(true);
        if (subcommand == "username") {
            const username = interaction.options.getString("username", true);
            await interaction.client.user.setUsername(username);
            const content = `${userMention(interaction.user.id)} changed ${userMention(
                interaction.client.user.id
            )}'s username to ${inlineCode(username)}`;
            await interaction.editReply({ content });
            await log({ title: "Username Changed", color: Colors.Red, description: content });
        } else if (subcommand == "status") {
            const type = interaction.options.getString("activity_type", true) as ActivityTypeText;
            const name = interaction.options.getString("activity_name", true);

            let activity;
            switch (type) {
                case "Playing":
                    activity = ActivityType.Playing;
                    break;
                case "Streaming":
                    activity = ActivityType.Streaming;
                    break;
                case "Listening":
                    activity = ActivityType.Listening;
                    break;
                case "Watching":
                    activity = ActivityType.Watching;
                    break;
                case "Competing":
                    activity = ActivityType.Competing;
                    break;
            }

            await interaction.client.user.setActivity({
                name: name,
                type: activity
            });

            await interaction.client.prisma.guild.upsert({
                where: {
                    guildID: interaction.guild!.id
                },
                create: {
                    guildID: interaction.guild!.id,
                    activityType: type,
                    activityName: name
                },
                update: { activityType: type, activityName: name }
            });

            const content = `${userMention(interaction.user.id)} changed ${userMention(
                interaction.client.user.id
            )}'s status to ${inlineCode(type + " " + name)}`;
            await interaction.editReply({ content });
            await log({ title: "Status Changed", color: Colors.Red, description: content });
        } else if (subcommand == "avatar") {
            const avatar = interaction.options.getAttachment("avatar", true);

            await interaction.client.user.setAvatar(avatar.url);

            const content = `${userMention(interaction.user.id)} changed ${userMention(
                interaction.client.user.id
            )}'s avatar`;
            await interaction.editReply({ content });
            await log({ title: "Avatar Changed", color: Colors.Red, description: content });
        }
    }
};

export default command;
