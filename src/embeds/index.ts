import { SapphireClient } from "@sapphire/framework";
import { EmbedBuilder } from "discord.js";

export default class embeds {
    private client: SapphireClient;
    private embed: EmbedBuilder;

    constructor(client: SapphireClient) {
        this.client = client;
        this.embed = new EmbedBuilder();
    }

    default(title: string, message: string): EmbedBuilder {

        this.embed
            .setTitle(`${title}`)
            .setDescription(`${message}`)
            .setColor('Blurple')
            .setFooter({ text: `Powered by ${this.client.user?.username}`, iconURL: `${this.client.user?.avatarURL()}` });

        return this.embed;
    }

    error(error: string): EmbedBuilder {

        this.embed
            .setTitle('Error')
            .setDescription(`${error}`)
            .setColor('Red')
            .setFooter({ text: `Powered by ${this.client.user?.username}`, iconURL: `${this.client.user?.avatarURL()}` });

        return this.embed;
    }
}