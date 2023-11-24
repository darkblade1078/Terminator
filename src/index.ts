import { SapphireClient, container } from '@sapphire/framework';
import { Collection, GatewayIntentBits } from 'discord.js';
import { DataSource, Repository } from 'typeorm';
import { Server, User } from './entities';
import 'reflect-metadata';
import dotenv from 'dotenv';

dotenv.config();

//make new client
const client = new SapphireClient({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

//declare typings in the container
declare module '@sapphire/pieces' {
    export interface Container {
        serverDatabase: Repository<Server>
        userDatabase: Repository<User>
        servers: Collection<string, Server>
        users: Collection<string, User>
    }
}

//create database connection and initialize it
const database = new DataSource({
    type: 'sqlite',
    database: 'database.sqlite',
    entities: [Server, User],
    synchronize: true,
    logging: false,
});
database.initialize();

//define data in the container
container.serverDatabase = database.getRepository(Server);
container.userDatabase = database.getRepository(User);
container.servers = new Collection();
container.users = new Collection();

client.login(`${process.env.BOT_TOKEN}`);