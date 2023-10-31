import {
    ChannelType,
    EmbedBuilder,
    PermissionFlagsBits,
    SlashCommandBuilder,
    SlashCommandSubcommandBuilder,
    TextChannel,
    inlineCode,
    userMention
} from "discord.js";
import { SlashCommand } from "../types";
import log from "../utils/log";
import buildRepostText from "../utils/buildRepostText";

const command: SlashCommand = {
    command: new SlashCommandBuilder()
        .setName("repost")
        .setDescription("commands related to a repost configuration from this server")
        .addSubcommand(
            new SlashCommandSubcommandBuilder()
                .setName(`add_channel`)
                .setDescription(`add a repost configuration (channel)`)
                .addChannelOption((option) =>
                    option
                        .setName("source")
                        .setDescription("the source channel")
                        .setRequired(true)
                        .addChannelTypes(ChannelType.GuildText)
                )
                .addStringOption((option) =>
                    option.setName("destination_guild_id").setDescription("the destination guild id").setRequired(true)
                )
                .addStringOption((option) =>
                    option
                        .setName("destination_channel_id")
                        .setDescription("the destination channel id")
                        .setRequired(true)
                )
        )
        .addSubcommand(
            new SlashCommandSubcommandBuilder()
                .setName(`add_webhook`)
                .setDescription(`add a repost configuration (webhook)`)
                .addChannelOption((option) =>
                    option
                        .setName("source")
                        .setDescription("the page number")
                        .setRequired(true)
                        .addChannelTypes(ChannelType.GuildText)
                )
                .addStringOption((option) =>
                    option
                        .setName("destination_webhook_url")
                        .setDescription("the destination webhook url")
                        .setRequired(true)
                )
        )
        .addSubcommand(
            new SlashCommandSubcommandBuilder()
                .setName(`view`)
                .setDescription(`view a repost configuration`)
                .addStringOption((option) =>
                    option.setName("repost_id").setDescription("the repost id").setRequired(true)
                )
        )
        .addSubcommand(
            new SlashCommandSubcommandBuilder()
                .setName(`remove`)
                .setDescription(`remove a repost configuration`)
                .addStringOption((option) =>
                    option.setName("repost_id").setDescription("the repost id").setRequired(true)
                )
        )
        .addSubcommand(
            new SlashCommandSubcommandBuilder()
                .setName(`enable`)
                .setDescription(`enable a repost configuration`)
                .addStringOption((option) =>
                    option.setName("repost_id").setDescription("the repost id").setRequired(true)
                )
        )
        .addSubcommand(
            new SlashCommandSubcommandBuilder()
                .setName(`disable`)
                .setDescription(`disable a repost configuration`)
                .addStringOption((option) =>
                    option.setName("repost_id").setDescription("the repost id").setRequired(true)
                )
        )
        .addSubcommand(
            new SlashCommandSubcommandBuilder()
                .setName(`update_source_allows`)
                .setDescription(`change user, bot, webhook allows settings in repost configuration`)
                .addStringOption((option) =>
                    option.setName("repost_id").setDescription("the repost id").setRequired(true)
                )
                .addBooleanOption((option) => option.setName("users").setDescription("allow users").setRequired(true))
                .addBooleanOption((option) => option.setName("bots").setDescription("allow bots").setRequired(true))
                .addBooleanOption((option) =>
                    option.setName("webhooks").setDescription("allow webhooks").setRequired(true)
                )
        )
        .addSubcommand(
            new SlashCommandSubcommandBuilder()
                .setName(`update_message_allows`)
                .setDescription(`change embed, components, attachments allows settings in repost configuration`)
                .addStringOption((option) =>
                    option.setName("repost_id").setDescription("the repost id").setRequired(true)
                )
                .addBooleanOption((option) => option.setName("embeds").setDescription("allow embeds").setRequired(true))
                .addBooleanOption((option) =>
                    option.setName("components").setDescription("allow components").setRequired(true)
                )
                .addBooleanOption((option) =>
                    option.setName("attachments").setDescription("allow attachments").setRequired(true)
                )
        )
        .addSubcommand(
            new SlashCommandSubcommandBuilder()
                .setName(`update_delay`)
                .setDescription(`change delay settings in repost configuration`)
                .addStringOption((option) =>
                    option.setName("repost_id").setDescription("the repost id").setRequired(true)
                )
                .addIntegerOption((option) =>
                    option.setName("delay").setDescription("the delay in seconds").setMinValue(0).setRequired(true)
                )
        )
        .addSubcommand(
            new SlashCommandSubcommandBuilder()
                .setName(`update_mentions`)
                .setDescription(`change mentions settings in repost configuration`)
                .addStringOption((option) =>
                    option.setName("repost_id").setDescription("the repost id").setRequired(true)
                )
                .addStringOption((option) =>
                    option.setName("mentions").setDescription("the repost mentions").setRequired(true)
                )
        )
        .addSubcommand(
            new SlashCommandSubcommandBuilder()
                .setName(`update_pin`)
                .setDescription(`change pin settings in repost configuration`)
                .addStringOption((option) =>
                    option.setName("repost_id").setDescription("the repost id").setRequired(true)
                )
                .addBooleanOption((option) =>
                    option
                        .setName("pin")
                        .setDescription("pin the reposted message (only available for channels)")
                        .setRequired(true)
                )
        )
        .addSubcommand(
            new SlashCommandSubcommandBuilder()
                .setName(`update_nickname`)
                .setDescription(`change nickname settings in repost configuration`)
                .addStringOption((option) =>
                    option.setName("repost_id").setDescription("the repost id").setRequired(true)
                )
                .addBooleanOption((option) =>
                    option
                        .setName("nickname")
                        .setDescription("add nickname of message author to reposted message")
                        .setRequired(true)
                )
        )
        .addSubcommand(
            new SlashCommandSubcommandBuilder()
                .setName(`update_delete`)
                .setDescription(`change delete settings in repost configuration`)
                .addStringOption((option) =>
                    option.setName("repost_id").setDescription("the repost id").setRequired(true)
                )
                .addBooleanOption((option) =>
                    option.setName("delete").setDescription("delete original message").setRequired(true)
                )
        )
        .addSubcommand(
            new SlashCommandSubcommandBuilder()
                .setName(`create_replacement`)
                .setDescription(`add content replacement in repost configuration`)
                .addStringOption((option) =>
                    option.setName("repost_id").setDescription("the repost id").setRequired(true)
                )
                .addStringOption((option) => option.setName("find").setDescription("the find text").setRequired(true))
                .addStringOption((option) =>
                    option.setName("replace").setDescription("the replace text").setRequired(true)
                )
        )
        .addSubcommand(
            new SlashCommandSubcommandBuilder()
                .setName(`delete_replacement`)
                .setDescription(`remove content replacement in repost configuration`)
                .addStringOption((option) =>
                    option.setName("repost_id").setDescription("the repost id").setRequired(true)
                )
                .addStringOption((option) => option.setName("find").setDescription("the find text").setRequired(true))
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    execute: async (interaction) => {
        await interaction.deferReply({ ephemeral: true });
        const subcommand = interaction.options.getSubcommand(true);
        if (subcommand == "add_channel") {
            const sourceChannel = interaction.options.getChannel("source", true) as TextChannel;
            const sourceGuildID = sourceChannel.guildId;
            const sourceChannelID = sourceChannel.id;
            const destinationGuildID = interaction.options.getString("destination_guild_id", true);
            const destinationChannelID = interaction.options.getString("destination_channel_id", true);

            const repost = await interaction.client.prisma.repost.create({
                data: {
                    sourceGuildID,
                    sourceChannelID,
                    destinationType: "channel",
                    destinationGuildID,
                    destinationChannelID
                }
            });

            const content = `${userMention(interaction.user.id)} has created a new repost configuration: ${inlineCode(
                repost.cuid
            )}`;
            await interaction.editReply({ content });
            await log({ title: "Repost Added", color: "Green", content });
        } else if (subcommand == "add_webhook") {
            const sourceChannel = interaction.options.getChannel("source", true) as TextChannel;
            const sourceGuildID = sourceChannel.guildId;
            const sourceChannelID = sourceChannel.id;
            const destinationWebhookURL = interaction.options.getString("destination_webhook_url", true);

            const repost = await interaction.client.prisma.repost.create({
                data: {
                    sourceGuildID,
                    sourceChannelID,
                    destinationType: "webhook",
                    destinationWebhookURL
                }
            });

            const content = `${userMention(interaction.user.id)} has created a new repost configuration: ${inlineCode(
                repost.cuid
            )}`;
            await interaction.editReply({ content });
            await log({ title: "Repost Added", color: "Green", content });
        } else if (subcommand == "view") {
            const cuid = interaction.options.getString("repost_id", true);
            const repost = await interaction.client.prisma.repost.findUnique({
                where: {
                    cuid,
                    sourceGuildID: interaction.guildId!
                },
                include: { replacements: true }
            });

            if (!repost) {
                await interaction.editReply({
                    content: `${cuid} is an invalid repost`
                });
                setTimeout(async () => {
                    await interaction.deleteReply().catch(console.error);
                }, 3 * 1000);
                return;
            }

            const text = buildRepostText(repost, repost.replacements);
            const embed = new EmbedBuilder().setColor("Random").setDescription(text).setTitle("Repost Configuration");
            await interaction.editReply({ embeds: [embed] });
        } else if (subcommand == "remove") {
            const cuid = interaction.options.getString("repost_id", true);
            const repost = await interaction.client.prisma.repost.findUnique({
                where: {
                    cuid,
                    sourceGuildID: interaction.guildId!
                }
            });

            if (!repost) {
                await interaction.editReply({
                    content: `${cuid} is an invalid repost`
                });
                setTimeout(async () => {
                    await interaction.deleteReply().catch(console.error);
                }, 3 * 1000);
                return;
            }

            await interaction.client.prisma.repost.delete({ where: { cuid, sourceGuildID: interaction.guildId! } });
            const content = `${userMention(interaction.user.id)} removed a repost configuration: ${inlineCode(cuid)}`;
            await interaction.editReply({ content });
            await log({ title: "Repost Removed", color: "Red", content });
        } else if (subcommand == "enable") {
            const cuid = interaction.options.getString("repost_id", true);
            const repost = await interaction.client.prisma.repost.findUnique({
                where: {
                    cuid,
                    sourceGuildID: interaction.guildId!
                }
            });

            if (!repost) {
                await interaction.editReply({
                    content: `${cuid} is an invalid repost`
                });
                setTimeout(async () => {
                    await interaction.deleteReply().catch(console.error);
                }, 3 * 1000);
                return;
            }

            await interaction.client.prisma.repost.update({
                where: { cuid, sourceGuildID: interaction.guildId! },
                data: {
                    active: true
                }
            });
            const content = `${userMention(interaction.user.id)} enabled a repost configuration: ${inlineCode(cuid)}`;
            await interaction.editReply({ content });
            await log({ title: "Repost Enabled", color: "Orange", content });
        } else if (subcommand == "disable") {
            const cuid = interaction.options.getString("repost_id", true);
            const repost = await interaction.client.prisma.repost.findUnique({
                where: {
                    cuid,
                    sourceGuildID: interaction.guildId!
                }
            });

            if (!repost) {
                await interaction.editReply({
                    content: `${cuid} is an invalid repost`
                });
                setTimeout(async () => {
                    await interaction.deleteReply().catch(console.error);
                }, 3 * 1000);
                return;
            }

            await interaction.client.prisma.repost.update({
                where: { cuid, sourceGuildID: interaction.guildId! },
                data: {
                    active: false
                }
            });
            const content = `${userMention(interaction.user.id)} disabled a repost configuration: ${inlineCode(cuid)}`;
            await interaction.editReply({ content });
            await log({ title: "Repost Disabled", color: "Orange", content });
        } else if (subcommand == "update_source_allows") {
            const cuid = interaction.options.getString("repost_id", true);
            const repost = await interaction.client.prisma.repost.findUnique({
                where: {
                    cuid,
                    sourceGuildID: interaction.guildId!
                }
            });

            if (!repost) {
                await interaction.editReply({
                    content: `${cuid} is an invalid repost`
                });
                setTimeout(async () => {
                    await interaction.deleteReply().catch(console.error);
                }, 3 * 1000);
                return;
            }

            const allowUsers = await interaction.options.getBoolean("users", true);
            const allowBots = await interaction.options.getBoolean("bots", true);
            const allowWebhooks = await interaction.options.getBoolean("webhooks", true);

            await interaction.client.prisma.repost.update({
                where: { cuid, sourceGuildID: interaction.guildId! },
                data: {
                    allowUsers,
                    allowBots,
                    allowWebhooks
                }
            });
            const content = `${userMention(interaction.user.id)} updated a repost configuration: ${inlineCode(cuid)}`;
            await interaction.editReply({ content });
            await log({ title: "Repost Updated", color: "Yellow", content });
        } else if (subcommand == "update_message_allows") {
            const cuid = interaction.options.getString("repost_id", true);
            const repost = await interaction.client.prisma.repost.findUnique({
                where: {
                    cuid,
                    sourceGuildID: interaction.guildId!
                }
            });

            if (!repost) {
                await interaction.editReply({
                    content: `${cuid} is an invalid repost`
                });
                setTimeout(async () => {
                    await interaction.deleteReply().catch(console.error);
                }, 3 * 1000);
                return;
            }

            const allowEmbeds = await interaction.options.getBoolean("embeds", true);
            const allowComponents = await interaction.options.getBoolean("components", true);
            const allowAttachments = await interaction.options.getBoolean("attachments", true);

            await interaction.client.prisma.repost.update({
                where: { cuid, sourceGuildID: interaction.guildId! },
                data: {
                    allowEmbeds,
                    allowComponents,
                    allowAttachments
                }
            });
            const content = `${userMention(interaction.user.id)} updated a repost configuration: ${inlineCode(cuid)}`;
            await interaction.editReply({ content });
            await log({ title: "Repost Updated", color: "Yellow", content });
        } else if (subcommand == "update_delay") {
            const cuid = interaction.options.getString("repost_id", true);
            const repost = await interaction.client.prisma.repost.findUnique({
                where: {
                    cuid,
                    sourceGuildID: interaction.guildId!
                }
            });

            if (!repost) {
                await interaction.editReply({
                    content: `${cuid} is an invalid repost`
                });
                setTimeout(async () => {
                    await interaction.deleteReply().catch(console.error);
                }, 3 * 1000);
                return;
            }

            const delay = await interaction.options.getInteger("delay", true);

            await interaction.client.prisma.repost.update({
                where: { cuid, sourceGuildID: interaction.guildId! },
                data: {
                    delay
                }
            });
            const content = `${userMention(interaction.user.id)} updated a repost configuration: ${inlineCode(cuid)}`;
            await interaction.editReply({ content });
            await log({ title: "Repost Updated", color: "Yellow", content });
        } else if (subcommand == "update_mentions") {
            const cuid = interaction.options.getString("repost_id", true);
            const repost = await interaction.client.prisma.repost.findUnique({
                where: {
                    cuid,
                    sourceGuildID: interaction.guildId!
                }
            });

            if (!repost) {
                await interaction.editReply({
                    content: `${cuid} is an invalid repost`
                });
                setTimeout(async () => {
                    await interaction.deleteReply().catch(console.error);
                }, 3 * 1000);
                return;
            }

            const mentions = await interaction.options.getString("mentions", true);

            await interaction.client.prisma.repost.update({
                where: { cuid, sourceGuildID: interaction.guildId! },
                data: {
                    mentions
                }
            });
            const content = `${userMention(interaction.user.id)} updated a repost configuration: ${inlineCode(cuid)}`;
            await interaction.editReply({ content });
            await log({ title: "Repost Updated", color: "Yellow", content });
        } else if (subcommand == "update_pin") {
            const cuid = interaction.options.getString("repost_id", true);
            const repost = await interaction.client.prisma.repost.findUnique({
                where: {
                    cuid,
                    sourceGuildID: interaction.guildId!
                }
            });

            if (!repost) {
                await interaction.editReply({
                    content: `${cuid} is an invalid repost`
                });
                setTimeout(async () => {
                    await interaction.deleteReply().catch(console.error);
                }, 3 * 1000);
                return;
            }

            const pinMessages = await interaction.options.getBoolean("pin", true);

            await interaction.client.prisma.repost.update({
                where: { cuid, sourceGuildID: interaction.guildId! },
                data: {
                    pinMessages
                }
            });
            const content = `${userMention(interaction.user.id)} updated a repost configuration: ${inlineCode(cuid)}`;
            await interaction.editReply({ content });
            await log({ title: "Repost Updated", color: "Yellow", content });
        } else if (subcommand == "update_nickname") {
            const cuid = interaction.options.getString("repost_id", true);
            const repost = await interaction.client.prisma.repost.findUnique({
                where: {
                    cuid,
                    sourceGuildID: interaction.guildId!
                }
            });

            if (!repost) {
                await interaction.editReply({
                    content: `${cuid} is an invalid repost`
                });
                setTimeout(async () => {
                    await interaction.deleteReply().catch(console.error);
                }, 3 * 1000);
                return;
            }

            const nickname = await interaction.options.getBoolean("nickname", true);

            await interaction.client.prisma.repost.update({
                where: { cuid, sourceGuildID: interaction.guildId! },
                data: {
                    nickname
                }
            });
            const content = `${userMention(interaction.user.id)} updated a repost configuration: ${inlineCode(cuid)}`;
            await interaction.editReply({ content });
            await log({ title: "Repost Updated", color: "Yellow", content });
        } else if (subcommand == "update_delete") {
            const cuid = interaction.options.getString("repost_id", true);
            const repost = await interaction.client.prisma.repost.findUnique({
                where: {
                    cuid,
                    sourceGuildID: interaction.guildId!
                }
            });

            if (!repost) {
                await interaction.editReply({
                    content: `${cuid} is an invalid repost`
                });
                setTimeout(async () => {
                    await interaction.deleteReply().catch(console.error);
                }, 3 * 1000);
                return;
            }

            const deleteMessage = await interaction.options.getBoolean("delete", true);

            await interaction.client.prisma.repost.update({
                where: { cuid, sourceGuildID: interaction.guildId! },
                data: {
                    deleteMessage
                }
            });
            const content = `${userMention(interaction.user.id)} updated a repost configuration: ${inlineCode(cuid)}`;
            await interaction.editReply({ content });
            await log({ title: "Repost Updated", color: "Yellow", content });
        } else if (subcommand == "create_replacement") {
            const cuid = interaction.options.getString("repost_id", true);
            const repost = await interaction.client.prisma.repost.findUnique({
                where: {
                    cuid,
                    sourceGuildID: interaction.guildId!
                }
            });

            if (!repost) {
                await interaction.editReply({
                    content: `${cuid} is an invalid repost`
                });
                setTimeout(async () => {
                    await interaction.deleteReply().catch(console.error);
                }, 3 * 1000);
                return;
            }
            const repostCUID = cuid;
            const find = await interaction.options.getString("find", true);
            const replace = await interaction.options.getString("replace", true);

            await interaction.client.prisma.replacement.upsert({
                where: { repostCUID, find },
                create: { repostCUID, find, replace },
                update: {
                    replace
                }
            });
            const content = `${userMention(interaction.user.id)} created a repost configuration: ${inlineCode(
                cuid
            )} replacement: ${inlineCode(find)} -> ${inlineCode(replace)}`;
            await interaction.editReply({ content });
            await log({ title: "Repost Replacement Created", color: "Yellow", content });
        } else if (subcommand == "delete_replacement") {
            const cuid = interaction.options.getString("repost_id", true);
            const repost = await interaction.client.prisma.repost.findUnique({
                where: {
                    cuid,
                    sourceGuildID: interaction.guildId!
                }
            });

            if (!repost) {
                await interaction.editReply({
                    content: `${cuid} is an invalid repost`
                });
                setTimeout(async () => {
                    await interaction.deleteReply().catch(console.error);
                }, 3 * 1000);
                return;
            }
            const repostCUID = cuid;
            const find = await interaction.options.getString("find", true);

            await interaction.client.prisma.replacement.delete({
                where: { repostCUID, find }
            });
            const content = `${userMention(interaction.user.id)} deleted a repost configuration: ${inlineCode(
                cuid
            )} replacement: ${inlineCode(find)}`;
            await interaction.editReply({ content });
            await log({ title: "Repost Replacement Deleted", color: "Yellow", content });
        }
    }
};

export default command;
