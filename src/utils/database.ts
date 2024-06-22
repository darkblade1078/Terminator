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
                    mainAllianceId: "",
                    warNotificationsChannel: "",
                    extensions: "",
                    enemyAlliances: "",
                    warRoomCategoryId: "",
                    warRooms: []
                });
            }
        });

        logger.info(`${servers.size} servers have been cached.`);
    }

    async initializeUsersDatabase(): Promise<void> {

        const { userDatabase, users, logger } = this.container;

        //get all users from the database
        const userData = await userDatabase.find();

        //adds the user, "darkblade" to the database automatically
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

    async initializeWarRoomsDatabase() {

        const { warRoomDatabase, warRooms, logger } = this.container;

        //get all war rooms from the database
        const warRoomsData = await warRoomDatabase.find();

        //TODO add code that adds new war rooms while the bot was offline

        logger.info(`0 war rooms were added`);

        //TODO add code that removes uneeded war rooms while the bot was offline

        logger.info(`0 war rooms were removed`);

         //copy all data from database to cache
        warRoomsData.map(warRoom => {
            warRooms.set(warRoom.channelId, warRoom);
        });

        logger.info(`${warRooms.size} war rooms have been cached.`);
    }

    async initializeTargetWarsDatabase() {

        const { targetWarDatabase, targetWars, logger } = this.container;

        //get all war rooms from the database
        const targetWarsData = await targetWarDatabase.find();

        //TODO add code that adds new target wars while the bot was offline

        logger.info(`0 wars were added`);

        //TODO add code that removes uneeded target wars while the bot was offline

        logger.info(`0 wars were removed`);

         //copy all data from database to cache
         targetWarsData.map(targetWar => {
            targetWars.set(targetWar.warId, targetWar);
        });

        logger.info(`${targetWars.size} wars have been cached.`);
    }
}