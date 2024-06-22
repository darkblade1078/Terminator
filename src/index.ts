import { SapphireClient, container } from '@sapphire/framework';
import { Collection, GatewayIntentBits } from 'discord.js';
import { DataSource, Repository } from 'typeorm';
import { Server, TargetWar, User, WarRoom } from './entities';
import 'reflect-metadata';
import 'dotenv/config';

//make new client
const client = new SapphireClient({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

//declare typings in the container
declare module '@sapphire/pieces' {
    export interface Container {
        serverDatabase: Repository<Server>;
        userDatabase: Repository<User>;
        warRoomDatabase: Repository<WarRoom>;
        targetWarDatabase: Repository<TargetWar>;
        servers: Collection<string, Server>;
        users: Collection<string, User>;
        warRooms: Collection<string, WarRoom>;
        targetWars: Collection<string, TargetWar>;
    }
}

//create database connection and initialize it
const database = new DataSource({
    type: 'sqlite',
    database: 'database.sqlite',
    entities: ['entities/*.{ts,js}'],
    synchronize: true,
    logging: false,
});
database.initialize();

//define data in the container
container.serverDatabase = database.getRepository(Server);
container.userDatabase = database.getRepository(User);
container.warRoomDatabase = database.getRepository(WarRoom);
container.targetWarDatabase = database.getRepository(TargetWar);
container.servers = new Collection();
container.users = new Collection();
container.warRooms = new Collection();
container.targetWars = new Collection();

client.login(`${process.env.BOT_TOKEN}`);