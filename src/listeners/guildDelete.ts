import { Listener } from '@sapphire/framework';
import { ActivityType, Guild } from 'discord.js';

export class ReadyListener extends Listener {

    public constructor(context: Listener.LoaderContext, options: Listener.Options) {
        super(context, {
            ...options,
            once: true,
            event: 'guildDelete'
        });
    }

    public async run(guild: Guild): Promise<void> {
        const { client, servers, serverDatabase, logger } = this.container;

        await serverDatabase.delete({ serverId: guild.id }).catch(err => {
            logger.error(err);
        });

        logger.info(`Removed Server: ${guild.name} (${guild.id}) from the database.`);

        servers.delete(guild.id);

        //set bot activity
        client.user?.setActivity(`${client.guilds.cache.size} servers`, {
            type: ActivityType.Watching,
        });
    }
}