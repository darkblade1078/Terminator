import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import TargetWar from './targetWar';
import Server from './server';

@Entity()
export default class WarRoom {

    @PrimaryColumn({
        nullable: false,
    })
    channelId: string;

    @Column({
        nullable: false,
    })
    enemyNation: number;

    @ManyToOne(() => Server, (server) => server.serverId)
    server: Server;

    @OneToMany(() => TargetWar, (war) => war.warId)
    targetWars: TargetWar[];
}