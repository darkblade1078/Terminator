import { Command, SapphireClient } from "@sapphire/framework";
import { EmbedBuilder, Guild } from "discord.js";
import { Server } from "../entities";
import { nation } from "pnwkit-2.0/build/src/interfaces/queries/nation";

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

        let now = Date.now();
        let created = new Date(nation.date).getTime();
        let last_active = new Date(nation.last_active).getTime();
        let creationTime = (now - created) / (3600000 * 24)

        let yearCheck = creationTime < 365 ? `${creationTime.toFixed(1)} days` : `${(creationTime / 365).toFixed(1)} years`;
        
        this.embed
            .setTitle(`${nation.nation_name}`)
            .setColor('Blurple')
            .setThumbnail(`${nation.flag}`)
            .addFields(
                {
                    name: 'Basic',
                    value: `
                    🏢 [Nation](https://politicsandwar.com/nation/id=${nation.id})
                    🇺🇳 [Alliance](https://politicsandwar.com/alliance/id=${nation.alliance_id})
                    🏗️ ${yearCheck}
                    ⏳ ${((now - last_active) / (3600000 * 2)).toFixed(1)} hours
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
                    ⚔️ ${nation.offensive_wars_count}/5
                    🛡️ ${nation.defensive_wars_count}/3
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