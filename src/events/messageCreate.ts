import {
    ActionRow,
    Attachment,
    Client,
    Embed,
    Events,
    Message,
    MessageActionRowComponent,
    TextChannel,
    WebhookClient
} from "discord.js";
import { BotEvent } from "../types";
import { delay } from "../utils/delay";

const event: BotEvent = {
    name: Events.MessageCreate,
    once: true,
    execute: async (message: Message, client: Client) => {
        // dont read messages from same bot
        if (message.author.id == client.user!.id) return;

        // repost only from guild messages
        if (!message.guildId || !message.guild) return;

        // check if message is from a hosted channel
        const reposts = await client.prisma.repost.findMany({
            where: { sourceGuildID: message.guildId, sourceChannelID: message.channelId },
            include: { replacements: true }
        });

        await Promise.allSettled(
            reposts.map((repost) => {
                return new Promise<void>(async (resolve) => {
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

                    if (repost.destinationType == "channel") {
                        // establish destination
                        const guild = await client.guilds.fetch(repost.destinationGuildID!);
                        if (!guild) return resolve();

                        const channel = (await guild.channels.fetch(repost.destinationGuildID!)) as TextChannel;
                        if (!channel) return resolve();

                        let msg: Message;
                        if (content == "") {
                            msg = await channel.send({ components, embeds, files });
                        } else {
                            msg = await channel.send({ content, components, embeds, files });
                        }
                        if (repost.pinMessages && msg.pinnable) await msg.pin().catch(console.error);
                        return resolve();
                    } else if (repost.destinationType == "webhook") {
                        // establish destination
                        const webhook = new WebhookClient({ url: repost.destinationWebhookURL! });

                        if (content == "") {
                            await webhook.send({ components, embeds, files });
                        } else {
                            await webhook.send({ content, components, embeds, files });
                        }
                        return resolve();
                    }
                    return resolve();
                });
            })
        );
    }
};

export default event;
