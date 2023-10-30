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
        await client.user!.setActivity({
            name: `scammers cry 📸`,
            type: ActivityType.Watching
        });
    }
};

export default event;
