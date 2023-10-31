import { Replacement, Repost } from "@prisma/client";
import { inlineCode } from "discord.js";

function truthy(value: boolean): string {
    if (value) return "✅";
    return "❎";
}
export default function buildRepostText(repost: Repost, replacements: Replacement[]): string {
    let text = `
**Repost ID:** ${inlineCode(repost.cuid)}
**Source Guild ID:** ${inlineCode(repost.sourceGuildID)}
*Source Channel ID:** ${inlineCode(repost.sourceChannelID)}\n`;
    if (repost.destinationType == "channel") {
        text += `
**Destination Guild ID:** ${inlineCode(repost.destinationGuildID!)}
**Destination Channel ID:** ${inlineCode(repost.destinationChannelID!)}\n`;
    } else {
        text += `**Destination Webhook URL:** ${inlineCode(repost.destinationWebhookURL!)}\n`;
    }
    text += `
**Allow Users:** ${truthy(repost.allowUsers)}
**Allow Bots:** ${truthy(repost.allowBots)}
**Allow Webhooks:** ${truthy(repost.allowWebhooks)}\n`;
    text += `
**Allow Embeds:** ${truthy(repost.allowEmbeds)}
**Allow Components:** ${truthy(repost.allowComponents)}
**Allow Attachments:** ${truthy(repost.allowAttachments)}\n`;

    text += `
**Delay:** \`${repost.delay} seconds\`
**Mention:** ${repost.mentions}
**Pin Messages:** ${truthy(repost.pinMessages)}\n**Replacements:**`;

    for (const replacement of replacements) {
        text += `- ${inlineCode(replacement.find)} -> ${inlineCode(replacement.replace)}`;
    }
    return text;
}
