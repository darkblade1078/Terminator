import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import WarRoom from './warRoom';

@Entity()
export default class TargetWar {

    @PrimaryColumn({
        nullable: false,
    })
    warId: string;

    @Column({
        nullable: false,
    })
    attackerId: number;

    @Column({
        nullable: false,
    })
    defenderId: number;

    @ManyToOne(() => WarRoom, (room) => room.channelId)
    targetWars: WarRoom;
}