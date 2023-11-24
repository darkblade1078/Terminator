import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Server {

    @PrimaryColumn({
        nullable: false,
    })
    serverId: string;

    @Column({
        nullable: false,
        default: "",
    })
    notificationsChannel: string;

    @Column({
        nullable: false,
        default: "",
    })
    alliances: string;

    @Column({
        nullable: false,
        default: "",
    })
    channel: string;
}

@Entity()
export class User {

    @PrimaryColumn({
        nullable: false,
    })
    discordId: string;

    @Column({
        nullable: false,
    })
    nationId: number;

    @Column({
        nullable: false,
    })
    verificationToken: string;

    @Column({
        nullable: false,
        default: false,
    })
    verified: boolean;
}