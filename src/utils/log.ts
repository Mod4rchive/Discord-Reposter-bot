import { ColorResolvable, EmbedBuilder, WebhookClient } from "discord.js";
import trimString from "./trimString";

type LogPayload = {
    title: string;
    description: string;
    color?: ColorResolvable;
};

export default async function log({ title, description, color }: LogPayload) {
    return new Promise<void>(async (resolve, reject) => {
        try {
            const logsUrl = process.env.LOGS_URL;
            const webhookClient = new WebhookClient({ url: logsUrl });
            const trimmedDescription = trimString(description, 4000);
            const embed = new EmbedBuilder()
                .setTitle(title)
                .setDescription(trimmedDescription)
                .setColor(color ? color : `Random`)
                .setTimestamp();
            await webhookClient.send({ embeds: [embed] });
            resolve();
        } catch (err) {
            console.log(err);
            reject();
        }
    });
}
