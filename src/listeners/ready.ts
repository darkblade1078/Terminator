import { Listener } from '@sapphire/framework';
import { ActivityType, type Client } from 'discord.js';
import databaseUtils from '../utils/database';

export class ReadyListener extends Listener {

    public constructor(context: Listener.LoaderContext, options: Listener.Options) {
        super(context, {
            ...options,
            once: true,
            event: 'ready'
        });
    }

    public async run(client: Client): Promise<void> {
        const { logger} = this.container;
        const { username, id } = client.user!;
        logger.info(`Successfully logged in as ${username} (${id})`);

        //initialize database utils
        const utils = new databaseUtils(this.container);

        //initialize servers database
        await utils.initializeServersDatabase();
        await utils.initializeUsersDatabase();

        //set bot activity
        client.user?.setActivity(`${client.guilds.cache.size} servers`, {
            type: ActivityType.Watching,
        });
    }
}