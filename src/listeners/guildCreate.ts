import { Listener } from '@sapphire/framework';
import { ActivityType, Guild } from 'discord.js';
import { Server } from '../entities';

export class ReadyListener extends Listener {

    public constructor(context: Listener.LoaderContext, options: Listener.Options) {
        super(context, {
            ...options,
            once: true,
            event: 'guildCreate'
        });
    }

    public async run(guild: Guild): Promise<void> {
        const { client, servers, serverDatabase, logger } = this.container;

        const newServer = new Server();
        newServer.serverId = guild.id;

        await serverDatabase.insert(newServer).catch(err => {
            logger.error(err);
        });
        logger.info(`Added Server: ${guild.name} (${guild.id}) to the database.`);

        servers.set(guild.id, {
            serverId: guild.id,
            mainAllianceId: "",
            warNotificationsChannel: "",
            extensions: "",
            enemyAlliances: "",
            warRoomCategoryId: "",
            warRooms: [],
        });

        //set bot activity
        client.user?.setActivity(`${client.guilds.cache.size} servers`, {
            type: ActivityType.Watching,
        });
    }
}