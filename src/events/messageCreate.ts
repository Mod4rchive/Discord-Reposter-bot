import {
    ActionRow,
    Attachment,
    Client,
    Embed,
    Events,
    Message,
    MessageActionRowComponent,
    TextChannel,
    WebhookClient,
    bold,
    userMention
} from "discord.js";
import { BotEvent } from "../types";
import { delay } from "../utils/delay";

const event: BotEvent = {
    name: Events.MessageCreate,
    execute: async (message: Message, client: Client) => {
        // dont read messages from same bot
        if (message.author.id == client.user!.id) return;

        // repost only from guild messages
        if (!message.guildId || !message.guild) return;

        // check if message is from a hosted channel
        const reposts = await client.prisma.repost.findMany({
            where: { sourceGuildID: message.guildId, sourceChannelID: message.channelId, active: true },
            include: { replacements: true }
        });

        await Promise.allSettled(
            reposts.map((repost) => {
                return new Promise<void>(async (resolve, reject) => {
                    try {
                        if (message.webhookId && !repost.allowWebhooks) return resolve();

                        if (message.author.bot && !repost.allowBots) return resolve();

                        if (!message.author.bot && !repost.allowUsers) return resolve();

                        // delay message based on delay
                        await delay(repost.delay * 1000);

                        // build payload
                        const embeds: Embed[] = [];
                        if (repost.allowEmbeds) {
                            embeds.push(...message.embeds);
                        }

                        const files: Attachment[] = [];
                        if (repost.allowAttachments) {
                            files.push(...message.attachments.values());
                        }

                        const components: ActionRow<MessageActionRowComponent>[] = [];
                        if (repost.allowComponents) {
                            components.push(...message.components);
                        }

                        let content = `${repost.mentions}\n${message.content}`;
                        for (const replacement of repost.replacements) {
                            content = content.replace(replacement.find, replacement.replace);
                        }

                        // add nickname for webhook messages
                        if (repost.nickname && message.webhookId) {
                            const webhook = await message.fetchWebhook();
                            const nickname = `${bold(webhook.name)}`;
                            content = `${nickname}\n${content}`;
                        }

                        if (repost.destinationType == "channel") {
                            // establish destination
                            const guild = await client.guilds.fetch(repost.destinationGuildID!);
                            if (!guild) throw Error("invalid guild");

                            const channel = (await guild.channels.fetch(repost.destinationChannelID!)) as TextChannel;
                            if (!channel) throw Error("invalid channel");

                            // add nickname for member messages
                            if (repost.nickname && !message.webhookId) {
                                const member = await guild.members.fetch(message.author.id);
                                if (member) {
                                    const nickname = `${userMention(member.id)}`;
                                    content = `${nickname}\n${content}`;
                                } else {
                                    const nickname = `${bold(message.member!.displayName)}`;
                                    content = `${nickname}\n${content}`;
                                }
                            }

                            let msg: Message;
                            if (content == "") {
                                msg = await channel.send({ components, embeds, files });
                            } else {
                                msg = await channel.send({ content, components, embeds, files });
                            }
                            if (repost.pinMessages && msg.pinnable) await msg.pin().catch(console.error);
                        } else if (repost.destinationType == "webhook") {
                            // establish destination
                            const webhook = new WebhookClient({ url: repost.destinationWebhookURL! });

                            // add nickname for member messages
                            if (repost.nickname && !message.webhookId) {
                                const nickname = `${bold(message.member!.displayName)}`;
                                content = `${nickname}\n${content}`;
                            }

                            if (content == "") {
                                await webhook.send({ components, embeds, files });
                            } else {
                                await webhook.send({ content, components, embeds, files });
                            }
                        }

                        if (repost.deleteMessage && message.deletable) {
                            await message.delete().catch(console.error);
                        }
                        return resolve();
                    } catch (err) {
                        console.error(err);
                        return reject();
                    }
                });
            })
        );
    }
};

export default event;
