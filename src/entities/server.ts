import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import WarRoom from './warRoom';

@Entity()
export default class Server {

    @PrimaryColumn({
        nullable: false,
    })
    serverId: string;

    @Column({
        nullable: false,
        default: "",
    })
    mainAllianceId: string;

    @Column({
        nullable: false,
        default: "",
    })
    warNotificationsChannel: string;

    @Column({
        nullable: false,
        default: "",
    })
    extensions: string;

    @Column({
        nullable: false,
        default: "",
    })
    enemyAlliances: string;

    @Column({
        nullable: false,
        default: "",
    })
    warRoomCategoryId: string;

    @OneToMany(() => WarRoom, (room) => room.channelId)
    warRooms: WarRoom[]
}