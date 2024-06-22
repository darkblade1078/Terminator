import { Command, SapphireClient } from "@sapphire/framework";
import { EmbedBuilder, Guild } from "discord.js";
import { Server } from "../entities";
import { nation } from "pnwkit-2.0/build/src/interfaces/queries/nation";
import kit from 'pnwkit-2.0';

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
            .setTimestamp()
            .setFooter({ text: `Powered by ${this.client.user?.username}`, iconURL: `${this.client.user?.avatarURL()}` });

        return this.embed;
    }

    error(error: string): EmbedBuilder {

        this.embed
            .setTitle('Error')
            .setDescription(`${error}`)
            .setColor('Red')
            .setTimestamp()
            .setFooter({ text: `Powered by ${this.client.user?.username}`, iconURL: `${this.client.user?.avatarURL()}` });

        return this.embed;
    }

    viewSettingsEmbed(server: Server, guild: Guild): EmbedBuilder {

        this.embed
            .setTitle(`Settings for ${guild.name}`)
            .setColor('Blurple')
            .setTimestamp()
            .addFields(
                { name: 'Your Alliances', value: `${server.extensions ? server.extensions.split(',').join('\n') : "none"}`, inline: true },
                { name: 'Enemy Alliances', value: `${server.enemyAlliances ? server.enemyAlliances.split(',').join('\n') : "none"}`, inline: true },
                { name: 'War Notifications Channel', value: `${server.warNotificationsChannel ? server.warNotificationsChannel : 'none'}`, inline: true },
            )
            .setFooter({ text: `Powered by ${this.client.user?.username}`, iconURL: `${this.client.user?.avatarURL()}` });

        return this.embed;
    }

    whoEmbed(interaction: Command.ChatInputCommandInteraction, nation: nation): EmbedBuilder {

        const activeWars = kit.utilities.activeWars(Number(nation.id), nation.wars);

        this.embed
            .setTitle(`${nation.nation_name}`)
            .setColor('Blurple')
            .setThumbnail(`${nation.flag}`)
            .addFields(
                {
                    name: 'Basic',
                    value: `
                    🌐 [here](https://politicsandwar.com/nation/id=${nation.id})
                    🏙️ ${nation.num_cities}
                    🎨 ${nation.color}
                    💯 ${nation.score?.toLocaleString('en-US')}
                    🏛️ ${nation.domestic_policy?.toLocaleLowerCase().split('_').join(' ')}
                    💣 ${nation.war_policy?.toLocaleLowerCase().split('_').join(' ')}
                    `,
                    inline: true
                },
                { name: '\u200B', value: '\u200B', inline: true },
                {
                    name: 'War',
                    value: `
                    ⚔️${activeWars.offensive}/5
                    🛡️${activeWars.defensive}/3
                    🪖 ${nation.soldiers?.toLocaleString('en-US')}
                    ⚙️ ${nation.tanks?.toLocaleString('en-US')}
                    ✈️ ${nation.aircraft?.toLocaleString('en-US')}
                    🚢 ${nation.ships?.toLocaleString('en-US')}
                    🚀 ${nation.missiles?.toLocaleString('en-US')}
                    💥 ${nation.nukes?.toLocaleString('en-US')}
                    `,
                    inline: true
                },
                {
                    name: 'Discord',
                    value: `<@${interaction.user.id}>`,
                    inline: false
                }
            )
            .setTimestamp()
            .setFooter({ text: `Powered by ${this.client.user?.username}`, iconURL: `${this.client.user?.avatarURL()}` });

        return this.embed;
    }
}