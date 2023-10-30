import { ActivityType, Client } from "discord.js";
import { BotEvent } from "../types";

const event: BotEvent = {
    name: "ready",
    once: true,
    execute: async (client: Client) => {
        console.log(`${client.chalk.green("[events/ready]:")} ready! logged in as ` + client.user!.tag);
        console.log(
            `${client.chalk.green("[events/ready]:")} currently online at ` + client.guilds.cache.size + ` servers`
        );

        // sets the bot activity
        const setting = await client.prisma.setting.findUnique({
            where: {
                id: 1
            }
        });

        if (setting) {
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
    }
};

export default event;
