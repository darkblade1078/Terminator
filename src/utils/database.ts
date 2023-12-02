import { Container } from '@sapphire/pieces';
import { Server } from '../entities';

export default class databaseUtils {

    private container: Container;

    constructor(container: Container) {
        this.container = container;
    }

    async updateServerNotificationChannel() {

    }

    async initializeServersDatabase(): Promise<void> {

        const { serverDatabase, servers, client, logger } = this.container;

        //get all servers from the database
        const serverData = await serverDatabase.find();

        //remove servers that the bot left while it was offline
        serverData.map(async server => {

            if (client.guilds.cache.get(server.serverId) == null) {

                await serverDatabase.delete(server).catch(err => {
                    logger.error(err);
                });

                logger.info(`Removed Offline Server: (${server.serverId}) from the database.`);
            }
        });

        //copy all data from database to cache
        serverData.map(server => {
            servers.set(server.serverId, server);
        });

        //add servers that the bot joined while it was offline
        client.guilds.cache.map(async server => {

            if (servers.get(server.id) == null) {

                const newServer = new Server();
                newServer.serverId = server.id;

                await serverDatabase.insert(newServer).catch(err => {
                    logger.error(err);
                });
                logger.info(`Added Offline Server: ${server.name} (${server.id}) to the database.`);


                servers.set(server.id, {
                    serverId: server.id,
                    warNotificationsChannel: "",
                    yourAlliances: "",
                    enemyAlliances: "",
                    channel: "",
                });
            }
        });

        logger.info(`${servers.size} servers have been cached.`);
    }

    async initializeUsersDatabase(): Promise<void> {

        const { userDatabase, users, logger } = this.container;

        //get all servers from the database
        const userData = await userDatabase.find();

        users.set(`162782814062772225`, {
            discordId: `162782814062772225`,
            nationId: 227696,
            verificationToken: `test`,
            verified: true
        });

        //copy all data from database to cache
        userData.map(user => {
            users.set(user.discordId, user);
        });

        logger.info(`${users.size} users have been cached.`);
    }
}