import { ActivityType, Client } from "discord.js";
import { BotEvent } from "../types";

export async function setActivity(client: Client) {
    const setting = await client.prisma.setting.upsert({
        where: {
            id: 1
        },
        create: {
            id: 1
        },
        update: {}
    });

    let activity;
    switch (setting.activityType) {
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
    await client.user!.setActivity({
        name: setting.activityName,
        type: activity
    });
}

const event: BotEvent = {
    name: "ready",
    once: true,
    execute: async (client: Client) => {
        console.log(process.env.DATABASE_URL);

        console.log(`${client.chalk.green("[events/ready]:")} ready! logged in as ` + client.user!.tag);
        console.log(
            `${client.chalk.green("[events/ready]:")} currently online at ` + client.guilds.cache.size + ` servers`
        );

        // sets the bot activity
        const connect = false;
        if (connect) {
            await setActivity(client);
        }
    }
};

export default event;
